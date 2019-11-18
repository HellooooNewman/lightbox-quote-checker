import React from 'react';
import {characters, replacementCharacters} from './characters';
import Toggle from 'react-toggle';

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Create words to live by',
      error: '',
      newQuote: '',
      characters: characters,
      replacementCharacters: replacementCharacters,
      showCharacters: false,
      showReplacementCharacters: false,
      recommendAlternativeCharacters: true,
    };

    this.charactersDiv = Object.entries(this.state.characters).map(([key, value]) => {
        return <li key={key}><strong>{key}:</strong> {value}</li>;
    });
    this.replacementCharactersDiv = Object.entries(this.state.replacementCharacters).map(([key, value]) => {
        return <li key={key}><strong>{key} =</strong> {value}</li>;
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleShowCharacters = () => {
    this.setState({showCharacters: !this.state.showCharacters});
  }
  toggleShowReplacementCharacters = () => {
    this.setState({showReplacementCharacters: !this.state.showReplacementCharacters});
  }
  toggleRecommendAlternativeCharacters = () => {
    this.setState({recommendAlternativeCharacters: !this.state.recommendAlternativeCharacters});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({newQuote: this.checkSentence(this.state.value)});
    event.preventDefault();
  }

  checkSentence = (message) => {
    let alteredMessage = "";
    let errorTemplate = "❌🙃 ";
    const _characters = characters;
    const _replacementCharacters = replacementCharacters;

    if(message === "") {
      this.setState({error: `${errorTemplate} Please add some text.`});
      return; 
    }

    // Check to see if its longer than all available options
    const checkLength = () => {
        const charactersLength = Object.values(_characters).reduce(
            (t, value) => t + value
        );
        const messageLength = message.replace(" ", "").length;
        return charactersLength > messageLength;
    }
    if (!checkLength()) {
        this.setState({error: `${errorTemplate} Quote is too long.`});
        return;
    }

    // Check to see if there's any random characters that aren't supported
    const checkForNotSupportedCharacters = () => {
        const validRegex = /^[a-zA-Z0-9&#@\s]+$/gi;
        return validRegex.test(message);
    }

    if (!checkForNotSupportedCharacters()) {
        this.setState({error: `${errorTemplate} Unsupported characters in quote.`});
        return;
    }

    // Check to see if no word is longer than 10 letters
    const checkForWordLength = checkForWordLengthFn();
    function checkForWordLengthFn() {
        const validRegex = /\S{10,}/gi;
        return message.match(validRegex);
    }
    if (checkForWordLength) {
      this.setState({error: `${errorTemplate} ${checkForWordLength[[Object.keys(checkForWordLength)[0]]]} is to long for the box.`});
      return;
    }

    const checkForEnoughCharacters = () => {
        let messageLetters = message.toUpperCase().split("");
        let charactersUsed = {..._characters};
        let notEnoughCharacters = [];
        for (let letter of messageLetters) {
            if (charactersUsed[letter] === 0) {
                if (this.state.recommendAlternativeCharacters) {
                    if (_replacementCharacters[letter] !== undefined && _replacementCharacters[letter].length !== 0 && charactersUsed[_replacementCharacters[letter][0]] !== 0) {
                        alteredMessage += _replacementCharacters[letter][0];
                        charactersUsed[_replacementCharacters[letter][0]]--;
                    } else {
                        notEnoughCharacters.push(letter);
                    }
                } else {
                    notEnoughCharacters.push(letter);
                }
            } else if (
                (charactersUsed[letter] && charactersUsed[letter] !== 0) ||
                letter === " "
            ) {
                alteredMessage += letter;
                charactersUsed[letter]--;
            }
        }
        return notEnoughCharacters;
    }

    if (checkForEnoughCharacters().length !== 0) {
      this.setState({error: `${errorTemplate} You're missing a few characters: Here's a list: <strong>${checkForEnoughCharacters()}</strong>. Please try to be more creative.`});
      return
    }

    let lineBreaksInMessage = alteredMessage.replace(/(.{0,10}\b)/gi, "$1\n");

    if(lineBreaksInMessage.match(/([\n])+/gi).length > 3) {
      this.setState({error: `${errorTemplate} You have to many line breaks in your message. The box only supports 3 lines.`});
      return;
    }

    this.setState({error: ''});
    return lineBreaksInMessage;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Quote Here:
          <input placeholder="Your quote here" type="text" id="quotetext" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <div className="input-toggles">
          <label>
            <Toggle
              defaultChecked={this.state.showCharacters}
              icons={false}
              onChange={this.toggleShowCharacters} />
            <span>Show Character List</span>
          </label>
          <label>
            <Toggle
              defaultChecked={this.state.showReplacementCharacters}
              icons={false}
              onChange={this.toggleShowReplacementCharacters} />
            <span>Show Alternative Characters List</span>
          </label>
          <label>
            <Toggle
              defaultChecked={this.state.recommendAlternativeCharacters}
              icons={false}
              onChange={this.toggleRecommendAlternativeCharacters} />
            <span>Use Alternative Characters in Quote</span>
          </label>
        </div>
        <div className="error" dangerouslySetInnerHTML={{ __html: this.state.error}}></div>
        <br></br>
        <div className="new-quote-container">
          <div className="new-quote" dangerouslySetInnerHTML={{ __html: this.state.newQuote}}></div>
        </div>
          { 
            this.state.showCharacters ? 
            <div>
              <p>Count of each character available.</p>
              <div className="character-list">
                {this.charactersDiv}
              </div>
            </div>
            : null
          }
          { 
            this.state.showReplacementCharacters ? 
            <div>
              <p>List of character replacements for each letter</p>
              <div className="character-list">
                {this.replacementCharactersDiv}
              </div>
            </div>
            : null
          }
      </form>
    );
  }
}



export default QuoteForm;