import React, { useState, useContext } from 'react';
import './MobileNavbar.css';
import logo from "../../../assets/LOGO.png";
import Button from '../../Components/Button/Button';
import { UserContext } from '../../../UserContext';
import axios from 'axios';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';

function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, userInfo, setIsLoggedIn, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDashboardLink = () => {
    if (userInfo?.role === 'mentor') {
      return '/mentor/dashboard';
    } else if (userInfo?.role === 'mentee') {
      return '/mentee/dashboard';
    } else if (userInfo?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/';
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${config.path}/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserInfo(null);
      navigate('/');
      setIsMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className='mobileNavbarContainer'>
        <div className='mobileNavbarContent'>
          <a className='imagelink' href='/'><img className='navbarLogo' src={logo} alt="Logo"/></a>
          <div className='mobileNavbarButtons'>
            <button className='mobileNavbar-menu-button' onClick={toggleMenu}>
              <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className='mobile-menu-header'>
            <h3>منو</h3>
            <button className='mobile-menu-close' onClick={closeMenu}>×</button>
          </div>
          
          <div className='mobile-menu-content'>
            <div className='mobile-menu-links'>
              <a href="/" onClick={closeMenu}>خانه</a>
              <a href="/all_mentors" onClick={closeMenu}>منتورها</a>
              <a href="/articles" onClick={closeMenu}>مقالات</a>
              <a href="#" onClick={closeMenu}>قوانین</a>
              <a href='/common_questions' onClick={closeMenu}>سوالات متداول</a>
            </div>
            
            <div className='mobile-menu-auth'>
              {isLoggedIn ? (
                <>
                  <Button 
                    text='پروفایل' 
                    buttonstyle='primary-button' 
                    href={getDashboardLink()} 
                    onClick={closeMenu}
                  />
                  <Button 
                    text='خروج' 
                    buttonstyle='secondary-button' 
                    onClick={handleLogout}
                  />
                </>
              ) : (
                <>
                  <Button 
                    text='ثبت نام' 
                    buttonstyle='primary-button' 
                    href='/mentee/signup' 
                    onClick={closeMenu}
                  />
                  <Button 
                    text='ورود' 
                    buttonstyle='secondary-button' 
                    href='/login' 
                    onClick={closeMenu}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileNavbar;