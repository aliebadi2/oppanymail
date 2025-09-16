import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import "./MenteePlans.css";

const MenteePlans = () => {
  const [activeTab, setActiveTab] = useState("allPlans");
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${config.path}/mentee/active_plans`, {
          withCredentials: true,
        });
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (activeTab === "allPlans") {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter((plan) => plan.status === "active"));
    }
  }, [activeTab, plans]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fa-IR");
  };

  return (
    <div className="mentee-plans-container">
      <div className="mentee-plans-toggle">
        <button
          className={activeTab === "allPlans" ? "active" : ""}
          onClick={() => handleTabChange("allPlans")}
        >
          همه برنامه‌ها
        </button>
        <button
          className={activeTab === "activePlans" ? "active" : ""}
          onClick={() => handleTabChange("activePlans")}
        >
          برنامه‌های فعال
        </button>
      </div>

      <div className="mentee-plans-table-container">
        <table className="mentee-responsive-table">
          <thead>
            <tr>
              <th>نام منتور</th>
              <th>تاریخ شروع</th>
              <th>وضعیت</th>
              <th>جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan, index) => (
              <tr key={index}>
                <td>{`${plan.mentor_name} ${plan.mentor_family_name}`}</td>
                <td>{formatDate(plan.start_date)}</td>
                <td>{plan.status === "active" ? "فعال" : "غیرفعال"}</td>
                <td>
                  <button
                    onClick={() =>
                      alert(
                        `Navigating to details of Mentor: ${plan.mentor_name} ${plan.mentor_family_name}`
                      )
                    }
                  >
                    جزئیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenteePlans;
