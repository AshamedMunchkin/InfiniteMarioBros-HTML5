/**
	Helper to cut up the sprites.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');
    var SpriteFont = require('enjine/spritefont');

    var SpriteCuts = {

        /*********************
         * Font related
         ********************/
        createBlackFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(0));
        },

        createRedFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(8));
        },

        createGreenFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(16));
        },

        createBlueFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(24));
        },

        createYellowFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(32));
        },

        createPinkFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(40));
        },

        createCyanFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(48));
        },

        createWhiteFont: function() {
            return new SpriteFont(Resources.images.font, 8, 8, this.getCharArray(56));
        },

        getCharArray: function(y) {
            var letters = [];
            var i = 0;
            for (i = 32; i < 127; i++) {
                letters[i] = { x: (i - 32) * 8, y: y };
            }
            return letters;
        },

        /*********************
         * Spritesheet related
         ********************/
        getBackgroundSheet: function() {
            var sheet = [];
            var x = 0, y = 0, width = Resources.images.background.width / 32, height = Resources.images.background.height / 32;

            for (x = 0; x < width; x++) {
                sheet[x] = [];

                for (y = 0; y < height; y++) {
                    sheet[x][y] = { x: x * 32, y: y * 32, width: 32, height: 32 };
                }
            }
            return sheet;
        },

        getLevelSheet: function() {
            var sheet = [], x = 0, y = 0, width = Resources.images.map.width / 16, height = Resources.images.map.height / 16;

            for (x = 0; x < width; x++) {
                sheet[x] = [];

                for (y = 0; y < height; y++) {
                    sheet[x][y] = { x: x * 16, y: y * 16, width: 16, height: 16 };
                }
            }
            return sheet;
        }
    };

    return SpriteCuts;
});