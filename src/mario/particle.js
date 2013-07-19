/**
	Represents a piece of a broken block.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
	'use strict';

	var Resources = require('enjine/resources');

	var NotchSprite = require('mario/notchsprite');

	var Particle = function(world, x, y, xa, ya) {
		this.world = world;
		this.x = x;
		this.y = y;
		this.xa = xa;
		this.ya = ya;
		this.xPic = Math.floor(Math.random() * 2);
		this.yPic = 0;
		this.xPicO = 4;
		this.yPicO = 4;

		this.picWidth = 8;
		this.picHeight = 8;
		this.life = 10;

		this.image = Resources.images.particles;
	};

	Particle.prototype = new NotchSprite();

	Particle.prototype.move = function() {
		if (this.life - this.delta < 0) {
			this.world.removeSprite(this);
		}
		this.life -= this.delta;

		this.x += this.xa;
		this.y += this.ya;
		this.ya *= 0.95;
		this.ya += 3;
	};

	return Particle;
});