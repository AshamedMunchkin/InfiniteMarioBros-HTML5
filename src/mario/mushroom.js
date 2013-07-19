/**
	Represents a life-giving mushroom.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');

    var Mario = require('mario/mario');
    var NotchSprite = require('mario/notchsprite');

    var Mushroom = function(world, x, y) {
        this.runTime = 0;
        this.groundInertia = 0.89;
        this.airInertia = 0.89;
        this.onGround = false;
        this.width = 4;
        this.height = 24;
        this.world = world;
        this.x = x;
        this.y = y;
        this.image = Resources.images.items;
        this.xPicO = 8;
        this.yPicO = 15;
        this.yPic = 0;
        this.height = 12;
        this.facing = 1;
        this.picWidth = this.picHeight = 16;
        this.life = 0;
    };

    Mushroom.prototype = new NotchSprite();

    Mushroom.prototype.collideCheck = function() {
        var xMarioD = Mario.marioCharacter.x - this.x, yMarioD = Mario.marioCharacter.y - this.y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.height && yMarioD < Mario.marioCharacter.height) {
                Mario.marioCharacter.getMushroom();
                this.world.removeSprite(this);
            }
        }
    };

    Mushroom.prototype.move = function() {
        if (this.life < 9) {
            this.layer = 0;
            this.y--;
            this.life++;
            return;
        }

        var sideWaysSpeed = 1.75;
        this.layer = 1;

        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }

        this.xa = this.facing * sideWaysSpeed;

        this.xFlip = this.facing === -1;
        this.runTime += Math.abs(this.xa) + 5;

        if (!this.subMove(this.xa, 0)) {
            this.facing = -this.facing;
        }
        this.onGround = false;
        this.subMove(0, this.ya);

        this.ya *= 0.85;
        if (this.onGround) {
            this.xa *= this.groundInertia;
        } else {
            this.xa *= this.airInertia;
        }

        if (!this.onGround) {
            this.ya += 2;
        }
    };

    Mushroom.prototype.subMove = function(xa, ya) {
        var collide = false;

        while (xa > 8) {
            if (!this.subMove(8, 0)) {
                return false;
            }
            xa -= 8;
        }
        while (xa < -8) {
            if (!this.subMove(-8, 0)) {
                return false;
            }
            xa += 8;
        }
        while (ya > 8) {
            if (!this.subMove(0, 8)) {
                return false;
            }
            ya -= 8;
        }
        while (ya < -8) {
            if (!this.subMove(0, -8)) {
                return false;
            }
            ya += 8;
        }

        if (ya > 0) {
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, 0)) {
                collide = true;
            } else if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, 0)) {
                collide = true;
            } else if (this.isBlocking(this.x + xa - this.width, this.y + ya + 1, xa, ya)) {
                collide = true;
            } else if (this.isBlocking(this.x + xa + this.width, this.y + ya + 1, xa, ya)) {
                collide = true;
            }
        }
        if (ya < 0) {
            if (this.isBlocking(this.x + xa, this.y + ya - this.height, xa, ya)) {
                collide = true;
            } else if (collide || this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya)) {
                collide = true;
            } else if (collide || this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya)) {
                collide = true;
            }
        }

        if (xa > 0) {
            if (this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya)) {
                collide = true;
            }
            if (this.isBlocking(this.x + xa + this.width, this.y + ya - Math.floor(this.height / 2), xa, ya)) {
                collide = true;
            }
            if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, ya)) {
                collide = true;
            }
        }
        if (xa < 0) {
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya)) {
                collide = true;
            }
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - Math.floor(this.height / 2), xa, ya)) {
                collide = true;
            }
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, ya)) {
                collide = true;
            }
        }

        if (collide) {
            if (xa < 0) {
                this.x = Math.floor((this.x - this.width) / 16) * 16 + this.width;
                this.xa = 0;
            }
            if (xa > 0) {
                this.x = Math.floor((this.x + this.width) / 16 + 1) * 16 - this.width - 1;
                this.xa = 0;
            }
            if (ya < 0) {
                this.y = Math.floor((this.y - this.height) / 16) * 16 + this.height;
                this.jumpTime = 0;
                this.ya = 0;
            }
            if (ya > 0) {
                this.y = Math.floor((this.y - 1) / 16 + 1) * 16 - 1;
                this.onGround = true;
            }

            return false;
        } else {
            this.x += xa;
            this.y += ya;
            return true;
        }
    };

    Mushroom.prototype.isBlocking = function(x, y, xa, ya) {
        x = Math.floor(x / 16);
        y = Math.floor(y / 16);

        if (x === Math.floor(this.x / 16) && y === Math.floor(this.y / 16)) {
            return false;
        }

        return this.world.level.isBlocking(x, y, xa, ya);
    };

    Mushroom.prototype.bumpCheck = function(x, y) {
        if (this.x + this.width > x * 16 && this.x - this.width < x * 16 - 16 && y === Math.floor((y - 1) / 16)) {
            this.facing = -Mario.marioCharacter.facing;
            this.ya = -10;
        }
    };

    return Mushroom;
});