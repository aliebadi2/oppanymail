import GuideItem from "./GuideItem/GuideItem"
import "./GuideComp.css"
import React from 'react'

function GuideComp({header, uHeader}) {
  return (
    <div className='guide-comp-conainer'>
        <div className='guide-comp-upper-conainer'>
            <div className='guide-comp-upper-header'>
                {header}
            </div>
            <div className="guide-comp-upper-under-header">
                {uHeader}
            </div>

        </div>
        <div className="guide-comp-bottom-conainer">
          <div className="guide-comp-item-container">
              <GuideItem
              text={"پرداخت ها چگونه کار می کنند؟ قیمت آن چند است؟"}/>
              <GuideItem
              text={"چگونه می توانم مربیگری خود را متوقف، لغو و پایان دهم؟"}/>
              <GuideItem
              text={"من می خواهم برای استاد خود نظری بنویسم، چگونه می توانم؟"}/>
              <GuideItem
              text={"آزمایش 7 روزه با مربی من چگونه کار می کند؟"}/>
              <GuideItem
              text={"من می خواهم درخواست بازپرداخت کنم."}/>
              <GuideItem
              text={"سیاست لغو برای جلسات"}/>
              <GuideItem
              text={"از مربیان چه انتظاری می توانم داشته باشم؟"}/>
              <GuideItem
              text={"جلسه چیست؟"}/>
              <GuideItem
              text={"چگونه می توانم جلسات را برنامه ریزی کنم؟"}/>
              <GuideItem
              text={"چگونه می توانم از موجودی پیش پرداخت خود استفاده کنم؟"}/>
              
            

          </div>
          <button className="guide-comp-bottom-button">
              مرور همه مقالات
          </button>

        </div>
      
    </div>
  )
}

export default GuideComp

