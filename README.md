# Blip: A Social Network Application

Blip is a React-based social network application where users can share their thoughts as "blips" which contains text and image and interact with others by commenting on their posts. It features user authentication, profile management, and a user-friendly interface for creating and viewing posts.

## Features

- **Authentication**:
  - Login and registration functionality with token-based authentication.
  - Automatic redirection for unauthenticated users.
 
- **Blips Viewing and Interacting**:
  - A list of blips showing in home page, enabling users view.
  - View blip details, including comments and the timestamp of creation or updates.
    
- **Profile Management**:
  - View profile information (e.g., username, email).
  - Upload and preview a new avatar image before saving.
  - View personal blips.

- **Comments**:
  - Add comments to any blip.
  - Display all comments for a specific blip.

- **Logout**:
  - Seamless logout with redirection to the home page.

## Backend API:
The backend is implemented in the api/ folder and provides RESTful endpoints for the application. API contains:

| Endpoint                  | Method | Description                                            |
|---------------------------|--------|--------------------------------------------------------|
| `/api/auth/login`         | POST   | Logs in a user with email and password.                |
| `/api/auth/register`      | POST   | Registers a new user.                                  |
| `/api/auth/me`            | GET    | Returns the authenticated user's data.                 |
| `/api/auth/logout`        | POST   | Logs out the user and clears their session.            |
| `/api/auth/upload-avatar` | PUT    | Allows the user to upload an avatar image.             |
| `/api/blips`              | GET    | Retrieves all blips (user's and others').              |
| `/api/blips`              | POST   | Creates a new blip with text and optional image.       |
| `/api/blips/:id`          | PUT    | Updates a blip.                                        |
| `/api/blips/:id`          | DELETE | Deletes a blip.                                        |
| `/api/blips/:id`          | GET    | Get a blip                                             |
| `/api/comments?blipid=id` | GET    | Retrieves comments for a specific blip.                |
| `/api/comments?blipid=id` | POST   | Adds a comment to a specific blip.                     |
| `/api/comments/:id`       | PUT    | Updates a comment.                                     |
| `/api/comments/:id`       | DELETE | Deletes a comment.                                     |

## Database Schema
### User Table
| Field      | Type      | Constraints                          |
|------------|-----------|--------------------------------------|
| `id`       | `Int`     | Primary Key, Auto-increment          |
| `username` | `String`  | Unique                               |
| `email`    | `String`  | Unique                               |
| `avatarUrl`| `String?` | Nullable                             |
| `password` | `String`  |                                      |
| `createdAt`| `DateTime`| Default: `now()`                     |
| `updatedAt`| `DateTime`| Auto-update on change                |
| `Blip`     | Relation  | One-to-Many with `Blip`              |
| `Comment`  | Relation  | One-to-Many with `Comment`           |

### Blip Table
| Field      | Type      | Constraints                          |
|------------|-----------|--------------------------------------|
| `id`       | `Int`     | Primary Key, Auto-increment          |
| `content`  | `String`  |                                      |
| `imageUrl` | `String?` | Nullable                             |
| `userId`   | `Int`     | Foreign Key -> `User.id`             |
| `createdAt`| `DateTime`| Default: `now()`                     |
| `updatedAt`| `DateTime`| Auto-update on change                |
| `Comment`  | Relation  | One-to-Many with `Comment`           |

### Comment Table
| Field      | Type      | Constraints                          |
|------------|-----------|--------------------------------------|
| `id`       | `Int`     | Primary Key, Auto-increment          |
| `content`  | `String`  |                                      |
| `blipId`   | `Int`     | Foreign Key -> `Blip.id`             |
| `userId`   | `Int`     | Foreign Key -> `User.id`             |
| `createdAt`| `DateTime`| Default: `now()`                     |
| `updatedAt`| `DateTime`| Auto-update on change                |
| `user`     | Relation  | Many-to-One with `User`              |
| `blip`     | Relation  | Many-to-One with `Blip`              |

### Prerequisites
- **Node.js installed**
- **Prisma ORM**
- **Database(MySql)**

### Setup
1. Navigate to folder
   ```
   cd API/
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Apply prisma
   ```
   npm prisma db push
   ```
4. start server
   ```
   npx nodemon service.js
   ```

## Frontend

### Prerequisites
- Node.js

### Installation
1. Navigate to folder
   ```
   cd client/
   ```
2. Install dependencies
   ```
   npm install
   ```
3. start development server
   ```
   npm start
   ```

## Example Usage
1. Register or log in using the provided forms.
2. View your profile, upload a new avatar, and browse your posts.
3. Create a new blip and see it appear in the feed.
4. Comment on your blips or others’.
5. Log out when done.

### Screenshot
| Screen                  | Screenshot Link   |
|-------------------------|-------------------|
| Register Page           | <img width="280" alt="Screenshot 2024-11-29 at 22 10 50" src="https://github.com/user-attachments/assets/f0ad99c9-e4df-4887-ab1e-2d81475be2bf"> |
| Login Page              | <img width="280" alt="Screenshot 2024-11-29 at 22 12 55" src="https://github.com/user-attachments/assets/e64a0f6d-60c4-49f3-b5c2-239efb384053"> |
| Home Page               | <img width="283" alt="Screenshot 2024-11-29 at 21 54 39" src="https://github.com/user-attachments/assets/51d4a6c1-c5d3-4260-a2dc-a8221f376cb8"> |
| Blip Detail Page        | <img width="281" alt="Screenshot 2024-11-29 at 22 09 03" src="https://github.com/user-attachments/assets/b2c41301-1015-406c-a233-5f76e67b00b7"> |
| Profile Page            | <img width="282" alt="Screenshot 2024-11-29 at 22 09 57" src="https://github.com/user-attachments/assets/846a9cdc-142f-4dba-8e0d-5c406a63bce2"> |
| Blip Post Page          | <img width="281" alt="Screenshot 2024-11-29 at 21 58 43" src="https://github.com/user-attachments/assets/deae6f46-0ba9-4bb1-89f2-da46dd9a0017"> |
