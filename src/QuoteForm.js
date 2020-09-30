import React from 'react';
import { characters, replacementCharacters } from './characters';
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
      toggle3D: false,
      toggleLight: false,
      rows: 3,
      maxCharacter: 10,
      newCharacter: '',
      newCharacterCount: 1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleShowCharacters = () => {
    this.setState({ showCharacters: !this.state.showCharacters });
  }

  toggleShowReplacementCharacters = () => {
    this.setState({ showReplacementCharacters: !this.state.showReplacementCharacters });
  }

  toggle3D = () => {
    this.setState({ toggle3D: !this.state.toggle3D });
  }

  toggleLight = () => {
    this.setState({ toggleLight: !this.state.toggleLight });
  }

  setMaxCharacter = (event) => {
    this.setState({ maxCharacter: event.target.value });
  }

  setRows = (event) => {
    this.setState({ rows: event.target.value });
  }

  setNewCharcter = (event) => {
    this.setState({ newCharacter: event.target.value });
  }

  setNewCharcterCount = (event) => {
    this.setState({ newCharacterCount: event.target.value });
  }

  updateCharacter = (key, value) => {
    if (value > 0) {
      this.setState({
        characters: {
          ...this.state.characters,
          [key]: value
        }
      })
    } else {
      // needs to be more than 0
    }
  }

  addNewCharacter = () => {
    if (this.state.newCharacter.length === 1) {
      this.setState({
        characters: {
          ...this.state.characters,
          [this.state.newCharacter]: this.state.newCharacterCount
        }
      })
    } else {
      // Either no character or its to long
    }
  }

  deleteCharacter = (key) => {
    const { [key]: value, ..._characters } = this.state.characters;
    this.setState({
      characters: _characters
    })
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ newQuote: this.checkSentence(this.state.value) });
    event.preventDefault();
  }

  escapeRegex(string) {
    return string.replace(/[-^$*+?.()|[\]{}]/g, '$&');
  }

  checkSentence = (message) => {
    let alteredMessage = "";
    let errorTemplate = "❌ 🙃 ";
    const _characters = this.state.characters;
    const _replacementCharacters = this.state.replacementCharacters;

    if (message === "") {
      this.setState({ error: `${errorTemplate} Please add some text.` });
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
      this.setState({ error: `${errorTemplate} Quote is too long.` });
      return;
    }

    // Check to see if there's any random characters that aren't supported
    const checkForNotSupportedCharacters = () => {
      // const validRegex = /^[a-zA-Z0-9&#@\s]+$/gi;
      const validRegex = new RegExp(`^[${Object.keys(_characters)}\\s]+$`, 'gi');
      return validRegex.test(message);
    }

    if (!checkForNotSupportedCharacters()) {
      this.setState({ error: `${errorTemplate} Unsupported characters in quote.` });
      return;
    }

    // Check to see if no word is longer than 10 letters
    const checkForWordLengthFn = () => {
      const validRegex = new RegExp(`\\S{${this.state.maxCharacter},}`, 'gi');
      return message.match(validRegex);
    }

    const checkForWordLength = checkForWordLengthFn();

    if (checkForWordLength) {
      this.setState({ error: `${errorTemplate} <strong>"${checkForWordLength[[Object.keys(checkForWordLength)[0]]]}"</strong> is to long for the box.` });
      return;
    }

    const checkForEnoughCharacters = () => {
      let messageLetters = message.toUpperCase().split("");
      let charactersUsed = { ..._characters };
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
      this.setState({ error: `${errorTemplate} You're missing a few characters: Here's a list: <strong>${checkForEnoughCharacters()}</strong>. Please try to be more creative.` });
      return
    }

    let regexLineBreaks = new RegExp(`/(.{0,${this.state.maxCharacter}}\\b)/gi`);
    alteredMessage = alteredMessage.replace(regexLineBreaks, '$1\n');

    if (alteredMessage.match(/([\n])+/gi) > this.state.rows) {
      debugger;
      this.setState({ error: `${errorTemplate} You have to many line breaks in your message. The box only supports ${this.state.rows} lines.` });
      return;
    }

    this.setState({ error: '' });
    return alteredMessage;
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
              defaultChecked={this.state.recommendAlternativeCharacters}
              icons={false}
              onChange={this.toggleRecommendAlternativeCharacters} />
            <span>Use Alternative Characters in Quote ex: E = 3</span>
          </label>
          <label>
            <Toggle
              defaultChecked={this.state.toggle3D}
              icons={false}
              onChange={this.toggle3D} />
            <span>Toggle 3D</span>
          </label>
          <label>
            <Toggle
              defaultChecked={this.state.toggleLight}
              icons={false}
              onChange={this.toggleLight} />
            <span>Toggle Light</span>
          </label>
          <label>
            Max Word Length:
          <input placeholder="ex: 10" type="number" value={this.state.maxCharacter} onChange={this.setMaxCharacter} />
          </label>
          <label>
            Rows:
          <input placeholder="ex: 3" type="number" value={this.state.rows} onChange={this.setRows} />
          </label>
        </div>
        <div className="error" dangerouslySetInnerHTML={{ __html: this.state.error }}></div>
        <br></br>
        <div className="scene scene--cube">
          <div className={`cube ${this.state.toggle3D ? 'cube--rotate' : ''}`}>
            <div className={`cube__face cube__face--front ${this.state.toggleLight ? 'cube__face--light-on' : ''}`}>
              <div className="new-quote" dangerouslySetInnerHTML={{ __html: this.state.newQuote }}></div>
            </div>
            <div className="cube__face cube__face--right"></div>
            <div className="cube__face cube__face--top"></div>
          </div>
        </div>

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
          {
            this.state.showCharacters ?
              <div>
                <p>Count of each character available</p>
                <label>
                  Add new character:
                  <input placeholder="ex: 🙃" type="text" className="dual-input" value={this.state.newCharacter} onChange={this.setNewCharcter} />
                  <input placeholder="ex: 1" type="number" className="dual-input" value={this.state.newCharacterCount} onChange={this.setNewCharcterCount} />
                  <button onClick={() => this.addNewCharacter} type="button">Add</button>
                </label>
                <div className="character-list">
                  {Object.entries(this.state.characters).map(([key, value]) => {
                    return <label key={key}>
                      <input placeholder="ex: 🙃" type="text" className="dual-input" value={key} onChange={this.setNewCharcter} />
                      <input placeholder="ex: 1" type="number" className="dual-input" value={value} onChange={this.setNewCharcterCount} />
                      <button onClick={() => this.updateCharacter(key, value)} type="button">Save</button>
                      <button onClick={() => this.deleteCharacter(key)} type="button">Delete</button>
                    </label>;
                  })}
                </div>
              </div>
              : null
          }
          {
            this.state.showReplacementCharacters ?
              <div>
                <p>List of character replacements for each letter</p>
                <div className="character-list">
                  {Object.entries(this.state.replacementCharacters).map(([key, value]) => {
                    return <li key={key}><strong>{key} =</strong> {value}</li>;
                  })}
                </div>
              </div>
              : null
          }
        </div>
      </form>
    );
  }
}



export default QuoteForm;