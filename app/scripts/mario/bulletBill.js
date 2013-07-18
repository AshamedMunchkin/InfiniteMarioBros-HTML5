/**
    Represents a bullet bill enemy.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');

    var Mario = require('mario/mario');
    var NotchSprite = require('mario/notchsprite');
    var Sparkle = require('mario/sparkle');

    var BulletBill = function(world, x, y, dir) {
        this.image = Resources.images.enemies;
        this.world = world;
        this.x = x;
        this.y = y;
        this.facing = dir;

        this.xPicO = 8;
        this.yPicO = 31;
        this.height = 12;
        this.width = 4;
        this.picWidth = 16;
        this.yPic = 5;
        this.xPic = 0;
        this.ya = -5;
        this.deadTime = 0;
        this.dead = false;
        this.anim = 0;
    };

    BulletBill.prototype = new NotchSprite();

    BulletBill.prototype.collideCheck = function() {
        if (this.dead) {
            return;
        }

        var xMarioD = Mario.marioCharacter.x - this.x, yMarioD = Mario.marioCharacter.y - this.y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.height && yMarioD < this.world.mario.height) {
                if (Mario.marioCharacter.y > 0 && yMarioD <= 0 && (!Mario.marioCharacter.onGround || !Mario.marioCharacter.wasOnGround)) {
                    Mario.marioCharacter.stomp(this);
                    this.dead = true;

                    this.xa = 0;
                    this.ya = 1;
                    this.deadTime = 100;
                } else {
                    Mario.marioCharacter.getHurt();
                }
            }
        }
    };

    BulletBill.prototype.move = function() {
        var i = 0, sideWaysSpeed = 4;
        if (this.deadTime > 0) {
            this.deadTime--;

            if (this.deadTime === 0) {
                this.deadTime = 1;
                for (i = 0; i < 8; i++) {
                    this.world.addSprite(new Sparkle(Math.floor(this.x + Math.random() * 16 - 8) + 4, Math.floor(this.y + Math.random() * 8) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
                }
                this.world.removeSprite(this);
            }

            this.x += this.xa;
            this.y += this.ya;
            this.ya *= 0.95;
            this.ya += 1;

            return;
        }

        this.xa = this.facing * sideWaysSpeed;
        this.xFlip = this.facing === -1;
        this.move(this.xa, 0);
    };

    BulletBill.prototype.subMove = function(xa) {
        this.x += xa;
        return true;
    };

    BulletBill.prototype.fireballCollideCheck = function(fireball) {
        if (this.deadTime !== 0) {
            return false;
        }

        var xD = fireball.x - this.x, yD = fireball.y - this.y;
        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < fireball.height) {
                return true;
            }
        }
        return false;
    };

    BulletBill.prototype.shellCollideCheck = function(shell) {
        if (this.deadTime !== 0) {
            return false;
        }

        var xD = shell.x - this.x, yD = shell.y - this.y;
        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < shell.height) {
                Resources.playSound('kick');
                this.dead = true;
                this.xa = 0;
                this.ya = 1;
                this.deadTime = 100;
                return true;
            }
        }
        return false;
    };

    return BulletBill;
});