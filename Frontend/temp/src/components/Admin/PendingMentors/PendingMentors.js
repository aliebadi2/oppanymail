import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Modal, Image } from 'react-bootstrap';
import config from '../../../config';
import './PendingMentors.css';

const PendingMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const fetchPendingMentors = async () => {
    try {
      const response = await axios.get(`${config.path}/admin/pending_mentors`, { withCredentials: true });
      setMentors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  const validateMentor = async (mentorId, isValid) => {
    try {
      await axios.post(`${config.path}/admin/mentor/${mentorId}/validate?is_valid=${isValid}`, {}, { withCredentials: true });
      setMentors(mentors.filter(mentor => mentor.id !== mentorId));
    } catch (error) {
      console.error(`Error ${isValid ? 'approving' : 'rejecting'} mentor:`, error);
    }
  };

  const handleRowClick = (mentor) => {
    setSelectedMentor(mentor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMentor(null);
  };

  const downloadCV = (cvFilePath) => {
    if (cvFilePath) {
      window.open(`${config.path}/${cvFilePath}`, '_blank');
    } else {
      alert('فایل CV یافت نشد');
    }
  };

  if (loading) return <p>در حال بارگذاری منتورهای در انتظار...</p>;

  return (
    <Container>
      <h2 className="my-4">منتورهای در انتظار تایید</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>شماره</th>
            <th>نام کاربری</th>
            <th>ایمیل</th>
            <th>نام و نام خانوادگی</th>
            <th>مهارت‌ها</th>
            <th>اقدامات</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor, index) => (
            <tr key={mentor.id} onClick={() => handleRowClick(mentor)} style={{ cursor: 'pointer' }}>
              <td>{index + 1}</td>
              <td>{mentor.username}</td>
              <td>{mentor.email}</td>
              <td>{mentor.name} {mentor.family_name}</td>
              <td>{mentor.skills.join(', ')}</td>
              <td>
                <Button
                  variant="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    validateMentor(mentor.id, true);
                  }}
                  className="me-2"
                >
                  پذیرش
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    validateMentor(mentor.id, false);
                  }}
                >
                  رد کردن
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>جزئیات منتور</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMentor && (
            <div className="mentor-details">
              {selectedMentor.profile_image && (
                <div className="mentor-info">
                  <Image src={`${config.path}/${selectedMentor.profile_image}`} rounded fluid alt="Profile" />
                </div>
              )}
              <div className="mentor-info">
                <h5>نام و نام خانوادگی:</h5>
                <p>{selectedMentor.name} {selectedMentor.family_name}</p>
              </div>
              <div className="mentor-info">
                <h5>ایمیل:</h5>
                <p>{selectedMentor.email}</p>
              </div>
              <div className="mentor-info">
                <h5>شماره تلفن:</h5>
                <p>{selectedMentor.phone_number || 'ندارد'}</p>
              </div>
              <div className="mentor-info">
                <h5>مدرک:</h5>
                <p>{selectedMentor.degree}</p>
              </div>
              <div className="mentor-info">
                <h5>دانشگاه:</h5>
                <p>{selectedMentor.university}</p>
              </div>
              <div className="mentor-info">
                <h5>رشته تحصیلی:</h5>
                <p>{selectedMentor.field_of_study}</p>
              </div>
              <div className="mentor-info">
                <h5>شهر و کشور:</h5>
                <p>{selectedMentor.city}, {selectedMentor.country}</p>
              </div>
              <div className="mentor-info">
                <h5>بیوگرافی:</h5>
                <p>{selectedMentor.bio}</p>
              </div>
              <div className="mentor-info">
                <h5>مهارت‌ها:</h5>
                <p>{selectedMentor.skills.join(', ')}</p>
              </div>
              <Button variant="primary" onClick={() => downloadCV(selectedMentor.cv_file)}>
                دانلود فایل CV
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PendingMentors;
