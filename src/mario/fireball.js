/**
    Represents a fireball.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');

    var NotchSprite = require('mario/notchsprite');
    var Sparkle = require('mario/sparkle');

    var Fireball = function(world, x, y, facing) {
        this.groundInertia = 0.89;
        this.airInertia = 0.89;

        this.image = Resources.images.particles;

        this.world = world;
        this.x = x;
        this.y = y;
        this.facing = facing;

        this.xPicO = 4;
        this.yPicO = 4;
        this.yPic = 3;
        this.xPic = 4;
        this.height = 8;
        this.width = 4;
        this.picWidth = this.picHeight = 8;
        this.ya = 4;
        this.dead = false;
        this.deadTime = 0;
        this.anim = 0;
        this.onGround = false;
    };

    Fireball.prototype = new NotchSprite();

    Fireball.prototype.move = function() {
        var i = 0, sideWaysSpeed = 8;

        if (this.deadTime > 0) {
            for (i = 0; i < 8; i++) {
                this.world.addSprite(new Sparkle(this.world, Math.floor(this.x + Math.random() * 8 - 4) + 4, Math.floor(this.y + Math.random() * 8 - 4) + 2, Math.random() * 2 - 1 * this.facing, Math.random() * 2 - 1, 0, 1, 5));
            }
            this.world.removeSprite(this);
            return;
        }

        if (this.facing !== 0) {
            this.anim++;
        }

        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }

        this.xa = this.facing * sideWaysSpeed;

        this.world.checkFireballCollide(this);

        this.flipX = this.facing === -1;

        this.xPic = this.anim % 4;

        if (!this.subMove(this.xa, 0)) {
            this.die();
        }

        this.onGround = false;
        this.subMove(0, this.ya);
        if (this.onGround) {
            this.ya = -10;
        }

        this.ya *= 0.95;
        if (this.onGround) {
            this.xa *= this.groundInertia;
        } else {
            this.xa *= this.airInertia;
        }

        if (!this.onGround) {
            this.ya += 1.5;
        }
    };

    Fireball.prototype.subMove = function(xa, ya) {
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

    Fireball.prototype.isBlocking = function(x, y, xa, ya) {
        x = Math.floor(x / 16);
        y = Math.floor(y / 16);

        if (x === Math.floor(this.x / 16) && y === Math.floor(this.y / 16)) {
            return false;
        }

        return this.world.level.isBlocking(x, y, xa, ya);
    };

    Fireball.prototype.die = function() {
        this.dead = true;
        this.xa = -this.facing * 2;
        this.ya = -5;
        this.deadTime = 100;
    };

    return Fireball;
});