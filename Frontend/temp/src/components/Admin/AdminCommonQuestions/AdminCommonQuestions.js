import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import config from "../../../config";
import "./AdminCommonQuestions.css";

function AdminCommonQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: "",
    answer: "",
    flag: false,
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${config.path}/admin/common-questions`, {
        withCredentials: true,
      });
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load questions");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.path}/admin/common-questions/${id}`, {
        withCredentials: true,
      });
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  const toggleFlag = async (id) => {
    try {
      await axios.put(`${config.path}/admin/common-questions/${id}/toggle_flag`, {}, {
        withCredentials: true,
      });
      fetchQuestions();
    } catch (err) {
      alert("Failed to toggle flag");
    }
  };

  const handleModalOpen = (type, question = {}) => {
    setModalType(type);
    setCurrentQuestion(question);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentQuestion({ id: null, question: "", answer: "", flag: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (modalType === "add") {
        await axios.post(`${config.path}/admin/common-questions`, currentQuestion, {
          withCredentials: true,
        });
      } else {
        await axios.put(
          `${config.path}/admin/common-questions/${currentQuestion.id}`,
          currentQuestion,
          { withCredentials: true }
        );
      }
      fetchQuestions();
      handleModalClose();
    } catch (err) {
      alert("Failed to save question");
    }
  };

  if (loading) {
    return <div className="admin-common-question-loading">Loading questions...</div>;
  }

  if (error) {
    return <div className="admin-common-question-error">{error}</div>;
  }

  return (
    <div className="admin-common-question-container">
      <h2 className="admin-common-question-section-title">مدیریت سوالات متداول</h2>
      <Button
        className="admin-common-question-add-question-btn"
        onClick={() => handleModalOpen("add")}
      >
        افزودن سوال جدید
      </Button>

      <Table bordered hover className="admin-common-question-questions-table">
        <thead>
          <tr>
            <th>سوال</th>
            <th>پاسخ</th>
            <th>وضعیت نمایش</th>
            <th>اقدامات</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.question}</td>
              <td>{question.answer}</td>
              <td>
                {question.flag ? "فعال" : "غیرفعال"}
                <Button
                  variant="link"
                  className="admin-common-question-toggle-flag-btn"
                  onClick={() => toggleFlag(question.id)}
                >
                  تغییر وضعیت
                </Button>
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleModalOpen("edit", question)}
                >
                  ویرایش
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(question.id)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "افزودن سوال" : "ویرایش سوال"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>سوال</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={currentQuestion.question}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>پاسخ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="answer"
                value={currentQuestion.answer}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            بستن
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            ذخیره
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminCommonQuestions;
