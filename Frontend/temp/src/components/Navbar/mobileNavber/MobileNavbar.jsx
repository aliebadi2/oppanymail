import React from 'react';
import './MobileNavbar.css';
import logo from "../../../assets/LOGO.png";
import Button from '../../Components/Button/Button';
import searchIcon from "../../../assets/search_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24(2).svg"

function MobileNavbar() {
  return (
    <nav className='mobileNavbarContainer'>
      <div className='mobileNavbarContent'>
        <a className='imagelink' href='/'><img className='navbarLogo' src={logo} alt="Logo"/></a>
        <div className='mobileNavbarButtons'>
          <button className='mobileNavbar-search-button'>
          <img src={searchIcon} alt="" />
          </button>
          <Button text='ورود' buttonstyle='secondary-button' href='/login' />
        </div>
        
      </div>
    </nav>
  );
}

export default MobileNavbar;
        // <div className='mobileMenuIcon'>
        //   {/* Add your menu icon or hamburger icon here */}
        // </div>