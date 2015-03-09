define(
[
  'jquery',
  'lib/lodash',
  'plugins'
],
function ($, _, plugins) {
  'use strict';

  var DICTIONARY_SRC = 'http://lifedinosaur.com/haiku-bot/assets/dictionary/dictionary.json';
  var DICTIONARY = {};

  // Part of speech keys:
  //
  // Noun       N
  // Plural      p
  // Verb (usu participle) V
  // Verb (transitive) t
  // Verb (intransitive)   i
  // Adjective   A
  // Adverb      v
  // Conjunction   C
  // Preposition   P
  // Interjection    !
  // Pronoun     r
  // Definite Article  D
  //
  var HAIKU_FORMS = [
    ["N", "D", "t", "N", "r", "t", "N", "r", "V", "A", "A", "N", "!", "r", "C", "A", "N"],
    ["N", "v", "V", "C", "D", "A", "N", "V", "P", "D", "N", "!", "r", "C", "A", "N", "V"],
    ["V", "D", "N", "D", "N", "C", "i", "v", "V", "t", "A", "!", "r", "C", "A", "N", "V"],
    ["P", "D", "A", "N", "r", "V", "p", "C", "D", "N", "D", "N", "P", "N", "!", "r", "V"],
    ["D", "A", "N", "i", "P", "D", "N", "V", "P", "D", "N", "!", "r", "C", "A", "N", "V"],
    ["!", "r", "C", "A", "N", "V", "P", "N", "v", "D", "A", "N", "i", "P", "D", "N", "V"]
  ];

  var LINE_SYLLABLES = [5, 7, 5];

  // Constructor:
  function Haiku () {
    Object.call(this);
  }

  // Lo-Dash _.create makes object extension a breeze:
  Haiku.prototype = _.create(Object.prototype, {
    'constructor': Haiku,

    // Current form word-selection should attempt to follow:
    currentForm: HAIKU_FORMS[0],

    // The index of the current word form part of speech:
    currentFormIdx: 0,

    // Main function to generate a new haiku poem.
    // Returns an HTML formatted string:
    generateHaiku: function () {
      // Get a random set of word-syllables for each haiku line:
      var syllables = this.getHaikuSyllables();

      // Get a random part of speech form for this poem.
      // And reset the index:
      var randomIdx = plugins.getRandomInteger(0, HAIKU_FORMS.length - 1);
      this.currentForm = HAIKU_FORMS[randomIdx];
      this.currentFormIdx = 0;

      // Get words for each haiku line syllables:
      var lines = [];
      _.forEach(syllables, function (s) {
        lines.push(this.getHaikuLine(s));
      }, this);

      // Generate the final output from the words list above:
      var poem = "";
      _.forEach(lines, function (l) {
        var line = "";
        _.forEach(l, function (w, i) {
          line += w;
          if (i != l.length - 1) {
            line += ' ';
          }
        });
        // Capitalize the first letter of each line:
        //line = line.charAt(0).toUpperCase() + line.slice(1);
        poem += line + '<br/>';
      });

      return poem;
    },

    // Returns the loaded dictionary JSON file:
    getDictionary: function () {
      return DICTIONARY;
    },

    // Generates a single line of words for each syllable number in the given array.
    // Returns an array of strings:
    getHaikuLine: function (syllables) {
      var line = [];

      _.forEach(syllables, function (s, i) {
        line.push(this.getHaikuWord(s));
      }, this);

      return line;
    },

    // Generates the random syllables for one line of the haiku.
    // Returns an array of integers between 1 and the corresponding number
    // in LINE_SYLLABLES:
    getHaikuLineSyllables: function (currentLine) {
      var line = [];
      var currentSyllable = 0;

      while (currentSyllable < LINE_SYLLABLES[currentLine]) {
        var syllables = plugins.getRandomInteger(1,
          LINE_SYLLABLES[currentLine] - currentSyllable);

        line.push(syllables);

        currentSyllable += syllables;
      }

      return line;
    },

    // Generates a nested array of syllables for each line of the poem.
    // Returns a 2-dimensional array of integers:
    getHaikuSyllables: function () {
      var lines = [];

      while (lines.length < LINE_SYLLABLES.length) {
        lines.push(this.getHaikuLineSyllables(lines.length));
      }

      return lines;
    },

    // Based on the number of syllables integer and the current haiku form and
    // index, generates and selects from a list of possible words for the
    // corresponding part of speech.
    // Returns a string:
    getHaikuWord: function (s) {
      var numSyllables = s.toString();

      var posList = [];
      var posKey;
      // Some combinations of part of speech and number of syllables will not
      // return a list at all. Move to the next form pos in this case:
      while (posList.length <= 0) {
        posKey = this.currentForm[this.currentFormIdx];

        posList = this.getPartOfSpeechList(numSyllables, posKey);
        this.currentFormIdx++;
      }

      var possibleWords = this.getPossibleWordsList(numSyllables, posList);

      return possibleWords[
        plugins.getRandomInteger(0, possibleWords.length - 1)];
    },

    // Generates a list all object property keys containing the target
    // part of speech for the corresponding syllable number.
    // Returns an array of strings:
    getPartOfSpeechList: function (numSyllables, posKey) {
      var posList = [];
      _.forIn(DICTIONARY[numSyllables], function (val, key) {
        if (key.indexOf(posKey) > -1) {
          posList.push(key);
        }
      }, this);

      return posList;
    },

    // Generates a list of all possible words for a given number of syllables
    // and the list of part of speech keys.
    // Returns an array of strings:
    getPossibleWordsList: function (numSyllables, posList) {
      var possibleWords = [];
      _.forEach(posList, function (pos) {
        possibleWords = possibleWords.concat(DICTIONARY[numSyllables][pos]);
      });

      return possibleWords;
    }
  });

  // Fetches the dictionary JSON from src URL and fires callback:
  function loadDictionary (callback) {
    $.getJSON(DICTIONARY_SRC, function (data) {
        DICTIONARY = data;

        callback.call();
      }
    );
  }

  // External API:
  return {
    loadDictionary: loadDictionary,
    Haiku: Haiku
  };
});
