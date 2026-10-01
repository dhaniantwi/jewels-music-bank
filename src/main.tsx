import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AudioPlayerProvider from './components/AudioPlayerContext';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <App />
    </AudioPlayerProvider>
  </React.StrictMode>
);
