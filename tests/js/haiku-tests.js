define(
[
  'jquery',
  'lib/lodash',
  'QUnit',
  'haiku'
],
function ($, _, QUnit, haiku) {
  'use strict';

  var _haiku;

  function dictionaryLoaded () {
    QUnit.module('Haiku Tests', {
      beforeEach: function () {
        _haiku = new haiku.Haiku();
      },
      afterEach: function () {
        _haiku = null;
      }
    });

    QUnit.test('Line Syllables', function (assert) {
      var line = _haiku.getHaikuLineSyllables(0);
      assert.equal(testLineSyllables(line), 5,
        'The first line of a haiku should be 5 syllables.');

      line = _haiku.getHaikuLineSyllables(1);
      assert.equal(testLineSyllables(line), 7,
        'The second line of a haiku should be 7 syllables.');

      line = _haiku.getHaikuLineSyllables(2);
      assert.equal(testLineSyllables(line), 5,
        'The third line of a haiku should be 5 syllables.');
    });

    QUnit.test('Haiku Syllables', function (assert) {
      var lines = _haiku.getHaikuSyllables();

      var total = 0;
      _.forEach(lines, function (l) {
        total += testLineSyllables(l);
      });

      assert.equal(total, 17, 'The haiku should have a total of 17 syllables.');
    });

    QUnit.test('Haiku Lines', function (assert) {
      var line = _haiku.getHaikuLine([2, 1, 2]);
      assert.equal(line.length, 3,
        '[2, 1, 2] - A haiku line should have the correct number of words.');

      line = _haiku.getHaikuLine([7]);
      assert.equal(line.length, 1,
        '[7] - A haiku line should have the correct number of words.');

      line = _haiku.getHaikuLine([2, 1, 1, 1, 2]);
      assert.equal(line.length, 5,
        '[2, 1, 1, 1, 2] - A haiku line should have the correct number of words.');

      line = _haiku.getHaikuLine([1, 1, 1, 1, 1, 1, 1]);
      assert.equal(line.length, 7,
        '[1, 1, 1, 1, 1, 1, 1] - A haiku line should have the correct number of words.');
    });

    QUnit.test('Part-of-Speech List', function (assert) {
      var posList = _haiku.getPartOfSpeechList('7', 'N');
      assert.ok(testPosList('N', posList),
        '7/N - Each member of the part-of-speech list should contain the target.');

      posList = _haiku.getPartOfSpeechList('2', 'i');
      assert.ok(testPosList('i', posList),
        '2/i - Each member of the part-of-speech list should contain the target.');

      posList = _haiku.getPartOfSpeechList('3', 'D');
      assert.ok(testPosList('D', posList),
        '3/D - Each member of the part-of-speech list should contain the target.');

      posList = _haiku.getPartOfSpeechList('7', 'D');
      assert.equal(testPosList('D', posList), false,
        '7/D - Each syllable list does not include each target.');
    });

    QUnit.test('Possible Words List', function (assert) {
      var posList = ['N', 'NA', 'AN'];
      var words = _haiku.getPossibleWordsList('7', posList);
      var total = testWordsList('7', posList);
      assert.equal(words.length, total,
        '7/N - The possible words list should include each word from each target list.');

      posList = ['C', 'vC', 'PC', 'Cv', 'NCPA', 'CvAr'];
      words = _haiku.getPossibleWordsList('3', posList);
      total = testWordsList('3', posList);
      assert.equal(words.length, total,
        '3/C - The possible words list should include each word from each target list.');
    });

    start();
  }

  function run () {
    haiku.loadDictionary(dictionaryLoaded);
  }

  function start () {
    QUnit.load();
    QUnit.start();
  }

  function testLineSyllables (line) {
    var total = 0;

    _.forEach(line, function (s) {
      total += s;
    });

    return total;
  }

  function testPosList (target, list) {
    if (list.length === 0) {
      return false;
    }

    var conts = 0;
    _.forEach(list, function (pos) {
      if (pos.indexOf(target) === -1) {
        return;
      }
      conts++;
    });

    return (conts == list.length);
  }

  function testWordsList (numSyl, posList) {
    var dict = _haiku.getDictionary();
    var testWords = [];

    var total = 0;
    _.forEach(posList, function (pos) {
      total += dict[numSyl][pos].length;
    });

    return total;
  }

  return {
    run: run
  };
});
