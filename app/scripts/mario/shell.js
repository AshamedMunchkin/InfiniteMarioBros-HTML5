/**
    Represents a shell that once belonged to a now expired koopa.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Resources = require('enjine/resources');

    var Mario = require('mario/mario');
    var NotchSprite = require('mario/notchsprite');
    var Sparkle = require('mario/sparkle');

    var Shell = function(world, x, y, type) {
        this.world = world;
        this.x = x;
        this.y = y;

        this.yPic = type;
        this.image = Resources.images.enemies;

        this.xPicO = 8;
        this.yPicO = 31;
        this.width = 4;
        this.height = 12;
        this.facing = 0;
        this.picWidth = 16;
        this.xPic = 4;
        this.ya = -5;

        this.dead = false;
        this.deadTime = 0;
        this.carried = false;

        this.groundInertia = 0.89;
        this.airInertia = 0.89;
        this.onGround = false;
        this.anim = 0;
    };

    Shell.prototype = new NotchSprite();

    Shell.prototype.fireballCollideCheck = function(fireball) {
        if (this.deadTime !== 0) {
            return false;
        }

        var xD = fireball.x - this.x, yD = fireball.y - this.y;
        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < fireball.height) {
                if (this.facing !== 0) {
                    return true;
                }

                Resources.playSound('kick');

                this.xa = fireball.facing * 2;
                this.ya = -5;
                if (this.spriteTemplate !== null) {
                    this.spriteTemplate.isDead = true;
                }
                this.deadTime = 100;
                this.yFlip = true;

                return true;
            }
        }
        return false;
    };

    Shell.prototype.collideCheck = function() {
        if (this.carried || this.dead || this.deadTime > 0) {
            return;
        }

        var xMarioD = Mario.marioCharacter.x - this.x, yMarioD = Mario.marioCharacter.y - this.y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.height && yMarioD < Mario.marioCharacter.height) {
                if (Mario.marioCharacter.ya > 0 && yMarioD <= 0 && (!Mario.marioCharacter.onGround || !Mario.marioCharacter.wasOnGround)) {
                    Mario.marioCharacter.stomp(this);
                    if (this.facing !== 0) {
                        this.xa = 0;
                        this.facing = 0;
                    } else {
                        this.facing = Mario.marioCharacter.facing;
                    }
                } else {
                    if (this.facing !== 0) {
                        Mario.marioCharacter.getHurt();
                    } else {
                        Mario.marioCharacter.kick(this);
                        this.facing = Mario.marioCharacter.facing;
                    }
                }
            }
        }
    };

    Shell.prototype.move = function() {
        var sideWaysSpeed = 11, i = 0;
        if (this.carried) {
            this.world.checkShellCollide(this);
            return;
        }

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

        if (this.facing !== 0) {
            this.world.checkShellCollide(this);
        }

        this.xFlip = this.facing === -1;

        this.xPic = Math.floor(this.anim / 2) % 4 + 3;

        if (!this.subMove(this.xa, 0)) {
            Resources.playSound('bump');
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

    Shell.prototype.subMove = function(xa, ya) {
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

    Shell.prototype.isBlocking = function(x, y, xa, ya) {
        x = Math.floor(x / 16);
        y = Math.floor(y / 16);

        if (x === Math.floor(this.x / 16) && y === Math.floor(this.y / 16)) {
            return false;
        }

        var blocking = this.world.level.isBlocking(x, y, xa, ya);

        if (blocking && ya === 0 && xa !== 0) {
            this.world.bump(x, y, true);
        }
        return blocking;
    };

    Shell.prototype.bumpCheck = function(x, y) {
        if (this.x + this.width > x * 16 && this.x - this.width < x * 16 + 16 && y === Math.floor((this.y - 1) / 16)) {
            this.facing = -Mario.marioCharacter.facing;
            this.ya = -10;
        }
    };

    Shell.prototype.die = function() {
        this.dead = true;
        this.carried = false;
        this.xa = -this.facing * 2;
        this.ya = -5;
        this.deadTime = 100;
    };

    Shell.prototype.shellCollideCheck = function(shell) {
        if (this.deadTime !== 0) {
            return false;
        }

        var xD = shell.x - this.x, yD = shell.y - this.y;
        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < shell.height) {
                Resources.playSound('kick');
                if (Mario.marioCharacter.carried === shell || Mario.marioCharacter.carried === this) {
                    Mario.marioCharacter.carried = null;
                }
                this.die();
                shell.die();
                return true;
            }
        }
        return false;
    };

    Shell.prototype.release = function() {
        this.carried = false;
        this.facing = Mario.marioCharacter.facing;
        this.x += this.facing * 8;
    };

    return Shell;
});