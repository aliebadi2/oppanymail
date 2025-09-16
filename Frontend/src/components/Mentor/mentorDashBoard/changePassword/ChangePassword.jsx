import React, { useState } from 'react';
import axios from 'axios';
import config from "../../../../config";
import './ChangePassword.css';

const ChangePassword = () => {
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
        `${config.path}/mentor/update_password`,
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
    <div className="change-password-container">
      <h1 className="change-password-title">تغییر رمز عبور</h1>
      <div className="change-password-inner-container">
        <div className="change-password-group">
          <label className="change-password-label">رمز عبور قدیمی</label>
          <input
            type="password"
            name="old_password"
            placeholder="رمز عبور قدیمی"
            className={`change-password-password-container ${isFieldEmpty.oldPassword ? 'input-error' : ''}`}
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setIsFieldEmpty((prev) => ({ ...prev, oldPassword: !e.target.value }));
            }}
          />
        </div>
        <div className="change-password-group">
          <label className="change-password-label">رمز عبور جدید</label>
          <input
            type="password"
            name="new_password"
            placeholder="رمز عبور جدید"
            className={`change-password-password-container ${!passwordMatch || isFieldEmpty.newPassword ? 'input-error' : ''}`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setIsFieldEmpty((prev) => ({ ...prev, newPassword: !e.target.value }));
            }}
          />
        </div>
        <div className="change-password-group">
          <label className="change-password-label">تکرار رمز عبور جدید</label>
          <input
            type="password"
            name="new_password_repeat"
            placeholder="تکرار رمز عبور جدید"
            className={`change-password-password-container ${!passwordMatch || isFieldEmpty.newPasswordRepeat ? 'input-error' : ''}`}
            value={newPasswordRepeat}
            onChange={(e) => {
              setNewPasswordRepeat(e.target.value);
              setIsFieldEmpty((prev) => ({ ...prev, newPasswordRepeat: !e.target.value }));
            }}
          />
        </div>
        <button className="change-password-submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'در حال ارسال...' : 'تایید'}
        </button>
      </div>
      {error && <p className="change-password-error-message">{error}</p>}
    </div>
  );
};

export default ChangePassword;
