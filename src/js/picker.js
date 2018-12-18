var emojiLib = require("emojilib");
var js = require('janst123_js.js');
require('./../scss/styles.scss');
var mainCategories={
  "people": {
    name: {"de" : "Leute", "en": "People"},
    symbol: require('./../../svg/people.svg'),
    order: 1
  },

  "animals_and_nature": {
    name: {"de" : "Tiere & Natur", "en": "Animals & Nature"},
    symbol: require('./../../svg/animals.svg'),
    order: 2
  },

  "food_and_drink": {
    name: {"de" : "Essen & Trinken", "en": "Food & Drink"},
    symbol: require('./../../svg/food.svg'),
    order: 3
  },

  "activity": {
    name: {"de" : "Aktivitäten", "en": "Activity"},
    symbol: require('./../../svg/activities.svg'),
    order: 4
  },

  "travel_and_places": {
    name: {"de" : "Reisen & Orte", "en": "Travel & Places"},
    symbol: require('./../../svg/travel.svg'),
    order: 5
  },

  "objects": {
    name: {"de" : "Objekte", "en": "Objects"},
    symbol: require('./../../svg/objects.svg'),
    order: 6
  },

  "flags": {
    name: {"de" : "Flaggen", "en": "Flags"},
    symbol: require('./../../svg/flags.svg'),
    order: 7
  }
};

var EmojiPicker = /** @class */ (function() {

  /**
   * construct the emojipicker
   * @param {Node} targetEl (the node element to show the picker next to)
   */
  function EmojiPicker(targetEl, language) {
    if (language === undefined) language="en";

    if (['de','en'].indexOf(language) < 0) throw new Error('language must be "de" or "en"');

    this.targetEl = targetEl;
    this.language = language;
  }


  /**
   * create the picker and make it visible
   */
  EmojiPicker.prototype.show = function() {
    var container = js.addEl(this.targetEl, 'div', 'emojipicker-container', 'after');

    // get categories
    var categories=[];
    for (var x in emojiLib.lib) {
      if (emojiLib.lib.hasOwnProperty(x)) {
        var category = emojiLib.lib[x].category;

        // do we know the category?
        if (category in mainCategories) {
          if (typeof(mainCategories[category].items) === 'undefined') mainCategories[category].items={};
          mainCategories[category].items[x] = emojiLib.lib[x];
        }

        if (categories.indexOf(emojiLib.lib[x].category) < 0) {
          categories.push(emojiLib.lib[x].category);
        }
      }
    }



    // append searchbox
    // @TODO: do

    // append categories and emojis
    var categoryContainer = js.addEl(container, 'div', 'emojipicker-category-container');
    var emojiContainer = js.addEl(container, 'div', 'emojipicker-emoji-container');


    for (var x in mainCategories) {
      if (mainCategories.hasOwnProperty(x)) {
        var category = mainCategories[x];

        var catCon = js.addEl(categoryContainer, 'div', 'emojipicker-category');

        // add click handler
        js.eventListener(catCon).add('categoryClick', 'click', function() {
          var other=document.querySelectorAll('.emojipicker-category');
          for (var i=0; i<other.length; ++i) {
            js.removeClass(other[i], 'active');
          }
          js.addClass(this, 'active');
        });


        var a = js.addEl(catCon, 'a');
        a.setAttribute('title', category.name[this.language]);
        a.innerHTML = category.symbol;

        var emojiCatCon = js.addEl(emojiContainer, 'div', 'emojipicker-emoji-category');
        var headline = js.addEl(emojiCatCon, 'h3');
        headline.textContent = category.name[this.language];
        var emojiSubCon = js.addEl(emojiCatCon, 'div', 'emojipicker-emojis');

        for (var y in category.items) {
          if (category.items.hasOwnProperty(y)) {
            var item = category.items[y];
            var emoji = js.addEl(emojiSubCon, 'div', 'emojipicker-emoji');
            emoji.textContent = item.char;
            emoji.setAttribute('title', y);
            emoji.setAttribute('alt', y);
          }
        }
      }
    }
  }

  return EmojiPicker;
}());

window.EmojiPicker = EmojiPicker;
module.exports = EmojiPicker;
