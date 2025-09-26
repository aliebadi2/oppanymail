import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoCall, IoLogoLinkedin } from 'react-icons/io5';
import './Footer.css';
import logo from '../../assets/LOGO.png';

function Footer() {
  // Static data to replace the dynamic fetching
  const siteInfo = {
    address: 'امیر آباد شمالی، پارک علم و فناوری دانشگاه تهران',
    phone_numbers: ['09228943180'],
    linkedin: 'https://www.linkedin.com/company/oppany/posts/',
  };

  return (
    <div className='footer-container'>
      <div className="footer-content">
        <div className='footer-content-text'>
          {/* Address Section */}
          <div className='footer-content-text-single'>
            <FaMapMarkerAlt className='footer-icon' />
            <p>{siteInfo.address}</p>
          </div>

          {/* Phone Numbers Section */}
          <div className='footer-content-text-single'>
            <IoCall className='footer-icon' />
            <p>تلفن: {siteInfo.phone_numbers[0]}</p>
          </div>

          {/* Social Media Section */}
          <div className='footer-content-text-single'>
            <p>شبکه های اجتماعی</p>
            {siteInfo.linkedin && (
              <a href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <IoLogoLinkedin className='footer-icon' />
              </a>
            )}
          </div>
        </div>

        <img src={logo} alt="Logo" className="footer-logo" />
      </div>
      <div className="footer-links">
        <ul className='footer-f-links'>
          <li>درباره ما</li>
          <li>تماس با ما</li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
