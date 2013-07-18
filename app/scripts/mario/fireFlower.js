/**
	Represents a fire powerup.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
	'use strict';

	var Resources = require('enjine/resources');

	var Mario = require('mario/mario');
	var NotchSprite = require('mario/notchsprite');

	var FireFlower = function(world, x, y) {
		this.width = 4;
		this.height = 24;

		this.world = world;
		this.x = x;
		this.y = y;
		this.image = Resources.images.items;

		this.xPicO = 8;
		this.yPicO = 15;
		this.xPic = 1;
		this.yPic = 0;
		this.height = 12;
		this.facing = 1;
		this.picWidth = this.picHeight = 16;

		this.life = 0;
	};

	FireFlower.prototype = new NotchSprite();

	FireFlower.prototype.collideCheck = function() {
		var xMarioD = Mario.marioCharacter.x - this.x, yMarioD = Mario.marioCharacter.y - this.y;
		if (xMarioD > -16 && xMarioD < 16) {
			if (yMarioD > -this.height && yMarioD < Mario.marioCharacter.height) {
				Mario.marioCharacter.getFlower();
				this.world.removeSprite(this);
			}
		}
	};

	FireFlower.prototype.move = function() {
		if (this.life < 9) {
			this.layer = 0;
			this.y--;
			this.life++;
			return;
		}
	};

	return FireFlower;
});