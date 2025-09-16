import React, { useState } from 'react';
import './AdminPanel.css';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import AdminCommentsTable from './AdminComments/AdminCommentsTable';
import PendingMentors from './PendingMentors/PendingMentors';
import AdminSkills from './AdminSkills/AdminSkills';
import AdminCommonQuestions from './AdminCommonQuestions/AdminCommonQuestions';
import AdminManageRequests from './AdminManageRequests/AdminManageRequests';
import AdminDashboardArticles from './AdminArticles/AdminDashboardArticles';

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState(0); 

  const handleItemSelect = (index) => {
    setSelectedItem(index); 
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 0:
        return <AdminCommentsTable/> ;
      case 1:
        return <AdminManageRequests />
      case 2:
        return <PendingMentors />
      case 3:
        return <AdminSkills />
      case 4:
        return <AdminCommonQuestions />
      case 5:
        return <AdminDashboardArticles />
      default:
        return
    }
  };

  return (
    <div className='admin-panel'>
      <AdminSidebar onItemSelect={handleItemSelect} />
      <div className='admin-panel-content'>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
