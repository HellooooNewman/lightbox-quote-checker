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
        <br></br>
        <div className="github-links">
          <a
            className="App-link"
            href="https://github.com/HellooooNewman/Lightbox-Quote-Checker"
            target="_blank"
            rel="noopener noreferrer"
          >
            Slack Bot Version
          </a>
        </div>
    </div>
  );
}


export default App;
