require.config(
{
    baseUrl: 'assets/js/',
    paths:
    {
      bootstrap: 'lib/bootstrap/',
      jquery: 'lib/jquery'
    }
});

define(
[
  'jquery',
  'haiku'
],
function ($, haiku) {
  'use strict';

  var _haiku;

  // Start by loading the dictionary - give a callback function:
  haiku.loadDictionary(dictionaryLoaded);


  // Called after the dictionary JSON is loaded:
  function dictionaryLoaded () {
    _haiku = new haiku.Haiku();

    // Call outputHaiku to generate and print a new random poem:
    outputHaiku();
  }

  // Add event handlers to UI-buttons with '.on' for ease of removal:
  function bindEventHandlers () {
    $('#createHaiku').on('click', createHaiku);
    $('#clearOutput').on('click', clearOutput);
  }

  // 'Make Another' UI-button handler function:
  function createHaiku () {
    outputHaiku();
  }

  // 'Clear', UI-button handler function:
  function clearOutput () {
    $('#output').html('');
  }

  // Generate and print a new haiku poem to the screen:
  function outputHaiku () {
    var start = '<p>&gt;&gt; ';
    var end = '</p><hr/>';

    // Turn off button function while working:
    unbindEventHandlers();

    // Append a new poem to the output window, calling the haiku API method:
    $('#output').append(start + _haiku.generateHaiku() + end);

    // Measure the new window height, and scroll to the bottom to show the newest:
    var height = $('#output')[0].scrollHeight;
    $('#outputScroll').scrollTop(height);

    // Add a little timeout to prevent button spamming:
    setTimeout(function () {
      bindEventHandlers();
    }, 300);
  }

  // Remove the UI-button event handlers:
  function unbindEventHandlers () {
    $('#createHaiku').off('click', createHaiku);
  }
});
