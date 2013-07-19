/**
    Creates a specific type of sprite based on the information given.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Enemy = require('mario/enemy');
    var FlowerEnemy = require('mario/flowerenemy');

    var SpriteTemplate = function(type, winged) {
        this.type = type;
        this.winged = winged;
        this.lastVisibleTick = -1;
        this.isDead = false;
        this.sprite = null;
    };

    SpriteTemplate.prototype = {
        spawn: function(world, x, y, dir) {
            if (this.isDead) {
                return;
            }

            if (this.type === Enemy.flower) {
                this.sprite = new FlowerEnemy(world, x * 16 + 15, y * 16 + 24);
            } else {
                this.sprite = new Enemy(world, x * 16 + 8, y * 16 + 15, dir, this.type, this.winged);
            }
            this.sprite.spriteTemplate = this;
            world.addSprite(this.sprite);
        }
    };

    return SpriteTemplate;
});