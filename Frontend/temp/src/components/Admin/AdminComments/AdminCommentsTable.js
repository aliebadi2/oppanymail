import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import config from '../../../config';
import "./AdminCommentsTable.css"

const AdminCommentsTable = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${config.path}/admin/comments?skip=0&limit=100`, { withCredentials: true });
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const toggleCommentFlag = async (commentId, currentFlag) => {
    try {
      const newFlag = !currentFlag;
      await axios.patch(
        `${config.path}/admin/comments/flag/${commentId}?show_on_main=${newFlag}`, 
        {}, 
        { withCredentials: true }
      );
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, show_on_main: newFlag } : comment
      ));
    } catch (error) {}
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${config.path}/admin/comments/${commentId}`, { withCredentials: true });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {}
  };

  const handleRowClick = (comment) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedComment(null);
  };

  if (loading) return <p>در حال بارگذاری نظرات...</p>;

  return (
    <Container className="admin-comments-panel">
      <h2 className="my-4">مدیریت نظرات</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>شماره</th>
            <th>منتور</th>
            <th>منتی</th>
            <th>نظر</th>
            <th>امتیاز</th>
            <th>تاریخ</th>
            <th>وضعیت نمایش</th>
            <th>اقدامات</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={comment.id} onClick={() => handleRowClick(comment)} style={{ cursor: 'pointer' }}>
              <td>{index + 1}</td>
              <td>{comment.mentor_name} {comment.mentor_family_name}</td>
              <td>{comment.mentee_name} {comment.mentee_family_name}</td>
              <td>{comment.text.length > 30 ? `${comment.text.substring(0, 30)}...` : comment.text}</td>
              <td>{comment.score}</td>
              <td>{comment.date_created}</td>
              <td>{comment.show_on_main ? "نمایش داده می‌شود" : "نمایش داده نمی‌شود"}</td>
              <td>
                <Button
                  variant={comment.show_on_main ? "warning" : "success"}
                  onClick={(e) => { e.stopPropagation(); toggleCommentFlag(comment.id, comment.show_on_main); }}
                  className="me-2 admin-comments-button"
                >
                  {comment.show_on_main ? "لغو نمایش" : "نمایش"}
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => { e.stopPropagation(); deleteComment(comment.id); }}
                  className="admin-comments-button"
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>جزئیات نظر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComment && (
            <>
              <h5>منتور:</h5>
              <p>{selectedComment.mentor_name} {selectedComment.mentor_family_name}</p>
              <h5>منتی:</h5>
              <p>{selectedComment.mentee_name} {selectedComment.mentee_family_name}</p>
              <h5>امتیاز:</h5>
              <p>{selectedComment.score}</p>
              <h5>متن نظر:</h5>
              <p>{selectedComment.text}</p>
              <h5>تاریخ ایجاد:</h5>
              <p>{selectedComment.date_created}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className="admin-comments-close-button">
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCommentsTable;
