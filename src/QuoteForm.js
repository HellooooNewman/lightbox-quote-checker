import React from 'react';

class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'create words to live by',
      error: '',
      newQuote: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({newQuote: this.checkSentence(this.state.value)});
    event.preventDefault();
  }

  checkSentence(message) {
    if(message === "") {
      this.setState({error: `${errorTemplate} Please add some text.`});
      return; 
    }
    let alteredMessage = "";
    let errorTemplate = "❌🙃 ";
    const recommendAlternativeCharacters = true;
    const showCharacters = false;
    const showReplacementCharacters = false;
    const characters = {
        A: 3,
        B: 1,
        C: 2,
        D: 2,
        E: 3,
        F: 1,
        G: 2,
        H: 2,
        I: 3,
        J: 1,
        K: 1,
        L: 2,
        M: 2,
        N: 2,
        O: 3,
        P: 2,
        Q: 1,
        R: 3,
        S: 2,
        T: 2,
        U: 2,
        V: 1,
        W: 1,
        X: 1,
        Y: 1,
        Z: 1,
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 1,
        "5": 1,
        "6": 1,
        "7": 1,
        "8": 1,
        "9": 1,
        "0": 1,
        "@": 1,
        "#": 1,
        "&": 1
    };

    const replacementCharacters = {
        A: [],
        B: [],
        C: ["U"],
        D: [],
        E: ["3"],
        F: [],
        G: [],
        H: [],
        I: ["1"],
        J: [],
        K: [],
        L: [],
        M: ["W"],
        N: [],
        O: ["0"],
        P: [],
        Q: [],
        R: 3,
        S: ["S"],
        T: [],
        U: ["C"],
        V: [],
        W: ["M"],
        X: [],
        Y: [],
        Z: ["Z"],
        "1": ["I"],
        "2": ["S"],
        "3": ["E"],
        "4": [],
        "5": [],
        "6": ["9"],
        "7": [],
        "8": [],
        "9": ["6"],
        "0": ["O"],
        "@": [],
        "#": [],
        "&": []
    };

    if (showReplacementCharacters) {
        console.log("Replacement Characters:");
        return console.log(replacementCharacters);
    }

    if (showCharacters) {
        console.log("Characters:");
        return console.log(characters);
    }

    // Check to see if its longer than all available options
    const checkLength = checkLengthFn();
    function checkLengthFn() {
        const charactersLength = Object.values(characters).reduce(
            (t, value) => t + value
        );
        const messageLength = message.replace(" ", "").length;
        return charactersLength > messageLength;
    }
    if (!checkLength) {
        this.setState({error: `${errorTemplate} Quote is too long.`});
        return;
    }

    // Check to see if there's any random characters that aren't supported
    const checkForNotSupportedCharacters = checkForNotSupportedCharactersFn();
    function checkForNotSupportedCharactersFn() {
        const validRegex = /^[a-zA-Z0-9&#@\s]+$/gi;
        return validRegex.test(message);
    }

    if (!checkForNotSupportedCharacters) {
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

    const checkForEnoughCharacters = checkForEnoughCharactersFn();
    function checkForEnoughCharactersFn() {
        let messageLetters = message.toUpperCase().split("");
        let charactersUsed = characters;
        let notEnoughCharacters = [];
        for (let letter of messageLetters) {
            // letter
            if (charactersUsed[letter] === 0) {
                if (recommendAlternativeCharacters) {
                    if (replacementCharacters[letter].length !== 0 && charactersUsed[replacementCharacters[letter][0]] !== 0) {
                        alteredMessage += replacementCharacters[letter][0];
                        charactersUsed[replacementCharacters[letter][0]]--;
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

    if (checkForEnoughCharacters.length !== 0) {
      this.setState({error: `${errorTemplate} You're missing a few characters: Here's a list: <strong>${checkForEnoughCharacters}</strong>. Please try to be more creative.`});
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
          <input placeholder="The future is here" type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <div dangerouslySetInnerHTML={{ __html: this.state.error}}></div>
        <br></br>
        <div class="new-quote-container">
          <div className="new-quote" dangerouslySetInnerHTML={{ __html: this.state.newQuote}}></div>
        </div>
        
      </form>
    );
  }
}

export default QuoteForm;