import React from 'react';
import './HowWorks.css';
import HWRecord from './HWRecord/HWRecord';

// Import the images directly
import step1Image from '../../../assets/images/HIW(1).svg';
import step2Image from '../../../assets/images/HIW(2).svg';
import step3Image from '../../../assets/images/HIW(4).svg'

function HowWorks() {
  return (
    <div className='hw-section'>
      <div className='hw-upper-container'>
        چگونه کار میکند؟
      </div>
      <div className='hw-bottom-container'>
          <HWRecord
            imageSrc={step1Image}  // Use imported image
            title='مرحله اول'
            description="منتور موردنظر خود را از لیست منتورها خود را انتخاب کنید."
          />
          <HWRecord
            imageSrc={step2Image}  // Use imported image
            title='مرحله دوم'
            description="درخواست جلسه دهید و زمان مناسب برای خود را انتخاب کنید."
          />
          <HWRecord
            imageSrc={step3Image}  // Use imported image
            title='مرحله سوم'
            description="به منتور متصل شوید و از اطلاعات افراد با تجربه استفاده کنید."
          />
      </div>
    </div>
  );
}

export default HowWorks;
