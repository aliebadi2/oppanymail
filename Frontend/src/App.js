import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import RouteChangeTracker from "./RouteChangeTracker";

import MainPanel from "./components/MainPanel/MainPanel/MainPanel";
import AllMentors from "./components/ShowMentors/All_Mentors/All_Mentors";
import AllQuestionsPage from "./components/AllCommonQuestion/AllQuestionsPage";
import MenteeSignup from "./components/Signup-Login-Final/Mentee_signup/MenteeSignup";
import MentorSignup from "./components/Signup-Login-Final/Mentor_Signup/MentorSignup";
import Loginpage from "./components/Signup-Login-Final/Login-page/Loginpage";
import Welcome from "./components/Welcome/Welcome";
import MentorProfile from "./components/Mentor/mentorProfile/MentorProfile";
import LoadingScreen from "./components/Signup-Login-Final/LoadingScreen/LoadingScreen";
import MentorDashboard from "./components/Mentor/mentorDashBoard/mentorDashboard";
import AdminPanel from "./components/Admin/AdminPanel";
import ArticleSearch from "./components/articles/ArticleSearch/ArticleSearch";
import ArticlePage from "./components/articles/ArticlePage/ArticlePage";
import MenteeDashboard from "./components/Mentee/MenteeDashboard/MenteeDashboard";
import MentorCourse from "./components/Mentor/mentorDashBoard/Courses/MentorCourse/MentorCourse";

import { UserProvider } from "./UserContext";
import RequireAuth from "./components/Auth/RequireAuth";


function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App" dir="rtl">
          <RouteChangeTracker>
            <Navbar />

            <Routes>
              <Route path="/" element={<MainPanel />} />
              <Route path="/all_mentors" element={<AllMentors />} />
              <Route path="/all_mentors/:skill_id" element={<AllMentors />} />
              <Route path="/login" element={<Loginpage />} />
              <Route path="/mentor/signup" element={<MentorSignup />} />
              <Route path="/mentor/profile/:username" element={<MentorProfile />} />
              <Route path="/mentee/signup" element={<MenteeSignup />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/common_questions" element={<AllQuestionsPage />} />
              <Route path="/verify_email" element={<LoadingScreen />} />

              <Route
                path="/mentor/dashboard"
                element={
                  <RequireAuth>
                    <MentorDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/mentee/dashboard"
                element={
                  <RequireAuth>
                    <MenteeDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/mentor/courses/:activePlanId"
                element={
                  <RequireAuth>
                    <MentorCourse />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth>
                    <AdminPanel />
                  </RequireAuth>
                }
              />
              <Route path="/articles" element={<ArticleSearch />} />
              <Route path="/articles/:articleId" element={<ArticlePage />} />
            </Routes>

            <Footer />
          </RouteChangeTracker>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
