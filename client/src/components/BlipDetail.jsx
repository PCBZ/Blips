import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostWithAuth, fetchPutWithAuth, fetchDeleteWithAuth } from "../security/fetchWithAuth";
import { useAuth } from "../security/AuthContext";
import { fetchGet } from "../network/fetcher";

function BlipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blip, setBlip] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  useEffect(() => {
    const fetchBlip = async () => {
      try {
        const data = await fetchGet(`/api/blips/${id}`);
        setBlip(data);
        setContent(data.content);
        setImageUrl(data.imageUrl);
        setPreviewImage(data.imageUrl);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchComments = async () => {
      try {
        const data = await fetchGet(`/api/comments?blipid=${id}`);
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBlip();
    fetchComments();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (selectedImage) {
        formData.append("image", selectedImage); // Add the selected image file
      }
      const updatedBlip = await fetchPutWithAuth(`/api/blips/${id}`, formData, true);
      setBlip(updatedBlip);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Blip?");
    if (isConfirmed) {
      try {
        await fetchDeleteWithAuth(`/api/blips/${id}`);
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const newComment = await fetchPostWithAuth(`/api/comments`, {
        content: newCommentContent,
        blipId: id,
      });
      setComments([newComment, ...comments]);
      setNewCommentContent("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      const updatedComment = await fetchPutWithAuth(`/api/comments/${editingCommentId}`, {
        content: editingCommentContent,
      });
      setComments( (oldComments) => {
        const newComments = oldComments.filter((comment) => comment.id !== editingCommentId);
        return [updatedComment, ...newComments];
      });
      setEditingCommentId(null);
      setEditingCommentContent("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
    if (isConfirmed) {
      try {
        await fetchDeleteWithAuth(`/api/comments/${commentId}`);
        setComments((oldComments) => oldComments.filter((comment) => comment.id !== commentId));
      } catch (err) {
        setError(err.message);
      }
    }
  }

  if (!blip) return <p>Loading...</p>;

  return (
    <div>
      <h1>Blip Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        <strong>Posted by:</strong> {blip.user.username}
      </p>
      <p>
        <strong>Last updated at:</strong>{" "}
        {new Date(blip.updatedAt).toLocaleString()}
      </p>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <br />
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <div>
            <p>Image Preview:</p>
            {previewImage && <img src={previewImage} alt="Preview" style={{ width: "250px", height: "auto" }} />}
          </div>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>{blip.content}</p>
          <div>
            {blip.imageUrl && <img src={blip.imageUrl} alt="Blip" style={{ width: "250px", height: "auto" }}/>}
          </div>
          {user && user.id === blip.user.id && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}

      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
                <small>
                  Posted by <strong>{comment.user.username}</strong> at:{" "}
                  {new Date(comment.updatedAt).toLocaleString()}
                </small>
                {user && user.id === comment.user.id && (
                  <div>
                    <button onClick={() => handleEditComment(comment)}>Edit</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    {editingCommentId === comment.id && (
                      <div>
                        <textarea
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                        />
                        <br />
                        <button type="submit" onClick={handleUpdateComment}>
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingCommentId(null)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}

      <form onSubmit={handleAddComment}>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <br />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

export default BlipDetail;