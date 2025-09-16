import React, { useState } from 'react';
import axios from 'axios';
import config from "../../../../../config";
import './MenteeChangePassword.css';

const MenteeChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [error, setError] = useState(null);
  const [isFieldEmpty, setIsFieldEmpty] = useState({
    oldPassword: false,
    newPassword: false,
    newPasswordRepeat: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    try {
      const response = await axios.put(
        `${config.path}/mentee/update_password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setError(null);
        alert('رمز عبور با موفقیت تغییر کرد');
        setOldPassword('');
        setNewPassword('');
        setNewPasswordRepeat('');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'مشکلی به وجود آمده. لطفا دوباره امتحان کنید.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setIsFieldEmpty({
      oldPassword: !oldPassword,
      newPassword: !newPassword,
      newPasswordRepeat: !newPasswordRepeat,
    });

    if (!oldPassword || !newPassword || !newPasswordRepeat) {
      setError('لطفا تمامی فیلدهای ضروری را پر کنید.');
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      setError('اتصال برقرار نیست. لطفا اتصال خود را بررسی کنید.');
      setLoading(false);
      return;
    }

    if (newPassword !== newPasswordRepeat) {
      setError('کلمه عبور جدید با تکرار کلمه عبور جدید تطابق ندارد.');
      setPasswordMatch(false);
      setLoading(false);
      return;
    }

    setError(null);
    setPasswordMatch(true);
    changePassword();
  };

  return (
    <div className="mentee-dashboard-change-password-container">
      <h1 className="mentee-dashboard-change-password-title">تغییر رمز عبور</h1>
      <div className="mentee-dashboard-change-password-inner-container">
        <div>
          <div className="mentee-dashboard-change-password-group">
            <label className="mentee-dashboard-change-password-label">رمز عبور قدیمی</label>
            <input
              type="password"
              name="old_password"
              placeholder="رمز عبور قدیمی"
              className={`mentee-dashboard-change-password-password-container ${isFieldEmpty.oldPassword ? 'mentee-dashboard-input-error' : ''}`}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setIsFieldEmpty((prev) => ({ ...prev, oldPassword: !e.target.value }));
              }}
            />
          </div>
          <div className="mentee-dashboard-change-password-group">
            <label className="mentee-dashboard-change-password-label">رمز عبور جدید</label>
            <input
              type="password"
              name="new_password"
              placeholder="رمز عبور جدید"
              className={`mentee-dashboard-change-password-password-container ${!passwordMatch || isFieldEmpty.newPassword ? 'mentee-dashboard-input-error' : ''}`}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setIsFieldEmpty((prev) => ({ ...prev, newPassword: !e.target.value }));
              }}
            />
          </div>
        </div>

        <ul className="mentee-dashboard-change-password-rules-container">
          <li>
            <p>فلان فلان فلان فلان فلان</p>
          </li>
        </ul>

        <div className="mentee-dashboard-change-password-group">
          <label className="mentee-dashboard-change-password-label">تکرار رمز عبور جدید</label>
          <input
            type="password"
            name="new_password_repeat"
            placeholder="تکرار رمز عبور جدید"
            className={`mentee-dashboard-change-password-password-container ${!passwordMatch || isFieldEmpty.newPasswordRepeat ? 'mentee-dashboard-input-error' : ''}`}
            value={newPasswordRepeat}
            onChange={(e) => {
              setNewPasswordRepeat(e.target.value);
              setIsFieldEmpty((prev) => ({ ...prev, newPasswordRepeat: !e.target.value }));
            }}
          />
        </div>

        <button className="mentee-dashboard-change-password-submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'در حال ارسال...' : 'تایید'}
        </button>
      </div>
      {error && <p className="mentee-dashboard-change-password-error-message">{error}</p>}
    </div>
  );
};

export default MenteeChangePassword;
