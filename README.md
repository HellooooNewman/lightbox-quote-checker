# Lightbox Quote Checker
Tells you whether the message you want to type will work with the letters and length of the sign. Will also allow for substitutions.

![Lightbox](/images/lightbox.jpg)

[Demo here](https://lightbox-quote-checker-fe-y42cx.ondigitalocean.app/)

Integrates into Slack as a bot [Here](https://github.com/HellooooNewman/lightbox-quote-checker-slackbot)

## Features:
- Text alternatives (3 = E)
- Character limits = (only 3 E’s)
- Sentence length check (40 characters)
- Invalid character check (A-Z, 0-9, #&@)
- Word length check(Max 10 letters per word)
- Too many line breaks in the sentence(Max 3 line breaks)
- Make 3D
- Turn light on

## Installation
`npm i && npm start`

## Tests
`npm run test` 

## Examples

Works

`Long urls are the feature`

```
LONG URLS 
ARE THE 
FEATUR3
```

Doesn't work

`how's this work then?`

``` 
Unsupported characters in quote.
```

## Planned Features:
- Edit length of rows
- Edit number of rows
- Edit character count
- Changing light color
