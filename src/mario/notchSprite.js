/**
	Notch made his own sprite class for this game. Rather than hack around my own,
    I directly ported his to JavaScript and used that where needed.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Drawable = require('enjine/drawable');

    var NotchSprite = function(image) {
        this.xOld = 0;
        this.yOld = 0;
        this.x = 0;
        this.y = 0;
        this.xa = 0;
        this.ya = 0;
        this.xPic = 0;
        this.yPic = 0;
        this.xPicO = 0;
        this.yPicO = 0;
        this.picWidth = 32;
        this.picHeight = 32;
        this.xFlip = false;
        this.yFlip = false;
        this.visible = true;
        this.image = image;
        this.delta = 0;
        this.spriteTemplate = null;
        this.layer = 1;
    };

    NotchSprite.prototype = new Drawable();

    NotchSprite.prototype.draw = function(context) {
        var xPixel = 0, yPixel = 0;
        if (!this.visible) {
            return;
        }

        xPixel = Math.floor(this.xOld + (this.x - this.xOld) * this.delta) - this.xPicO;
        yPixel = Math.floor(this.yOld + (this.y - this.yOld) * this.delta) - this.yPicO;

        context.save();
        context.scale(this.xFlip ? -1 : 1, this.yFlip ? -1 : 1);
        context.translate(this.xFlip ? -320 : 0, this.yFlip ? -240 : 0);
        context.drawImage(this.image, this.xPic * this.picWidth, this.yPic * this.picHeight, this.picWidth, this.picHeight,
            this.xFlip ? (320 - xPixel - this.picWidth) : xPixel, this.yFlip ? (240 - yPixel - this.picHeight) : yPixel, this.picWidth, this.picHeight);
        context.restore();
    };

    NotchSprite.prototype.update = function(delta) {
        this.xOld = this.x;
        this.yOld = this.y;
        this.move();
        this.delta = delta;
    };

    NotchSprite.prototype.updateNoMove = function() {
        this.xOld = this.x;
        this.yOld = this.y;
        this.delta = 0;
    };

    NotchSprite.prototype.move = function() {
        this.x += this.xa;
        this.y += this.ya;
    };

    NotchSprite.prototype.getX = function(delta) {
        return Math.floor(this.xOld + (this.x - this.xOld) * delta) - this.xPicO;
    };

    NotchSprite.prototype.getY = function(delta) {
        return Math.floor(this.yOld + (this.y - this.yOld) * delta) - this.yPicO;
    };

    NotchSprite.prototype.collideCheck = function() { };

    NotchSprite.prototype.bumpCheck = function() { };

    NotchSprite.prototype.release = function() { };

    NotchSprite.prototype.shellCollideCheck = function() {
        return false;
    };

    NotchSprite.prototype.fireballCollideCheck = function() {
        return false;
    };

    return NotchSprite;
});