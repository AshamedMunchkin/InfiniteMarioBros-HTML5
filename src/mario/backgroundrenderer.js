/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/
/* jshint bitwise: false */
/* global define */

define(function(require) {
    'use strict';

    var Drawable = require('enjine/drawable');
    var Resources = require('enjine/resources');

    var SpriteCuts = require('mario/spritecuts');

    var BackgroundRenderer = function(level, width, height, distance) {
        this.level = level;
        this.width = width;
        this.distance = distance;
        this.tilesY = Math.floor(height / 32) + 1;

        this.background = SpriteCuts.getBackgroundSheet();
    };

    BackgroundRenderer.prototype = new Drawable();

    BackgroundRenderer.prototype.draw = function(context, camera) {
        var xCam = camera.x / this.distance;
        var x = 0, y = 0, b = null, frame = null;

        //the OR truncates the decimal, quicker than Math.floor
        var xTileStart = Math.floor(xCam / 32);
        //the +1 makes sure the right edge tiles get drawn
        var xTileEnd = Math.floor((xCam + this.width) / 32);

        for (x = xTileStart; x <= xTileEnd; x++) {
            for (y = 0; y < this.tilesY; y++) {
                b = this.level.getBlock(x, y) & 0xff;
                frame = this.background[b % 8][Math.floor(b / 8)];

                //bitshifting by five is the same as multiplying by 32
                context.drawImage(Resources.images.background, frame.x, frame.y, frame.width, frame.height, Math.floor((x * 32) - xCam), Math.floor(y * 32), frame.width, frame.height);
            }
        }
    };

    return BackgroundRenderer;
});
