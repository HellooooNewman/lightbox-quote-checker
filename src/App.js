import React from 'react';
import QuoteForm from './QuoteForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          Lightbox Quote Checker
        </h1>
        <QuoteForm />
        <br></br>
        <br></br>
        <div className="github-links">
          <a
            className="App-link"
            href="https://github.com/HellooooNewman/Lightbox-Quote-Checker"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lightbox Quote Checker Slack Bot Repo
          </a>
          <br></br>
          <a
            className="App-link"
            href="https://github.com/HellooooNewman/Lightbox-Quote-Checker-FE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lightbox Quote Checker FE Repo
          </a>
        </div>
      </header>
      
      
    </div>
  );
}


export default App;
