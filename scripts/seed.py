import os
import sys
import uuid
import bcrypt
import boto3
import requests
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Load env from api/.env
load_dotenv(Path(__file__).parent.parent / "api" / ".env")

# ── Config ───────────────────────────────────────────────────────────────────

DATABASE_URL   = os.environ["DIRECT_URL"]   # use direct connection for scripts
R2_ACCOUNT_ID  = os.environ["R2_ACCOUNT_ID"]
R2_ACCESS_KEY  = os.environ["R2_ACCESS_KEY_ID"]
R2_SECRET_KEY  = os.environ["R2_SECRET_ACCESS_KEY"]
R2_BUCKET      = os.environ["R2_BUCKET_NAME"]
R2_PUBLIC_URL  = os.environ["R2_PUBLIC_URL"]

# ── Data ─────────────────────────────────────────────────────────────────────

USERS = [
    {"username": "alice", "email": "alice@example.com", "password": "password123"},
    {"username": "bob",   "email": "bob@example.com",   "password": "password123"},
    {"username": "carol", "email": "carol@example.com", "password": "password123"},
    {"username": "dave",  "email": "dave@example.com",  "password": "password123"},
]

BLIPS = [
    {"username": "alice", "content": "Hello Blips! Just signed up 🎉",                               "image": None},
    {"username": "alice", "content": "Just deployed my first full-stack app on Render + Vercel! 🚀",  "image": "tech"},
    {"username": "bob",   "content": "Cloudflare R2 has zero egress fees. Absolute game changer.",    "image": "mountain"},
    {"username": "bob",   "content": "Render free tier is perfect for demos. Cold starts are worth it.", "image": None},
    {"username": "carol", "content": "Finally fixed cross-origin cookies. sameSite=none + secure=true 🔑", "image": None},
    {"username": "carol", "content": "Blips is live! Come check it out 🚀",                           "image": "city"},
    {"username": "dave",  "content": "Just joined! React + Express + PostgreSQL 🛠️",                  "image": None},
    {"username": "dave",  "content": "First time using Neon DB. Really impressed with the free tier.", "image": None},
]

# blip_index is 0-based per target user
COMMENTS = [
    {"username": "bob",   "target_user": "alice", "blip_index": 0, "content": "Welcome to Blips!"},
    {"username": "carol", "target_user": "alice", "blip_index": 0, "content": "Nice first post!"},
    {"username": "alice", "target_user": "bob",   "blip_index": 0, "content": "Completely agree on R2!"},
    {"username": "dave",  "target_user": "bob",   "blip_index": 1, "content": "Totally, Render has been great for me too."},
    {"username": "alice", "target_user": "carol", "blip_index": 0, "content": "Took me forever to figure that out too!"},
    {"username": "bob",   "target_user": "carol", "blip_index": 1, "content": "Just checked it out, looks great!"},
]

IMAGE_URLS = {
    "tech":     "https://picsum.photos/seed/tech/800/600",
    "mountain": "https://picsum.photos/seed/mountain/800/600",
    "city":     "https://picsum.photos/seed/city/800/600",
}

# ── R2 ────────────────────────────────────────────────────────────────────────

def upload_to_r2(image_bytes: bytes, name: str) -> str:
    r2 = boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        region_name="auto",
    )
    key = f"{uuid.uuid4()}.jpg"
    r2.put_object(Bucket=R2_BUCKET, Key=key, Body=image_bytes, ContentType="image/jpeg")
    return f"{R2_PUBLIC_URL}/{key}"

# ── Seed ─────────────────────────────────────────────────────────────────────

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # 1. Upload images
    print("📦 Uploading images to R2...")
    image_r2_urls = {}
    for key, url in IMAGE_URLS.items():
        print(f"  Downloading {key}...")
        res = requests.get(url, timeout=15)
        res.raise_for_status()
        r2_url = upload_to_r2(res.content, key)
        image_r2_urls[key] = r2_url
        print(f"  ✓ {key} → {r2_url}")

    # 2. Create users
    print("\n👤 Creating users...")
    user_ids = {}
    for u in USERS:
        cur.execute('SELECT id FROM "User" WHERE email = %s', (u["email"],))
        row = cur.fetchone()
        if row:
            print(f"  - {u['username']} already exists, skipping.")
            user_ids[u["username"]] = row[0]
            continue
        hashed = bcrypt.hashpw(u["password"].encode(), bcrypt.gensalt()).decode()
        cur.execute(
            'INSERT INTO "User" (username, email, password, "createdAt", "updatedAt") '
            'VALUES (%s, %s, %s, NOW(), NOW()) RETURNING id',
            (u["username"], u["email"], hashed),
        )
        user_ids[u["username"]] = cur.fetchone()[0]
        print(f"  ✓ Created user: {u['username']}")

    # 3. Create blips
    print("\n📝 Creating blips...")
    blips_by_user = {}
    for b in BLIPS:
        uid = user_ids[b["username"]]
        image_url = image_r2_urls.get(b["image"]) if b["image"] else None
        cur.execute(
            'INSERT INTO "Blip" (content, "imageUrl", "userId", "createdAt", "updatedAt") '
            'VALUES (%s, %s, %s, NOW(), NOW()) RETURNING id',
            (b["content"], image_url, uid),
        )
        blip_id = cur.fetchone()[0]
        blips_by_user.setdefault(b["username"], []).append(blip_id)
        flag = " 📷" if image_url else ""
        print(f"  ✓ {b['username']}: \"{b['content'][:45]}...\"{flag}")

    # 4. Create comments
    print("\n💬 Creating comments...")
    for c in COMMENTS:
        author_id = user_ids[c["username"]]
        target_blips = blips_by_user.get(c["target_user"], [])
        if c["blip_index"] >= len(target_blips):
            print(f"  - Skipping (blip not found)")
            continue
        blip_id = target_blips[c["blip_index"]]
        cur.execute(
            'INSERT INTO "Comment" (content, "blipId", "userId", "createdAt", "updatedAt") '
            'VALUES (%s, %s, %s, NOW(), NOW())',
            (c["content"], blip_id, author_id),
        )
        print(f"  ✓ {c['username']} → {c['target_user']}'s blip: \"{c['content']}\"")

    conn.commit()
    cur.close()
    conn.close()
    print("\n✅ Seed complete!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Seed failed: {e}", file=sys.stderr)
        sys.exit(1)
