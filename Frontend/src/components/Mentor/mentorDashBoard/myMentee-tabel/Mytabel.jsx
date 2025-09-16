import React from 'react';
import './Mytabel.css';
import { FaCircleArrowLeft } from "react-icons/fa6";

const data = [
  {
    id: 1,
    name: 'سعید مرادی',
    mentorship: 'مدیر محصول',
    demo: 'رایگان',
    payment: '-',
  },
  {
    id: 2,
    name: 'سعید مرادی',
    mentorship: 'مدیر محصول',
    demo: 'رایگان',
    payment: '-',
  },
  {
    id: 3,
    name: 'سعید مرادی',
    mentorship: 'مدیر محصول',
    demo: 'رایگان',
    payment: '-',
  },
  {
    id: 4,
    name: 'سعید مرادی',
    mentorship: 'مدیر محصول',
    demo: 'رایگان',
    payment: '-',
  },
  // اضافه کردن اطلاعات بیشتر در اینجا در صورت نیاز
];

const Mytabel = () => {
  return (
    <div className="my-table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>نام و نام خانوادگی</th>
            <th>نوع دوره</th>
            <th>عنوان دوره</th>
            <th>مبلغ پرداختی</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className='my-table-td-infos-container'>
                <div className='my-table-td-inner-containers'>
                {item.id}
                </div>
              </td>
              <td>{item.name}</td>
              <td>{item.mentorship}</td>
              <td>{item.demo}</td>
              <td>{item.payment}</td>
              <td className='action-buttons-container'>
                <button className="action-btn delete-btn">🗑️</button>
                <button className="action-btn"><FaCircleArrowLeft /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mytabel;
