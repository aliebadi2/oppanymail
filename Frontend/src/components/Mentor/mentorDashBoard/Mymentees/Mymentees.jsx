import React from 'react';
import './Mymentees.css';
import MenteeCard from '../MenteeCard/MenteeCard';
import MyTable from '../myMentee-tabel/Mytabel'

const Mymentees = () => {
  const handleAccept = () => {
    console.log("Request accepted");
  };

  const handleReject = () => {
    console.log("Request rejected");
  };

  return (
    <div className='my-mentees-container'>
      {/* <div className='mentees-card-container'>
        <MenteeCard
          name="دانیال سیدی"
          infoLink="#"
          onAccept={handleAccept}
          onReject={handleReject}
        />
        <MenteeCard
          name="دانیال سیدی"
          infoLink="#"
          onAccept={handleAccept}
          onReject={handleReject}
        />
        <MenteeCard
          name="دانیال سیدی"
          infoLink="#"
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div> */}
      <h1 className='my-mentees-title'>
          منتی های شما:
      </h1>
      <div className="my-mentees-table">
        <MyTable />
      </div>
    </div>
  );
};

export default Mymentees;
