/**
	Represents a simple little coin animation when popping out of the box.
	Code by Rob Kleffner, 2011
*/
/* jshint bitwise: false */
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');

    var NotchSprite = require('mario/notchsprite');
    var Sparkle = require('mario/sparkle');

    var CoinAnim = function(world, x, y) {
        this.world = world;
        this.life = 10;
        this.image = Resources.images.map;
        this.picWidth = this.picHeight = 16;
        this.x = x * 16;
        this.y = y * 16 - 16;
        this.xa = 0;
        this.ya = -6;
        this.xPic = 0;
        this.yPic = 2;
    };

    CoinAnim.prototype = new NotchSprite();

    CoinAnim.prototype.move = function() {
        var x = 0, y = 0;
        if (this.life-- < 0) {
            this.world.removeSprite(this);
            for (x = 0; x < 2; x++) {
                for (y = 0; y < 2; y++) {
                    this.world.addSprite(new Sparkle(this.world, Math.floor(this.x + x * 8 + Math.random() * 8), Math.floor(this.y + y * 8 + Math.random() * 8), 0, 0, 0, 2, 5));
                }
            }
        }

        this.xPic = this.life & 3;
        this.x += this.xa;
        this.y += this.ya;
        this.ya += 1;
    };

    return CoinAnim;
});
