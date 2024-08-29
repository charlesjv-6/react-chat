// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './services/theme/theme';
import { GlobalStyles } from './services/theme/global';
import './App.css';

import Index from './pages';
import SidePanel from './layouts/side-panel';
import Thread from './pages/thread';

function App() {
  const [theme, setTheme] = useState('dark');

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Index/>}/>
            <Route path="/t/:chatId" element={
              <><SidePanel themeToggle={themeToggler} /><Thread /></>
            } />
          </Routes>
        </BrowserRouter>
      </>
    </ThemeProvider>
  );
}

export default App;
