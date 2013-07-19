/**
	Renders a playable level.
	Code by Rob Kleffner, 2011
*/
/* jshint bitwise: false */
/* global define */

define(function(require) {
    'use strict';

    var Drawable = require('enjine/drawable');
    var Resources = require('enjine/resources');

    var SpriteCuts = require('mario/spritecuts');
    var Tile = require('mario/tile');

    var LevelRenderer = function(level, width, height) {
        this.width = width;
        this.height = height;
        this.level = level;
        this.tilesY = Math.floor(height / 16) + 1;
        this.delta = 0;
        this.tick = 0;
        this.bounce = 0;
        this.animTime = 0;

        this.background = SpriteCuts.getLevelSheet();
    };

    LevelRenderer.prototype = new Drawable();

    LevelRenderer.prototype.update = function(delta) {
        this.animTime += delta;
        this.tick = Math.floor(this.animTime);
        this.bounce += delta * 30;
        this.delta = delta;
    };

    LevelRenderer.prototype.draw = function(context, camera) {
        this.drawStatic(context, camera);
        this.drawDynamic(context, camera);
    };

    LevelRenderer.prototype.drawStatic = function(context, camera) {
        var x = 0, y = 0, b = 0, frame = null, xTileStart = Math.floor(camera.x / 16), xTileEnd = Math.floor((camera.x + this.width) / 16);

        for (x = xTileStart; x < xTileEnd + 1; x++) {
            for (y = 0; y < this.tilesY; y++) {
                b = this.level.getBlock(x, y) & 0xff;
                if ((Tile.behaviors[b] & Tile.animated) === 0) {
                    frame = this.background[b % 16][Math.floor(b / 16)];
                    context.drawImage(Resources.images.map, frame.x, frame.y, frame.width, frame.height, Math.floor((x * 16) - camera.x), Math.floor(y * 16), frame.width, frame.height);
                }
            }
        }
    };

    LevelRenderer.prototype.drawDynamic = function(context, camera) {
        var x = 0, y = 0, b = 0, animTime = 0, yo = 0, frame = null;
        for (x = Math.floor(camera.x / 16); x <= Math.floor((camera.x + this.width) / 16); x++) {
            for (y = Math.floor(camera.y / 16); y <= Math.floor((camera.y + this.height) / 16); y++) {
                b = this.level.getBlock(x, y);

                if (((Tile.behaviors[b & 0xff]) & Tile.animated) > 0) {
                    animTime = Math.floor(this.bounce / 3) % 4;
                    if (Math.floor((b % 16) / 4) === 0 && Math.floor(b / 16) === 1) {
                        animTime = Math.floor(this.bounce / 2 + (x + y) / 8) % 20;
                        if (animTime > 3) {
                            animTime = 0;
                        }
                    }
                    if (Math.floor((b % 16) / 4) === 3 && Math.floor(b / 16) === 0) {
                        animTime = 2;
                    }
                    yo = 0;
                    if (x >= 0 && y >= 0 && x < this.level.width && y < this.level.height) {
                        yo = this.level.data[x][y];
                    }
                    if (yo > 0) {
                        yo = Math.floor(Math.sin((yo - this.delta) / 4 * Math.PI) * 8);
                    }
                    frame = this.background[Math.floor((b % 16) / 4) * 4 + animTime][Math.floor(b / 16)];
                    context.drawImage(Resources.images.map, frame.x, frame.y, frame.width, frame.height, (x * 16) - camera.x, (y * 16) - camera.y - yo, frame.width, frame.height);
                }
            }
        }
    };

    LevelRenderer.prototype.drawExit0 = function(context, camera, bar) {
        var y = 0, yh = 0, frame = null;
        for (y = this.level.exitY - 8; y < this.level.exitY; y++) {
            frame = this.background[12][y === this.level.exitY - 8 ? 4 : 5];
            context.drawImage(Resources.images.map, frame.x, frame.y, frame.width, frame.height, (this.level.exitX * 16) - camera.x - 16, (y * 16) - camera.y, frame.width, frame.height);
        }

        if (bar) {
            yh = this.level.exitY * 16 - (3 * 16) - (Math.sin(this.animTime) * 3 * 16) - 8;// - ((Math.sin(((this.bounce + this.delta) / 20) * 0.5 + 0.5) * 7 * 16) | 0) - 8;
            frame = this.background[12][3];
            context.drawImage(Resources.images.map, frame.x, frame.y, frame.width, frame.height, (this.level.exitX * 16) - camera.x - 16, yh - camera.y, frame.width, frame.height);
            frame = this.background[13][3];
            context.drawImage(Resources.images.map, frame.x, frame.y, frame.width, frame.height, (this.level.exitX * 16) - camera.x, yh - camera.y, frame.width, frame.height);
        }
    };

    LevelRenderer.prototype.drawExit1 = function(context, camera) {
        var y = 0, frame = null;
        for (y = this.level.exitY - 8; y < this.level.exitY; y++) {
            frame = this.background[13][y === this.level.exitY - 8 ? 4 : 5];
            context.drawImage(Resources.images.map, frame.x, frame.y, frame.width, frame.height, (this.level.exitX * 16) - camera.x + 16, (y * 16) - camera.y, frame.width, frame.height);
        }
    };

    return LevelRenderer;
});
