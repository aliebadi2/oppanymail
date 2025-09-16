import React from 'react';
import { FaMapMarkerAlt, FaTwitter, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { IoCall, IoLogoLinkedin } from 'react-icons/io5';
import { BsFillPrinterFill } from 'react-icons/bs';
import { RiInstagramFill } from 'react-icons/ri';
import './Footer.css';
import logo from '../../assets/LOGO.png';

function Footer() {
  // Static data to replace the dynamic fetching
  const siteInfo = {
    address: '123 Main Street, Tehran, Iran',
    phone_numbers: ['+98 21 1234 5678', '+98 21 8765 4321'],
    instagram: 'https://www.instagram.com/example',
    telegram: 'https://t.me/example',
    whatsapp: '989123456789', // without the '+' prefix for WhatsApp link
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
            {siteInfo.phone_numbers.map((number, index) => (
              <React.Fragment key={index}>
                <BsFillPrinterFill className='footer-icon' />
                <p>{number}</p>
                <IoCall className='footer-icon' />
                <p>{number}</p>
              </React.Fragment>
            ))}
          </div>

          {/* Social Media Section */}
          <div className='footer-content-text-single'>
            <p>شبکه های اجتماعی</p>
            {siteInfo.instagram && (
              <a href={siteInfo.instagram} target="_blank" rel="noopener noreferrer">
                <RiInstagramFill className='footer-icon' />
              </a>
            )}
            {siteInfo.telegram && (
              <a href={siteInfo.telegram} target="_blank" rel="noopener noreferrer">
                <FaTelegramPlane className='footer-icon' />
              </a>
            )}
            {siteInfo.whatsapp && (
              <a href={`https://wa.me/${siteInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className='footer-icon' />
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
          <li>قوانین سایت</li>
          <li>نظرات شما</li>
        </ul>
        <p>Designed by 104team</p>
      </div>
    </div>
  );
}

export default Footer;
