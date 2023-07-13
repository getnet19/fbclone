import React from 'react'
import "./chatOnline.css"
export default function ChatOnline() {
  return (
    <div className='chatOnline'>
      <div className='chatOnlineFriend'>
        <div className="chatOnlineImgContainer">
        <img className='chatOnlineImg' src="/assets/person/1.jpeg" alt="" />
        <div className='onlineBage'></div>
        </div>
        <span>getnet getachew</span>
      </div>
    </div>
  )
}
