/**
	Represents a little sparkle object in the game.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');

    var NotchSprite = require('mario/notchsprite');

    var Sparkle = function(world, x, y, xa, ya) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.xa = xa;
        this.ya = ya;
        this.xPic = Math.floor(Math.random() * 2);
        this.yPic = 0;

        this.life = 10 + Math.floor(Math.random() * 5);
        this.xPicStart = this.xPic;
        this.xPicO = 4;
        this.yPicO = 4;

        this.picWidth = 8;
        this.picHeight = 8;
        this.image = Resources.images.particles;
    };

    Sparkle.prototype = new NotchSprite();

    Sparkle.prototype.move = function() {
        if (this.life > 10) {
            this.xPic = 7;
        } else {
            this.xPic = Math.floor(this.xPicStart + (10 - this.life) * 0.4);
        }

        if (this.life-- < 0) {
            this.world.removeSprite(this);
        }

        this.x += this.xa;
        this.y += this.ya;
    };

    return Sparkle;
});