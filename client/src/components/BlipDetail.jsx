import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostWithAuth, fetchPutWithAuth, fetchDeleteWithAuth } from "../security/fetchWithAuth";
import { useAuth } from "../security/AuthContext";
import { fetchGet } from "../network/fetcher";
import "../css/BlipDetail.css";
import "../css/Comment.css";
import "../css/Blip.css";
import defaultAvatar from "../assets/images/default_avatar.jpg";

function BlipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blip, setBlip] = useState(null);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  useEffect(() => {
    document.title = "Blip - Blip Detail";
    const fetchBlip = async () => {
      try {
        const data = await fetchGet(`/api/blips/${id}`);
        setBlip(data);
        setContent(data.content);
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

  return (
    <div className="blip-detail-wrapper-parent">
      <div className="blip-detail-wrapper">
        <h1>Blip Details</h1>
        {error && !blip ? (
          <p style="error-message">{error}</p>
        ) : (
          <>
            {blip && (
              <>
                {isEditing ? (
                  <form className="detail-edit-container" onSubmit={handleUpdate}>
                    <textarea className="detail-edit-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <label>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>
                    {previewImage && (
                      <img className="blip-image" src={previewImage} alt="Preview" />
                    )}
                    <div className="detail-edit-button-container">
                      <button className="small-button" type="submit">save</button>
                      <button className="small-button" type="button" onClick={() => setIsEditing(false)}>cancel</button>
                    </div>
                  </form>
                ) : (
                  <div class='blip-container'>
                    <div className="blip-header">
                      <img 
                        src={blip.user.avatarUrl || defaultAvatar} 
                        alt={`${blip.user.username}'s avatar`} 
                        className="blip-avatar"
                        onClick={ (e) => {
                          e.stopPropagation();
                          if (user && blip.user.id === user.id) {
                            navigate('/profile');
                          } else {
                            navigate(`/guest-profile/${blip.user.id}`, { 
                              state: { 
                                username: blip.user.username, 
                                avatarUrl: blip.user.avatarUrl } 
                            });
                          }
                        }}
                      />
                      <label>
                        <strong>{blip.user.username}</strong> at:{" "}
                        {new Date(blip.updatedAt).toLocaleString()}
                      </label>
                    </div>
                    {blip.imageUrl && (
                      <img src={blip.imageUrl} alt="Blip" className="blip-image"/>
                    )}
                    <label>{blip.content}</label>
                    {user && user.id === blip.user.id && (
                      <div className="detail-edit-button-container">
                        <button className="small-button" onClick={() => setIsEditing(true)}>edit</button>
                        <button className="small-button" onClick={handleDelete}>delete</button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
    
            {/* Comments Section */}
            <h2>Comments</h2>
            <div className="comment-container">
            {comments.length > 0 ? (
              <ul className="comment-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="comment-item">
                    <p className="comment-content">{comment.content}</p>
                    <small className="comment-meta">
                      <strong>{comment.user.username}</strong> at:{" "}
                      {new Date(comment.updatedAt).toLocaleString()}
                    </small>
                    {user && user.id === comment.user.id && (
                      <div className="comment-actions">
                        <div className="buttons-container">
                          <button className="small-button" onClick={() => handleEditComment(comment)}>edit</button>
                          <button className="small-button" onClick={() => handleDeleteComment(comment.id)}>delete</button>
                        </div>
                        {editingCommentId === comment.id && (
                          <div className="comment-edit">
                            <textarea
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                            />
                            <div className="buttons-container">
                              <button className="small-button" onClick={handleUpdateComment}>save</button>
                              <button className="small-button" onClick={() => setEditingCommentId(null)}>cancel</button>
                            </div>
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

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="new-comment-textarea"
              />
              <button type="submit" className="big-button">Add Comment</button>
            </form>
            </div>
          </>
        )}
      </div>
    </div>
  );

}



export default BlipDetail;