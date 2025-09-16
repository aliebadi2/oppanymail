import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ onItemSelect }) => {
  const items = [
    { text: "مدیریت نظرها", index: 0 },
    { text: "مدیریت درخواست ها", index: 1 },
    { text: "منتور های جدید", index: 2 },
    { text: "مهارت ها", index: 3 },
    { text: "سوال های پرتکرار", index: 4 },
    { text: "مقالات", index: 5 },
  ];

  return (
    <div className='admin-sidebar-container'>
      <ul>
        {items.map((item) => (
          <li key={item.index}>
            <div
              className='admin-sidebar-item'
              onClick={() => onItemSelect(item.index)}
            >
              {item.text}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
