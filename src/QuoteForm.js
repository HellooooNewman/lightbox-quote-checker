import React from 'react';
import { characters, replacementCharacters } from './characters';
import Toggle from 'react-toggle';
import GraphemeSplitter from 'grapheme-splitter';

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Create words to live by',
      error: '',
      newQuote: [[], [], []],
      characters: characters,
      replacementCharacters: replacementCharacters,
      showCharacters: false,
      showReplacementCharacters: false,
      recommendAlternativeCharacters: true,
      toggle3D: true,
      toggleLight: true,
      settingsOpen: false,
      rows: 3,
      columns: 9,
      newCharacter: '',
      newCharacterCount: 1,
      toggleBigBox: false,
    };
  }

  componentDidMount() {
    this.setQuote();
  }

  /**
   * Toggle the show characters area
   */
  toggleShowCharacters = () => {
    this.setState({ showCharacters: !this.state.showCharacters });
  }

  /**
   * Toggle the show replacement characters area
   */
  toggleShowReplacementCharacters = () => {
    this.setState({ showReplacementCharacters: !this.state.showReplacementCharacters });
  }

  /**
   * Toggle the lightbox to go 3D
   */
  toggle3D = () => {
    this.setState({ toggle3D: !this.state.toggle3D });
  }

  /**
   * Toggle whether to use alternative characters in the quote
   */
  toggleRecommendAlternativeCharacters = () => {
    this.setState({ recommendAlternativeCharacters: !this.state.recommendAlternativeCharacters });
  }

  /**
   * Toggle lightbox light
   */
  toggleLight = () => {
    this.setState({ toggleLight: !this.state.toggleLight });
  }

  /**
   * Toggle the lightbox to be big or small
   */
  toggleBigBox = () => {
    this.setState({ toggleBigBox: !this.state.toggleBigBox });
  }

  /**
   * Set the max column amount for the quote box
   * Max of 20 and min of 0
   * @param  {Number} number
   */
  setMaxColumn = (number) => {
    if (this.state.columns + number > 0 && this.state.columns + number <= 20) {
      this.setState({ columns: this.state.columns + number }, () => {
        this.setQuote();
      });
    }
  }

  /**
   * Set the max row amount for the quote box
   * Max of 10 and min of 0
   * @param  {Number} number
   */
  setRows = (number) => {
    if (this.state.rows + number > 1 && this.state.rows + number <= 10) {
      this.setState({ rows: this.state.rows + number }, () => {
        this.setQuote();
      });
    }
  }

  /**
   * Set a new character for the add character box
   * Max of 1 character
   * @param  {Event} event
   */
  setNewCharcter = (event) => {
    if (this.fancyCount(event.target.value) <= 1) {
      this.setState({ newCharacter: event.target.value });
    }
  }

  /**
   * Set a new character amount for the add character box
   * Min of 0
   * @param  {Event} event
   */
  setNewCharcterCount = (event) => {
    if (event.target.value.length > 0 && event.target.value > 0) {
      this.setState({ newCharacterCount: event.target.value });
    }
  }

  // https://blog.jonnew.com/posts/poo-dot-length-equals-two
  // He said not to use it but it seems like the best answer 😕
  /**
   * Fancy string counter
   * Works for most emojis but colored emojis
   * @param  {string} str
   */
  fancyCount(str) {
    const joiner = "\u{200D}";
    const split = str.split(joiner);
    let count = 0;

    for (const s of split) {
      //removing the variation selectors
      const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join("")).length;
      count += num;
    }

    //assuming the joiners are used appropriately
    return count / split.length;
  }

  /**
   * Update character count for existing characters
   * @param  {} key key of the character
   * @param  {} event New amount
   */
  setCharacterCount = (key, event) => {
    if (!isNaN(event.target.value) && event.target.value > 0) {
      this.setState({
        characters: {
          ...this.state.characters,
          [key]: event.target.value
        }
      })
    }
  }

  /**
   * Submit a new character and reset the add character input
   */
  addNewCharacter = () => {
    if (this.fancyCount(this.state.newCharacter) === 1 && this.state.newCharacterCount > 0) {
      let character = this.state.newCharacter.toUpperCase();
      this.setState({
        characters: {
          ...this.state.characters,
          [character]: this.state.newCharacterCount
        },
        newCharacter: '',
        newCharacterCount: 1,
      })
    }
  }

  /**
   * Delete character and replacement pairs
   * @param  {} key key to delete
   */
  deleteCharacter = (key) => {
    const { [key]: value, ..._characters } = this.state.characters;
    const { ..._replacementCharacters } = this.state.replacementCharacters;

    // Delete the two keys that connect each other
    if (_replacementCharacters[_replacementCharacters[key]] && _replacementCharacters[_replacementCharacters[key][0]]) {
      delete _replacementCharacters[_replacementCharacters[key][0]];
    }

    if (_replacementCharacters[key]) {
      delete _replacementCharacters[key];
    }

    this.setState({
      replacementCharacters: _replacementCharacters
    })

    this.setState({
      characters: _characters
    })
  }

  /**
   * Set new quote text
   * @param  {Event} event
   */
  setQuoteText = (event) => {
    this.setState({ value: event.target.value });
  }

  /**
   * Add quote text
   * @param  {Event} event
   */
  handleQuoteSubmit = (event) => {
    this.setQuote();
    event.preventDefault();
  }

  /**
   * Check the sentence to see if it works 
   * if it does set it otherwise add empty rows
   */
  setQuote() {
    const newQuote = this.checkSentence(this.state.value);
    this.setState({ newQuote: newQuote === '' ? Array(this.state.rows).fill([]) : newQuote });
  }

  /**
   * Escape regex string to santize content
   */
  escapeRegex(string) {
    return string.replace(/[-^$*+?.()|[\]{}]/g, '$&');
  }

  /**
   * Check to see if the string works with the rows and columns 
   * if it doesn't return nothing and set an error
   * @param {string} message Quote that is being passed
   */
  checkSentence = (message) => {
    let alteredMessage = '';
    let alteredMessageArray = [];
    let errorTemplate = "❌ 🙃 ";
    const _characters = this.state.characters;
    const _replacementCharacters = this.state.replacementCharacters;

    if (message === "") {
      this.setState({ error: `${errorTemplate} Please add some text.` });
      return '';
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
      return '';
    }

    // Check to see if there's any random characters that aren't supported
    const checkForNotSupportedCharacters = () => {
      // const validRegex = /^[a-zA-Z0-9&#@\s]+$/gi;
      const validRegex = new RegExp(`^[${Object.keys(_characters)}\\s]+$`, 'gi');
      return validRegex.test(message);
    }

    if (!checkForNotSupportedCharacters()) {
      this.setState({ error: `${errorTemplate} Unsupported characters in quote.` });
      return '';
    }

    // Check to see if no word is longer than 10 letters
    const checkForWordLengthFn = () => {
      const validRegex = new RegExp(`\\S{${this.state.columns + 1},}`, 'gi');
      return message.match(validRegex);
    }

    const checkForWordLength = checkForWordLengthFn();

    if (checkForWordLength) {
      this.setState({ error: `${errorTemplate} <strong>"${checkForWordLength[[Object.keys(checkForWordLength)[0]]]}"</strong> is to long for the box.` });
      return '';
    }

    const addCharacter = (letter) => {
      alteredMessage += letter;
    }

    const checkForEnoughCharacters = () => {
      let messageLetters = new GraphemeSplitter().splitGraphemes(message.toUpperCase());
      let charactersUsed = { ..._characters };
      let notEnoughCharacters = [];
      for (let letter of messageLetters) {
        if (charactersUsed[letter] === 0) {
          if (this.state.recommendAlternativeCharacters) {
            if (_replacementCharacters[letter] !== undefined && _replacementCharacters[letter].length !== 0 && charactersUsed[_replacementCharacters[letter][0]] !== 0) {
              addCharacter(_replacementCharacters[letter][0]);
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
          addCharacter(letter);
          charactersUsed[letter]--;
        }
      }
      return notEnoughCharacters;
    }

    if (checkForEnoughCharacters().length !== 0) {
      this.setState({ error: `${errorTemplate} You're missing a few characters: Here's a list: <strong>${checkForEnoughCharacters()}</strong>. Please try to be more creative.` });
      return '';
    }

    // Fix line break thingy
    let regexLineBreaks = new RegExp(`(.{0,${this.state.columns}}[^\\s]\\b)`, 'gi');
    alteredMessageArray = alteredMessage.match(regexLineBreaks);


    if ((alteredMessageArray.length) > (this.state.rows)) {
      this.setState({ error: `${errorTemplate} The box only supports ${this.state.rows} lines.` });
      return '';
    }

    alteredMessageArray = alteredMessageArray.map(row => row.trim());

    while (alteredMessageArray.length < this.state.rows) {
      alteredMessageArray.push([]);
    }

    this.setState({ error: '' });
    return alteredMessageArray;
  }

  /**
   * Toggle the settings modal on
   */
  toggleSettings = (state) => {
    this.setState({ settingsOpen: state });
  }

  render() {
    return (
      <form onSubmit={this.handleQuoteSubmit}>
        <div className="quote-input form-row">
          <label>
            <input placeholder="Your quote here" type="text" id="quotetext" value={this.state.value} onChange={this.setQuoteText} />
          </label>
          <input type="submit" value="Submit" />
          <button className={`settings-btn ${this.state.toggle3D ? '' : 'setting-on'} `} onClick={() => this.toggle3D()} type="button">
            <span aria-label="Toggle 3D" title="Toggle 3D"><strong>3D</strong></span>
          </button>
          <button className={`settings-btn ${this.state.recommendAlternativeCharacters ? '' : 'setting-on'} `} onClick={() => this.toggleRecommendAlternativeCharacters()} type="button">
            <span aria-label="Toggle Alternative Characters" title="Toggle Alternative Characters">🔡</span>
          </button>
          <button className={`settings-btn ${this.state.toggleLight ? '' : 'setting-on'} `} onClick={() => this.toggleLight()} type="button">
            <span aria-label="Toggle Light" title="Toggle Light On or Off">💡</span>
          </button>
          <button className="settings-btn" onClick={() => this.toggleBigBox()} type="button">
            <span aria-label="Toggle Big Box Size" title="Toggle the size of the lightbox">{this.state.toggleBigBox ? 'Small' : 'Big'}</span>
          </button>
        </div>
        <div className="horizontal-buttons">
          <div className="horizontal-buttons__btns">
            <button onClick={() => this.setMaxColumn(-1)}>
            -
            </button>
            Columns
            <button onClick={() => this.setMaxColumn(1)}>
            +
            </button>
          </div>
        </div>
        
        <div className="error form-row" dangerouslySetInnerHTML={{ __html: this.state.error }}></div>
        <div className="scene scene--cube form-row">
          <div style={{ width: this.state.columns * 40, height: this.state.rows * 69 }} className={`cube${this.state.toggle3D ? ' cube--rotate' : ''} ${this.state.toggleBigBox ? ' cube--big' : ''}`}>
            <div className={`cube__face cube__face--front ${this.state.toggleLight ? 'cube__face--light-on' : ''}`}>
              <div className="new-quote">
                {
                  this.state.newQuote &&
                  this.state.newQuote.map((quote, index) => (<div key={index} className="new-quote__row">
                    {
                      [...quote].map((letter, index) => (<span className={letter !== ' ' ? 'new-quote__row__letter' : 'new-quote__row__empty-space'} key={index} >{letter}</span>))
                    }
                  </div>))
                }
              </div>
            </div>
            <div className="cube__face cube__face--right"></div>
            <div className="cube__face cube__face--top"></div>
          </div>
          <div className="vertical-buttons__container">
            <div className="vertical-buttons">
              <button  onClick={() => this.setRows(-1)}>
              -
              </button>
              Rows
              <button onClick={() => this.setRows(1)}>
              +
              </button>
            </div>
          </div>
        </div>

        {/* <div className="form-row">
          <label>
            <Toggle
              defaultChecked={this.state.showCharacters}
              icons={false}
              onChange={this.toggleShowCharacters} />
            <span>Show Character List</span>
          </label>

        </div> */}
        {
          this.state.showCharacters ?
            <div>
              <p>Count of each character available</p>
              <div className="character-list">
                <div className="character-input character-input--first-character">
                  <div className="character-input__title"><strong>Add new character</strong></div>
                  <span className="character-input__count">
                    <input type="number" className="character-input__count__input" value={this.state.newCharacterCount} onChange={(event) => this.setNewCharcterCount(event)} />
                    <span>x</span>
                  </span>
                  <input placeholder="ex: &" type="text" className="uppercase character-input__character" value={this.state.newCharacter} onChange={(event) => this.setNewCharcter(event)} />
                  <button className="btn--close" onClick={() => this.addNewCharacter()} type="button">Add</button>
                </div>
                {Object.entries(this.state.characters).map(([key, value]) => {
                  return <div className="character-input" key={key}>
                    <span className="character-input__count">
                      <input className="character-input__count__input" maxLength={2} name={key} type="number" value={value} onChange={(event) => this.setCharacterCount(key, event)} />
                      <span>x</span>
                    </span>
                    <label htmlFor={key}>{key}</label>
                    <button className="btn--close" onClick={() => this.deleteCharacter(key)} type="button" aria-label="Delete Character">X</button>
                  </div>;
                })}
              </div>
            </div>
            : null
        }

        {/* <div className="form-row">
          <label>
            <Toggle
              defaultChecked={this.state.showReplacementCharacters}
              icons={false}
              onChange={this.toggleShowReplacementCharacters} />
            <span>Show Alternative Characters List</span>
          </label>
        </div> */}
        {
          this.state.showReplacementCharacters ?
            <div>
              <p>List of character replacements for each letter</p>
              <div className="character-list">
                {Object.entries(this.state.replacementCharacters).map(([key, value]) => {
                  return <div key={key} className="character-input">
                    <div><strong>{key} =</strong> {value}</div>
                  </div>;
                })}
              </div>
            </div>
            : null
        }
      </form>
    );
  }
}



export default QuoteForm;