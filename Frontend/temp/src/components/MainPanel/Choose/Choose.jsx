import React from 'react'
import "./Choose.css"
import Option from './Option/Option'

function Choose() {
  return (
    <div className='choose-container'>
        <div className='choose-title'>
        <span className='choose-orange-color'>منتورینگ</span>، انتخابی هوشمندانه
        </div>
        <div className='choose-explain'>
        آیا می خواهید مسیر شغلی جدیدی شروع کنید؟ استارت آپ خود را با موفقیت راه اندازی کنید؟ تمایل به یادگیری مهارت های پرتقاضا دارید؟ یا به دنبال توسعه در شغل خود هستید؟ هوشمندانه با یک منتور آنلاین کار کنید تا مشاوره و راهنمایی های تخصصی را به شما ارائه دهد.
        </div>
        <div className='choose-options'>
            <div className='choose-options-1'>
                <Option
                option={"صدها منتور در دسترس"}
                />
            <Option
                option={"صدها منتور در دسترس"}
                />
            </div>
            <div className='choose-options-2'>
            <Option
                option={"تماس های یک به یک"}
                />
            <Option
                option={"امکان چت"}
                />

            </div>

        </div>
      
    </div>
  )
}
 
export default Choose
