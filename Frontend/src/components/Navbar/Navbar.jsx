import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import logo from "../../assets/LOGO.png";
import Button from '../Components/Button/Button';
import MobileNavbar from './mobileNavber/MobileNavbar';
import { UserContext } from '../../UserContext'; 
import config from '../../config';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const { isLoggedIn, userInfo, setIsLoggedIn, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDashboardLink = () => {
    if (userInfo?.role === 'mentor') {
      return '/mentor/dashboard';
    } else if (userInfo?.role === 'mentee') {
      return '/mentee/dashboard';
    } else if (userInfo?.role === 'admin') {
      return '/admin/dashboard';
    }return '/';
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${config.path}/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserInfo(null);
      navigate('/'); 
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileNavbar />
      ) : (
        <nav className='navbarContainer'>
          <div className='navbarContent'>
            <a className='imagelink' href='/'><img className='navbarLogo' src={logo} alt="Logo" /></a>
            <ul className='navbarLi'>
              <li className='navbar-li-content'><a href="/">خانه</a></li>
              <li className='navbar-li-content'><a href="/all_mentors">منتورها</a></li>
              <li className='navbar-li-content'><a href="/articles">مقالات</a></li>
              <li className='navbar-li-content'><a href='/common_questions'>سوالات متداول</a></li>
            </ul>
          </div>

          <div className='navbar-buttons'>
            {isLoggedIn ? (
              <>
                <Button text='پروفایل' buttonstyle='primary-button' href={getDashboardLink()} />
                <Button text='خروج' buttonstyle='secondary-button' onClick={handleLogout} />
              </>
            ) : (
              <>
                <Button text='ثبت نام' buttonstyle='primary-button' href='/mentee/signup' />
                <Button text='ورود' buttonstyle='secondary-button' href='/login' />
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
