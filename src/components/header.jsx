import React, { useState } from 'react';

function Header() {

  return (
    <header className='padded flex-row chat-header'>
      <img className="image s circular center-y" src="https://th.bing.com/th/id/OIP.hxRValICG6OlXI56NUfSjAHaF1?rs=1&pid=ImgDetMain" alt="profile" />
      <p className='center-y'>CHAT</p>
    </header>
  );
}

export default Header;
