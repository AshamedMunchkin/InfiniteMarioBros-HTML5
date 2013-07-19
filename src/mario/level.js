/**
    Represents a playable level in the game.
    Code by Rob Kleffner, 2011
*/
/* jshint bitwise: false */
/* global define */

define(function(require) {
    'use strict';

    var Tile = require('mario/tile');

    var Level = function(width, height) {
        this.width = width;
        this.height = height;
        this.exitX = 10;
        this.exitY = 10;

        this.map = [];
        this.data = [];
        this.spriteTemplates = [];

        var x = 0, y = 0;
        for (x = 0; x < this.width; x++) {
            this.map[x] = [];
            this.data[x] = [];
            this.spriteTemplates[x] = [];

            for (y = 0; y < this.height; y++) {
                this.map[x][y] = 0;
                this.data[x][y] = 0;
                this.spriteTemplates[x][y] = null;
            }
        }
    };

    Level.prototype = {
        update: function() {
            var x = 0, y = 0;
            for (x = 0; x < this.width; x++) {
                for (y = 0; y < this.height; y++) {
                    if (this.data[x][y] > 0) {
                        this.data[x][y]--;
                    }
                }
            }
        },

        getBlockCapped: function(x, y) {
            if (x < 0) { x = 0; }
            if (y < 0) { y = 0; }
            if (x >= this.width) { x = this.width - 1; }
            if (y >= this.height) { y = this.height - 1; }
            return this.map[x][y];
        },

        getBlock: function(x, y) {
            if (x < 0) { x = 0; }
            if (y < 0) { return 0; }
            if (x >= this.width) { x = this.width - 1; }
            if (y >= this.height) { y = this.height - 1; }
            return this.map[x][y];
        },

        setBlock: function(x, y, block) {
            if (x < 0) { return; }
            if (y < 0) { return; }
            if (x >= this.width) { return; }
            if (y >= this.height) { return; }
            this.map[x][y] = block;
        },

        setBlockData: function(x, y, data) {
            if (x < 0) { return; }
            if (y < 0) { return; }
            if (x >= this.width) { return; }
            if (y >= this.height) { return; }
            this.data[x][y] = data;
        },

        isBlocking: function(x, y, xa, ya) {
            var block = this.getBlock(x, y);
            var blocking = ((Tile.behaviors[block & 0xff]) & Tile.blockAll) > 0;
            blocking |= (ya > 0) && ((Tile.behaviors[block & 0xff]) & Tile.blockUpper) > 0;
            blocking |= (ya < 0) && ((Tile.behaviors[block & 0xff]) & Tile.blockLower) > 0;

            return blocking;
        },

        getSpriteTemplate: function(x, y) {
            if (x < 0) { return null; }
            if (y < 0) { return null; }
            if (x >= this.width) { return null; }
            if (y >= this.height) { return null; }
            return this.spriteTemplates[x][y];
        },

        setSpriteTemplate: function(x, y, template) {
            if (x < 0) { return; }
            if (y < 0) { return; }
            if (x >= this.width) { return; }
            if (y >= this.height) { return; }
            this.spriteTemplates[x][y] = template;
        }
    };

    return Level;
});