import React, { useState, useEffect, useRef } from 'react';
import ClickButton from '../Components/Cilck-button/ClickButton'
import './Dashtitle.css'
import downIcon from '../../assets/Bottom.svg'

function Dashtitle() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  const menuRef = useRef(null);
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
    return (
    <div className='dash-title-container'>
        <h1 className='dash-title-text'>
        سعید عزیز  به پنل منتی Mentorship خوش آمدید! 
        </h1>
        <div className='dash-title-button-container' ref={menuRef}>

          <button className='dash-title-button' onClick={toggleMenu}>
            <div>
              حساب کاربری
            </div>
            <img src={downIcon} alt="" />
          </button>
          {menuOpen && (
                      <div className='dropdown-menu'>
                          <ul>
                              <li> داشبورد</li>
                              <li>پنل منتور</li>
                              <li> صفحه اصلی</li>
                              <li>خروج از حساب</li>
                          </ul>
                      </div>
                  )}
        </div>
    </div>
  )
}

export default Dashtitle