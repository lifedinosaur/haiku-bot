require.config(
{
    baseUrl: '../dist/assets/js/',
    paths:
    {
      bridge: '../../../tests/qunit/bridge',
      haikuTests: '../../../tests/js/haiku-tests',
      jquery: 'lib/jquery',
      QUnit: '../../../tests/qunit/qunit'
    },
    shim: {
      'QUnit': {
        exports: 'QUnit',
        init: function () {
          QUnit.config.autoload = false;
          QUnit.config.autostart = false;
        }
      }
    }
});

define(
[
  'jquery',
  'QUnit',
  'haikuTests'
],
function ($, QUnit, haikuTests) {
  'use strict';

  // Switch between headless and browser-based execution:
  if (/PhantomJS/.test(window.navigator.userAgent)) {
    require(['bridge'], function () {
      haikuTests.run();
    });
  }
  else {
    haikuTests.run();
  }
});
