import React, { useState } from 'react';
import './MentorTrackerItem.css';
import lineIcon from '../../../../../../assets/Edit - 2.svg';
import trashIcon from '../../../../../../assets/Trash.svg';

const MentorTrackerItem = ({ level, title, description, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onSave(editedTitle, editedDescription);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(title);
    setEditedDescription(description);
  };

  const levelLabel = () => {
    const levels = [
      "مرحله اول",
      "مرحله دوم",
      "مرحله سوم",
      "مرحله چهارم",
      "مرحله پنجم",
      "مرحله ششم",
      "مرحله هفتم",
      "مرحله هشتم",
      "مرحله نهم",
    ];
    return levels[level - 1] || `مرحله ${level}`;
  };

  return (
    <div className="m-t-i-container">
      <div className="m-t-i-edit-level-container">
        <div className="m-t-i-fisrt-level-container">{levelLabel()}</div>
        <div className="m-t-i-edit-tools-container">
          {!isEditing ? (
            <>
              <button onClick={handleEditClick} aria-label="Edit milestone">
                <img src={lineIcon} alt="Edit milestone" />
              </button>
              <button onClick={onDelete} aria-label="Delete milestone">
                <img src={trashIcon} alt="Delete milestone" />
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSaveClick} aria-label="Save milestone">
                ذخیره
              </button>
              <button onClick={handleCancelClick} aria-label="Cancel editing">
                لغو
              </button>
            </>
          )}
        </div>
      </div>
      <div className="m-t-i-level-section">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="عنوان مایلستون"
          />
        ) : (
          <p>{title}</p>
        )}
      </div>
      <div className="m-t-i-explain">
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="توضیحات مایلستون"
          />
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
};

export default MentorTrackerItem;
