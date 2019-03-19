[![npm version](https://badge.fury.io/js/lightweight-emoji-picker.svg)](https://badge.fury.io/js/lightweight-emoji-picker)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/JanST123/lightweight-emoji-picker/master/LICENSE)

# Lightweight emoji picker

This emoji picker has only what you need, and it's size wights **less than 250KB** including styles and the icons.
This picker uses the *emojilib* from muan: https://github.com/muan/emojilib

![Preview](https://raw.githubusercontent.com/JanST123/emoji-picker/master/dist/preview.png)

[Demo](https://janst123.github.io/emoji-picker/demo/demo.html)

## Usage
### With npm

    npm install lightweight-emoji-picker --save

### Without npm
Download the `dist/picker.js` file from this repository and load it into your website.


## Setup

    var picker=new EmojiPicker(TargetEl: HTMLNode, Callback: Function, [Language: string, [recommendedEmojis: Array]]);

* **TargetEl**: HTML Element to display the picker at, will append the picker to the DOM **after** this element, and position it next to the element by absolute positioning
* **Calback**: A function that is called when an emoji is choosen. Will receive one parameter with the following data:

      {
        category: (String)categoryName,
        char: (String)the Character,
        keywords: (Array)Array with keywords
      }

* **Language**: Language to display phrases. Possible values `en` and `de`
* **recommendedEmojis**: An array with emojis to display in the special "recommended" category at the top of emoji list. Values have to be the keys from the emoji lib: https://github.com/muan/emojilib/blob/master/emojis.json


### Showing / Hiding the picker
There a three methods you can use:

    picker.toggle(); // toggles the visible state of the picker
    picker.show(); // shows the picker
    picker.hide(); // hides the picker
    
    
# License
This project is published under the [MIT License](https://github.com/JanST123/emoji-picker/edit/master/LICENSE)
