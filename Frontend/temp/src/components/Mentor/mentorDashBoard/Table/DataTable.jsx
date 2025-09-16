// src/DataTable.js
import React from 'react';
import './DataTable.css';

const DataTable = () => {
  const data = [
    { amount: '$100', time: '10:00 AM' },
    { amount: '$200', time: '11:00 AM' }
  ];

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>مبلغ</th>
          <th>زمان</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.amount}</td>
            <td>{row.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
