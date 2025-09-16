import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import './AdminSkills.css';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [editSkill, setEditSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${config.path}/skills`, { withCredentials: true });
      setSkills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreateSkill = async () => {
    if (!newSkill.name || !newSkill.description) return;
    try {
      await axios.post(`${config.path}/admin/skills`, newSkill, { withCredentials: true });
      fetchSkills();
      setNewSkill({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  };

  const handleUpdateSkill = async () => {
    if (!editSkill || !editSkill.name || !editSkill.description) return;
    try {
      await axios.put(`${config.path}/admin/skills/${editSkill.id}`, editSkill, { withCredentials: true });
      fetchSkills();
      setEditSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(`${config.path}/admin/skills/${skillId}`, { withCredentials: true });
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div className="admin-skills-container">
      <h2>مدیریت مهارت‌ها</h2>

      <div className="admin-skills-create-skill">
        <input
          type="text"
          placeholder="نام مهارت"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="توضیحات"
          value={newSkill.description}
          onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
        />
        <button onClick={handleCreateSkill}>افزودن مهارت</button>
      </div>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <table className="admin-skills-table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نام</th>
              <th>توضیحات</th>
              <th>اقدامات</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.id}</td>
                <td>
                  {editSkill && editSkill.id === skill.id ? (
                    <input
                      type="text"
                      value={editSkill.name}
                      onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
                    />
                  ) : (
                    skill.name
                  )}
                </td>
                <td>
                  {editSkill && editSkill.id === skill.id ? (
                    <input
                      type="text"
                      value={editSkill.description}
                      onChange={(e) => setEditSkill({ ...editSkill, description: e.target.value })}
                    />
                  ) : (
                    skill.description
                  )}
                </td>
                <td>
                  {editSkill && editSkill.id === skill.id ? (
                    <div>
                      <button onClick={handleUpdateSkill}>ذخیره</button>
                      <button onClick={() => setEditSkill(null)}>لغو</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setEditSkill(skill)}>ویرایش</button>
                      <button onClick={() => handleDeleteSkill(skill.id)}>حذف</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSkills;
