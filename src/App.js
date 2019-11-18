import React from 'react';
import QuoteForm from './QuoteForm';
import "react-toggle/style.css";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Lightbox Quote Checker
        </h1>
      </header>
      <QuoteForm />
        <br></br>
        <p>
          Based on this <a
            className="App-link"
            href="https://www.amazon.ca/Original-My-Cinema-Lightbox-characters/dp/B0167XQQHO"
            target="_blank"
            rel="noopener noreferrer"
          >lightbox
        </a>
        </p>
        
        
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
    </div>
  );
}


export default App;
