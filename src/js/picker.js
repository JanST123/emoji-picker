var emojiLib = require("emojilib");
var js = require('janst123_js.js');
require('./../scss/styles.scss');
var mainCategories={
  "people": {
    name: {"de" : "Leute", "en": "People"},
    symbol: require('./../../svg/people.svg'),
    items: {},
    order: 1
  },

  "animals_and_nature": {
    name: {"de" : "Tiere & Natur", "en": "Animals & Nature"},
    symbol: require('./../../svg/animals.svg'),
    items: {},
    order: 2
  },

  "food_and_drink": {
    name: {"de" : "Essen & Trinken", "en": "Food & Drink"},
    symbol: require('./../../svg/food.svg'),
    items: {},
    order: 3
  },

  "activity": {
    name: {"de" : "Aktivitäten", "en": "Activity"},
    symbol: require('./../../svg/activities.svg'),
    items: {},
    order: 4
  },

  "travel_and_places": {
    name: {"de" : "Reisen & Orte", "en": "Travel & Places"},
    symbol: require('./../../svg/travel.svg'),
    items: {},
    order: 5
  },

  "objects": {
    name: {"de" : "Objekte", "en": "Objects"},
    symbol: require('./../../svg/objects.svg'),
    items: {},
    order: 6
  },

  "flags": {
    name: {"de" : "Flaggen", "en": "Flags"},
    symbol: require('./../../svg/flags.svg'),
    items: {},
    order: 7
  }
};

var EmojiPicker = /** @class */ (function() {

  /**
   * construct the emojipicker
   * @param {Node} targetEl (the node element to show the picker next to)
   * @param {Function} onChoose (callback which is invoked when emoji is choosed)
   */
  function EmojiPicker(targetEl, onChoose, language, recommendedEmojis) {
    if (targetEl === undefined) throw new Error('must give a targetEl');
    if (onChoose === undefined) throw new Error('must give a onChoose callback');
    if (language === undefined) language="en";
    if (recommendedEmojis === undefined) recommendedEmojis=[];

    if (['de','en'].indexOf(language) < 0) throw new Error('language must be "de" or "en"');

    this.targetEl = targetEl;
    this.onChoose = onChoose;
    this.language = language;
    this.recommendedEmojis = recommendedEmojis;

    // separate emojis in our categories
    for (var x in emojiLib.lib) {
      if (emojiLib.lib.hasOwnProperty(x)) {
        // do we know the category?
        if (emojiLib.lib[x].category in mainCategories) {
          mainCategories[emojiLib.lib[x].category].items[x] = emojiLib.lib[x];
        }
      }
    }


    if (this.recommendedEmojis.length > 0) {
      var tmp = JSON.parse(JSON.stringify(mainCategories));
      mainCategories={
        "recommended": {
          name: {"de" : "Empfohlen", "en": "Recommended"},
          symbol: require('./../../svg/recommended.svg'),
          items: {},
          order: 1
        }
      };
      for (var x in tmp) {
        if (tmp.hasOwnProperty(x)) {
          mainCategories[x] = tmp[x];
        }
      }

      for (var r=0; r < this.recommendedEmojis.length; ++r) {
        if (this.recommendedEmojis[r] in emojiLib.lib) {
          mainCategories['recommended'].items[this.recommendedEmojis[r]] = emojiLib.lib[this.recommendedEmojis[r]];
        }
      }
    }
  }

  var container, categoryContainer, searchContainer, emojiContainer, containerRect;

  /**
   * mark a category link as active
   * @param {Object} category
   */
  var markCategoryActive = (category) => {
    var other=document.querySelectorAll('.emojipicker-category');
    for (var i=0; i<other.length; ++i) {
      js.removeClass(other[i], 'active');
    }
    js.addClass(category.catContainerEl, 'active');
  }

  EmojiPicker.prototype.appendEmoji = function(container, item, itemKey) {
    var emoji = js.addEl(container, 'div', 'emojipicker-emoji');
    emoji.textContent = item.char;
    emoji.setAttribute('title', itemKey);
    emoji.setAttribute('alt', itemKey);


    js.eventListener(emoji).add('emojiClick', 'click', function(_item, _onChoose) {
      return () => _onChoose(_item);
    }(item, this.onChoose));
  }

  /**
   * display all the emojis
   */
  EmojiPicker.prototype.displayFilteredEmojis = function(searchTerm) {
    if (searchTerm === undefined) searchTerm = null;

    var rx=new RegExp('^' + searchTerm.replace(/[^A-Za-z0-9öäüßÖÄÜ\s]/g, ''), 'g');
    var rx2=new RegExp(searchTerm.replace(/[^A-Za-z0-9öäüßÖÄÜ\s]/g, ''), 'g');

    emojiContainer.innerHTML="";

    var emojiCatCon = js.addEl(emojiContainer, 'div', 'emojipicker-emoji-category');
    var emojiSubCon = js.addEl(emojiCatCon, 'div', 'emojipicker-emojis');

    var resultCount=0;

    for (var x in emojiLib.lib) {
      if (emojiLib.lib.hasOwnProperty(x)) {
        var item = emojiLib.lib[x];

        var keywords = item.keywords;
        keywords.push(x);

        // find in keywords

        var found=false;
        for (var k=0; k < keywords.length; ++k) {
          if (keywords[k].match(rx) || (searchTerm.length > 4 && keywords[k].match(rx2))) {
            found=true;
            break;
          }
        }

        if (found) {
          this.appendEmoji(emojiSubCon, emojiLib.lib[x], x);
          ++resultCount;
        }
      }
    }

    if (resultCount == 0) {
      var noresult = js.addEl(emojiSubCon, 'div', 'emojipicker-noresult');
      noresult.textContent = this.language == 'de' ? 'Nichts gefunden 😔' : 'Nothing found 😔';
    }

    this.positionContainer();
  }

  /**
   * display all the emojis
   */
  EmojiPicker.prototype.displayEmojis = function() {
    emojiContainer.innerHTML="";

    for (var x in mainCategories) {
      if (mainCategories.hasOwnProperty(x)) {
        var category = mainCategories[x];

        var emojiCatCon = js.addEl(emojiContainer, 'div', 'emojipicker-emoji-category');
        var headline = js.addEl(emojiCatCon, 'h3');
        category.containerEl = emojiCatCon;
        headline.textContent = category.name[this.language];
        var emojiSubCon = js.addEl(emojiCatCon, 'div', 'emojipicker-emojis');

        for (var y in category.items) {
          if (category.items.hasOwnProperty(y)) {
            this.appendEmoji(emojiSubCon, category.items[y], y);
          }
        }
      }
    }

    this.positionContainer();
  }

  EmojiPicker.prototype.positionContainer = function() {
    containerRect = emojiContainer.getBoundingClientRect();

    var targetRect = this.targetEl.getBoundingClientRect();
    var top = targetRect.bottom;
    var left = targetRect.left - (containerRect.width / 2);

    if (left < 0) {
      left = 0;
    }
    if ((left + containerRect.width) > (window.scrollX + window.innerWidth)) {
      left = (window.scrollX + window.innerWidth) - containerRect.width;
    }

    if ((top + containerRect.height) > (window.scrollY + window.innerHeight)) {
      top = targetRect.top - containerRect.height;
    }

    container.style.top = Math.round(top) + 'px';
    container.style.left = Math.round(left) + 'px';

  }

  EmojiPicker.prototype.toggle = function() {
      if (this.visible) this.hide();
      else              this.show();
  };

  EmojiPicker.prototype.hide = function() {
    if (!this.visible) return;
    js.removeEl(container);
    this.visible=false;
  };

  /**
   * create the picker and make it visible
   */
  EmojiPicker.prototype.show = function() {
    if (this.visible) return;
    this.visible=true;
    container = js.addEl(this.targetEl, 'div', 'emojipicker-container', 'after');



    // append categories, searchbox and emojis
    categoryContainer = js.addEl(container, 'div', 'emojipicker-category-container');
    searchContainer = js.addEl(container, 'div', 'emojipicker-search-container');
    emojiContainer = js.addEl(container, 'div', 'emojipicker-emoji-container');

    containerRect = emojiContainer.getBoundingClientRect();

    var scrollDebounce=null;
    js.eventListener(emojiContainer).add('emojiScroll', 'scroll', function() {
      if (scrollDebounce) window.clearTimeout(scrollDebounce);
      scrollDebounce = window.setTimeout(function(scrolltop) {
        return function() {

          var activeCat=null;
          for (var x in mainCategories) {
            if (mainCategories.hasOwnProperty(x) && typeof(mainCategories[x].containerEl) !== 'undefined') {
              var rect = mainCategories[x].containerEl.getBoundingClientRect();

              if (
                   (
                     (rect.top >= containerRect.top && rect.top <= containerRect.bottom)
                  || (rect.bottom >= containerRect.top && rect.top <= containerRect.bottom)
                   )
              || (
                     rect.top < containerRect.top && rect.bottom > containerRect.bottom
                 )
              ) {
                  activeCat = mainCategories[x];
                  break;
                }
            }
          }
          if (activeCat && typeof(activeCat.catContainerEl) !== 'undefined') {
            markCategoryActive(activeCat);
          }

          scrollDebounce=null;
        }
      }(this.scrollTop), 100);
    });

    var firstCat=true;

    for (var x in mainCategories) {
      if (mainCategories.hasOwnProperty(x)) {
        var category = mainCategories[x];

        var catCon = js.addEl(categoryContainer, 'div', 'emojipicker-category');
        category.catContainerEl = catCon;
        if (firstCat) {
          firstCat=false;
          js.addClass(catCon, 'active');
        }

        // add click handler
        js.eventListener(catCon).add('categoryClick', 'click', function(_category) {
          return function () {
            markCategoryActive(_category);

            if (typeof(_category.containerEl) !== 'undefined') {
              var rect = _category.containerEl.getBoundingClientRect();
              emojiContainer.scrollTop = (rect.top - containerRect.top) + emojiContainer.scrollTop;
            }
          }
        }(category));


        var a = js.addEl(catCon, 'a');
        a.setAttribute('title', category.name[this.language]);
        a.innerHTML = category.symbol;
      }
    }

    // searching & filtering
    var searchInput = js.addEl(searchContainer, 'input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', this.language == 'de' ? 'Filtere nach Emojis' : 'Filter emojis');
    var searchDebounce = null;
    js.eventListener(searchInput).add('searchType', 'keyup', () => {
      if (searchDebounce) window.clearTimeout(searchDebounce);
      searchDebounce = window.setTimeout(((searchterm) => {
        return () => {
          searchDebounce=null;
          if (searchterm.trim() == '') {
            this.displayEmojis();

          } else {
            this.displayFilteredEmojis(searchterm);
          }
        }
      })(searchInput.value), 100);

    });


    // finally display emojis
    this.displayEmojis();

    window.setTimeout(() => this.positionContainer(), 100);


  }

  return EmojiPicker;
}());

window.EmojiPicker = EmojiPicker;
module.exports = EmojiPicker;
