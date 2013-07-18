/**
    State for moving between different playable levels.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var AnimatedSprite = require('enjine/animatedsprite');
    var Camera = require('enjine/camera');
    var GameState = require('enjine/gamestate');
    var Keyboard = require('enjine/keyboard');
    var Keys = require('enjine/keys');
    var Resources = require('enjine/resources');

    var ImprovedNoise = require('mario/improvednoise');
    var LevelState = require('mario/levelstate');
    var LevelType = require('mario/leveltype');
    var MapTile = require('mario/maptile');
    var Mario = require('mario/mario');
    var SpriteCuts = require('mario/spritecuts');
    var WinState = require('mario/winstate');

    var MapState = function() {
        this.camera = new Camera();

        this.level = [];
        this.data = [];
        this.xMario = 0;
        this.yMario = 0;
        this.xMarioA = 0;
        this.yMarioA = 0;
        this.moveTime = 0;
        this.levelId = 0;
        this.farthest = 0;
        this.xFarthestCap = 0;
        this.yFarthestCap = 0;
        this.mapImage = document.createElement('canvas');
        this.mapImage.width = 320;
        this.mapImage.height = 240;
        this.mapContext = this.mapImage.getContext('2d');
        this.canEnterLevel = false;
        this.enterLevel = false;
        this.levelDifficulty = 0;
        this.levelType = 0;

        this.worldNumber = -1;
        this.nextWorld();
    };

    MapState.prototype = new GameState();

    MapState.prototype.enter = function() {
        this.waterSprite = new AnimatedSprite();
        this.waterSprite.image = Resources.images.worldMap;
        this.waterSprite.setColumnCount(16);
        this.waterSprite.setRowCount(16);
        this.waterSprite.addNewSequence('loop', 14, 0, 14, 3);
        this.waterSprite.framesPerSecond = 1/3;
        this.waterSprite.playSequence('loop', true);
        this.waterSprite.x = 0;
        this.waterSprite.y = 0;
        this.waterSprite.xPivot = 0;
        this.waterSprite.yPivot = 0;

        this.decoSprite = new AnimatedSprite();
        this.decoSprite.image = Resources.images.worldMap;
        this.decoSprite.setColumnCount(16);
        this.decoSprite.setRowCount(16);
        this.decoSprite.addNewSequence('world0', 10, 0, 10, 3);
        this.decoSprite.addNewSequence('world1', 11, 0, 11, 3);
        this.decoSprite.addNewSequence('world2', 12, 0, 12, 3);
        this.decoSprite.addNewSequence('world3', 13, 0, 13, 3);
        this.decoSprite.framesPerSecond = 1/3;
        this.decoSprite.playSequence('world0', true);
        this.decoSprite.x = 0;
        this.decoSprite.y = 0;
        this.decoSprite.xPivot = 0;
        this.decoSprite.yPivot = 0;

        this.helpSprite = new AnimatedSprite();
        this.helpSprite.image = Resources.images.worldMap;
        this.helpSprite.setColumnCount(16);
        this.helpSprite.setRowCount(16);
        this.helpSprite.addNewSequence('help', 7, 3, 7, 5);
        this.helpSprite.framesPerSecond = 1/2;
        this.helpSprite.playSequence('help', true);
        this.helpSprite.x = 0;
        this.helpSprite.y = 0;
        this.helpSprite.xPivot = 0;
        this.helpSprite.yPivot = 0;

        this.smallMario = new AnimatedSprite();
        this.smallMario.image = Resources.images.worldMap;
        this.smallMario.setColumnCount(16);
        this.smallMario.setRowCount(16);
        this.smallMario.addNewSequence('small', 1, 0, 1, 1);
        this.smallMario.framesPerSecond = 1/3;
        this.smallMario.playSequence('small', true);
        this.smallMario.x = 0;
        this.smallMario.y = 0;
        this.smallMario.xPivot = 0;
        this.smallMario.yPivot = 0;

        this.largeMario = new AnimatedSprite();
        this.largeMario.image = Resources.images.worldMap;
        this.largeMario.setColumnCount(16);
        this.largeMario.setRowCount(8);
        this.largeMario.addNewSequence('large', 0, 2, 0, 3);
        this.largeMario.addNewSequence('fire', 0, 4, 0, 5);
        this.largeMario.framesPerSecond = 1/3;
        this.largeMario.playSequence('large', true);
        this.largeMario.x = 0;
        this.largeMario.y = 0;
        this.largeMario.xPivot = 0;
        this.largeMario.yPivot = 0;

        this.fontShadow = SpriteCuts.createBlackFont();
        this.font = SpriteCuts.createWhiteFont();

        //get the correct world decoration
        this.decoSprite.playSequence('world' + (this.worldNumber % 4), true);

        if (!Mario.marioCharacter.fire) {
            this.largeMario.playSequence('large', true);
        } else {
            this.largeMario.playSequence('fire', true);
        }

        this.enterLevel = false;
        this.levelDifficulty = 0;
        this.levelType = 0;

        //Mario.PlayMapMusic();
    };

    MapState.prototype.exit = function() {
        //Mario.StopMusic();

        delete this.waterSprite;
        delete this.decoSprite;
        delete this.helpSprite;
        delete this.smallMario;
        delete this.largeMario;
        delete this.fontShadow;
        delete this.font;
    };

    MapState.prototype.nextWorld = function() {
        var generated = false;
        this.worldNumber++;

        //The player has won, wait for CheckForChange to get called
        if (this.worldNumber === 8) {
            return;
        }

        this.moveTime = 0;
        this.levelId = 0;
        this.farthest = 0;
        this.xFarthestCap = 0;
        this.yFarthestCap = 0;

        while (!generated) {
            generated = this.generateLevel();
        }
        this.renderStatic();
    };

    MapState.prototype.generateLevel = function() {
        var x = 0, y = 0, t0 = 0, t1 = 0, td = 0, t = 0;

        var n0 = new ImprovedNoise(Math.floor(Math.random() * 9223372036854775807));
        var n1 = new ImprovedNoise(Math.floor(Math.random() * 9223372036854775807));
        var dec = new ImprovedNoise(Math.floor(Math.random() * 9223372036854775807));

        var width = 320 / 16 + 1;
        var height = 240 / 16 + 1;
        this.level = [];
        this.data = [];

        var xo0 = Math.random() * 512;
        var yo0 = Math.random() * 512;
        var xo1 = Math.random() * 512;
        var yo1 = Math.random() * 512;

        for (x = 0; x < width; x++) {
            this.level[x] = [];
            this.data[x] = [];

            for (y = 0; y < height; y++) {

                t0 = n0.perlinNoise(x * 10 + xo0, y * 10 + yo0);
                t1 = n1.perlinNoise(x * 10 + xo1, y * 10 + yo1);
                td = t0 - t1;
                t = td * 2;

                this.level[x][y] = t > 0 ? MapTile.water : MapTile.grass;
            }
        }

        var lowestX = 9999, lowestY = 9999, i = 0;
        t = 0;

        for (i = 0; i < 100 && t < 12; i++) {
            x = Math.floor(Math.random() * Math.floor((width - 1) / 3)) * 3 + 2;
            y = Math.floor(Math.random() * Math.floor((height - 1) / 3)) * 3 + 1;
            if (this.level[x][y] === MapTile.grass) {
                if (x < lowestX) {
                    lowestX = x;
                    lowestY = y;
                }
                this.level[x][y] = MapTile.level;
                this.data[x][y] = -1;
                t++;
            }
        }

        this.data[lowestX][lowestY] = -2;

        var connection = true;
        while (connection) { connection = this.findConnection(width, height); }
        this.findCaps(width, height);

        if (this.xFarthestCap === 0) {
            return false;
        }

        this.data[this.xFarthestCap][this.yFarthestCap] = -2;
        this.data[Math.floor(this.xMario / 16)][Math.floor(this.yMario / 16)] = -11;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (this.level[x][y] === MapTile.grass && (x !== this.xFarthestCap || y !== this.yFarthestCap - 1)) {
                    t0 = dec.perlinNoise(x * 10 + xo0, y * 10 + yo0);
                    if (t0 > 0) {
                        this.level[x][y] = MapTile.decoration;
                    }
                }
            }
        }

        return true;
    };

    MapState.prototype.findConnection = function(width, height) {
        var x = 0, y = 0;
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (this.level[x][y] === MapTile.level && this.data[x][y] === -1) {
                    this.connect(x, y, width, height);
                    return true;
                }
            }
        }
        return false;
    };

    MapState.prototype.connect = function(xSource, ySource, width, height) {
        var maxDistance = 10000, xTarget = 0, yTarget = 0, x = 0, y = 0,
            xd = 0, yd = 0, d = 0;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (this.level[x][y] === MapTile.level && this.data[x][y] === -2) {
                    xd = Math.floor(Math.abs(xSource - x));
                    yd = Math.floor(Math.abs(ySource - y));
                    d = xd * xd + yd * yd;
                    if (d < maxDistance) {
                        xTarget = x;
                        yTarget = y;
                        maxDistance = d;
                    }
                }
            }
        }

        this.drawRoad(xSource, ySource, xTarget, yTarget);
        this.level[xSource][ySource] = MapTile.level;
        this.data[xSource][ySource] = -2;
        return;
    };

    MapState.prototype.drawRoad = function(x0, y0, x1, y1) {
        var xFirst = false;
        if (Math.random() > 0.5) {
            xFirst = true;
        }

        if (xFirst) {
            while (x0 > x1) {
                this.data[x0][y0] = 0;
                this.level[x0--][y0] = MapTile.road;
            }
            while (x0 < x1) {
                this.data[x0][y0] = 0;
                this.level[x0++][y0] = MapTile.road;
            }
        }

        while (y0 > y1) {
            this.data[x0][y0] = 0;
            this.level[x0][y0--] = MapTile.road;
        }
        while (y0 < y1) {
            this.data[x0][y0] = 0;
            this.level[x0][y0++] = MapTile.road;
        }

        if (!xFirst) {
            while (x0 > x1) {
                this.data[x0][y0] = 0;
                this.level[x0--][y0] = MapTile.road;
            }
            while (x0 < x1) {
                this.data[x0][y0] = 0;
                this.level[x0++][y0] = MapTile.road;
            }
        }
    };

    MapState.prototype.findCaps = function(width, height) {
        var x = 0, y = 0, xCap = -1, yCap = -1, roads = 0, xx = 0, yy = 0;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (this.level[x][y] === MapTile.level) {
                    roads = 0;

                    for (xx = x - 1; xx <= x + 1; xx++) {
                        for (yy = y - 1; yy <= y + 1; yy++) {
                            if (this.level[xx][yy] === MapTile.road) {
                                roads++;
                            }
                        }
                    }

                    if (roads === 1) {
                        if (xCap === -1) {
                            xCap = x;
                            yCap = y;
                        }
                        this.data[x][y] = 0;
                    } else {
                        this.data[x][y] = 1;
                    }
                }
            }
        }

        this.xMario = xCap * 16;
        this.yMario = yCap * 16;

        this.travel(xCap, yCap, -1, 0);
    };

    MapState.prototype.travel = function(x, y, dir, depth) {
        if (this.level[x][y] !== MapTile.road && this.level[x][y] !== MapTile.level) {
            return;
        }

        if (this.level[x][y] === MapTile.road) {
            if (this.data[x][y] === 1) {
                return;
            } else {
                this.data[x][y] = 1;
            }
        }

        if (this.level[x][y] === MapTile.level) {
            if (this.data[x][y] > 0) {
                if (this.levelId !== 0 && Math.floor(Math.random() * 4) === 0) {
                    this.data[x][y] = -3;
                } else {
                    this.data[x][y] = ++this.levelId;
                }
            } else if (depth > 0) {
                this.data[x][y] = -1;
                if (depth > this.farthest) {
                    this.farthest = depth;
                    this.xFarthestCap = x;
                    this.yFarthestCap = y;
                }
            }
        }

        if (dir !== 2) {
            this.travel(x - 1, y, 0, depth++);
        }
        if (dir !== 3) {
            this.travel(x, y - 1, 1, depth++);
        }
        if (dir !== 0) {
            this.travel(x + 1, y, 2, depth++);
        }
        if (dir !== 1) {
            this.travel(x, y + 1, 3, depth++);
        }
    };

    MapState.prototype.renderStatic = function() {
        var x = 0, y = 0, p0 = 0, p1 = 0, p2 = 0, p3 = 0, s = 0, xx = 0, yy = 0,
            image = Resources.images.worldMap, type = 0;

        //320 / 16 = 20
        for (x = 0; x < 20; x++) {
            //240 / 16 = 15
            for (y = 0; y < 15; y++) {
                this.mapContext.drawImage(image, Math.floor(this.worldNumber / 4) * 16, 0, 16, 16, x * 16, y * 16, 16, 16);

                if (this.level[x][y] === MapTile.level) {
                    type = this.data[x][y];
                    if (type === 0) {
                        this.mapContext.drawImage(image, 0, 7 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    } else if (type === -1) {
                        this.mapContext.drawImage(image, 3 * 16, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    } else if (type === -3) {
                        this.mapContext.drawImage(image, 0, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    } else if (type === -10) {
                        this.mapContext.drawImage(image, 16, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    } else if (type === -11) {
                        this.mapContext.drawImage(image, 16, 7 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    } else if (type === -2) {
                        this.mapContext.drawImage(image, 2 * 16, 7 * 16, 16, 16, x * 16, (y - 1) * 16, 16, 16);
                        this.mapContext.drawImage(image, 2 * 16, 8 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    } else {
                        this.mapContext.drawImage(image, (type - 1) * 16, 6 * 16, 16, 16, x * 16, y * 16, 16, 16);
                    }
                } else if (this.level[x][y] === MapTile.road) {
                    p0 = this.isRoad(x - 1, y) ? 1 : 0;
                    p1 = this.isRoad(x, y - 1) ? 1 : 0;
                    p2 = this.isRoad(x + 1, y) ? 1 : 0;
                    p3 = this.isRoad(x, y + 1) ? 1 : 0;
                    s = p0 + (p1 * 2) + (p2 * 4) + (p3 * 8);
                    this.mapContext.drawImage(image, s * 16, 32, 16, 16, x * 16, y * 16, 16, 16);
                } else if (this.level[x][y] === MapTile.water) {
                    for (xx = 0; xx < 2; xx++) {
                        for (yy = 0; yy < 2; yy++) {
                            p0 = this.isWater(x * 2 + (xx - 1), y * 2 + (yy - 1)) ? 0 : 1;
                            p1 = this.isWater(x * 2 + xx, y * 2 + (yy - 1)) ? 0 : 1;
                            p2 = this.isWater(x * 2 + (xx - 1), y * 2 + yy) ? 0 : 1;
                            p3 = this.isWater(x * 2 + xx, y * 2 + yy) ? 0 : 1;
                            s = p0 + (p1 * 2) + (p2 * 4) + (p3 * 8) - 1;
                            if (s >= 0 && s <= 14) {
                                this.mapContext.drawImage(image, s * 16, (4 + ((xx + yy) % 2 === 1 ? 1 : 0)) * 16, 16, 16, x * 16 + xx * 8, y * 16 + yy * 8, 16, 16);
                            }
                        }
                    }
                }
            }
        }
    };

    MapState.prototype.isRoad = function(x, y) {
        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }
        if (this.level[x][y] === MapTile.road) {
            return true;
        }
        if (this.level[x][y] === MapTile.level) {
            return true;
        }
        return false;
    };

    MapState.prototype.isWater = function(x, y) {
        var xx = 0, yy = 0;
        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }

        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                if (this.level[Math.floor((x + xx) / 2)][Math.floor((y + yy) / 2)] !== MapTile.water) {
                    return false;
                }
            }
        }

        return true;
    };

    MapState.prototype.update = function(delta) {
        var x = 0, y = 0, difficulty = 0, type = 0;

        if (this.worldNumber === 8) {
            return;
        }

        this.xMario += this.xMarioA;
        this.yMario += this.yMarioA;

        x = Math.floor(this.xMario / 16);
        y = Math.floor(this.yMario / 16);

        if (this.level[x][y] === MapTile.road) {
            this.data[x][y] = 0;
        }

        if (this.moveTime > 0) {
            this.moveTime--;
        } else {
            this.xMarioA = 0;
            this.yMarioA = 0;

            if (this.canEnterLevel && Keyboard.isKeyDown(Keys.s)) {
                if (this.level[x][y] === MapTile.level && this.data[x][y] !== -11) {
                    if (this.level[x][y] === MapTile.level && this.data[x][y] !== 0 && this.data[x][y] > -10) {
                        difficulty = this.worldNumber + 1;
                        Mario.marioCharacter.levelString = difficulty + '-';
                        type = LevelType.overground;

                        if (this.data[x][y] > 1 && Math.floor(Math.random() * 3) === 0) {
                            type = LevelType.underground;
                        }

                        if (this.data[x][y] < 0) {
                            if (this.data[x][y] === -2) {
                                Mario.marioCharacter.levelString += 'X';
                                difficulty += 2;
                            } else if (this.data[x][y] === -1) {
                                Mario.marioCharacter.levelString += '?';
                            } else {
                                Mario.marioCharacter.levelString += '#';
                                difficulty += 1;
                            }

                            type = LevelType.castle;
                        } else {
                            Mario.marioCharacter.levelString += this.data[x][y];
                        }

                        //TODO: stop music here
                        this.enterLevel = true;
                        this.levelDifficulty = difficulty;
                        this.levelType = type;
                    }
                }
            }

            this.canEnterLevel = !Keyboard.isKeyDown(Keys.s);

            if (Keyboard.isKeyDown(Keys.left)) {
                this.tryWalking(-1, 0);
            }
            if (Keyboard.isKeyDown(Keys.right)) {
                this.tryWalking(1, 0);
            }
            if (Keyboard.isKeyDown(Keys.up)) {
                this.tryWalking(0, -1);
            }
            if (Keyboard.isKeyDown(Keys.down)) {
                this.tryWalking(0, 1);
            }
        }

        this.waterSprite.update(delta);
        this.decoSprite.update(delta);
        this.helpSprite.update(delta);
        if (!Mario.marioCharacter.large) {
            this.smallMario.x = this.xMario + Math.floor(this.xMarioA * delta);
            this.smallMario.y = this.yMario + Math.floor(this.yMarioA * delta) - 6;
            this.smallMario.update(delta);
        } else {
            this.largeMario.x = this.xMario + Math.floor(this.xMarioA * delta);
            this.largeMario.y = this.yMario + Math.floor(this.yMarioA * delta) - 22;
            this.largeMario.update(delta);
        }
    };

    MapState.prototype.tryWalking = function(xd, yd) {
        var x = Math.floor(this.xMario / 16), y = Math.floor(this.yMario / 16), xt = x + xd, yt = y + yd;

        if (this.level[xt][yt] === MapTile.road || this.level[xt][yt] === MapTile.level) {
            if (this.level[xt][yt] === MapTile.road) {
                if ((this.data[xt][yt] !== 0) && (this.data[x][y] !== 0 && this.data[x][y] > -10)) {
                    return;
                }
            }

            this.xMarioA = xd * 8;
            this.yMarioA = yd * 8;
            this.moveTime = this.calcDistance(x, y, xd, yd) * 2 + 1;
        }
    };

    MapState.prototype.calcDistance = function(x, y, xa, ya) {
        var distance = 0;
        while (true) {
            x += xa;
            y += ya;
            if (this.level[x][y] !== MapTile.road) {
                return distance;
            }
            if (this.level[x - ya][y + xa] === MapTile.road) {
                return distance;
            }
            if (this.level[x + ya][y - xa] === MapTile.road) {
                return distance;
            }
            distance++;
        }
    };

    MapState.prototype.draw = function(context) {
        var x = 0, y = 0;

        if (this.worldNumber === 8) {
            return;
        }

        context.drawImage(this.mapImage, 0, 0);

        for (y = 0; y <= 15; y++) {
            for (x = 20; x >= 0; x--) {
                if (this.level[x][y] === MapTile.water) {
                    if (this.isWater(x * 2 - 1, y * 2 - 1)) {
                        this.waterSprite.x = x * 16 - 8;
                        this.waterSprite.y = y * 16 - 8;
                        this.waterSprite.draw(context, this.camera);
                    }
                } else if (this.level[x][y] === MapTile.decoration) {
                    this.decoSprite.x = x * 16;
                    this.decoSprite.y = y * 16;
                    this.decoSprite.draw(context, this.camera);
                } else if (this.level[x][y] === MapTile.level && this.data[x][y] === -2) {
                    this.helpSprite.x = x * 16 + 16;
                    this.helpSprite.y = y * 16 - 16;
                    this.helpSprite.draw(context, this.camera);
                }
            }
        }

        if (!Mario.marioCharacter.large) {
            this.smallMario.draw(context, this.camera);
        } else {
            this.largeMario.draw(context, this.camera);
        }

        this.font.strings[0] = { string: 'MARIO ' + Mario.marioCharacter.lives, x: 4, y: 4 };
        this.fontShadow.strings[0] = { string: 'MARIO ' + Mario.marioCharacter.lives, x: 5, y: 5 };
        this.font.strings[1] = { string: 'WORLD ' + (this.worldNumber + 1), x: 256, y: 4 };
        this.fontShadow.strings[1] = { string: 'WORLD ' + (this.worldNumber + 1), x: 257, y: 5 };

        this.fontShadow.draw(context, this.camera);
        this.font.draw(context, this.camera);
    };

    MapState.prototype.levelWon = function() {
        var x = this.xMario / 16, y = this.yMario / 16;
        if (this.data[x][y] === -2) {
            this.nextWorld();
            return;
        }
        if (this.data[x][y] !== -3) {
            this.data[x][y] = 0;
        } else {
            this.data[x][y] = -10;
        }
        this.renderStatic();
    };

    MapState.prototype.getX = function() {
        return 160;
    };

    MapState.prototype.getY = function() {
        return 120;
    };

    MapState.prototype.checkForChange = function(context) {
        if (this.worldNumber === 8) {
            context.changeState(new WinState());
        }
        if (this.enterLevel) {
            context.changeState(new LevelState(this.levelDifficulty, this.levelType));
        }
    };

    return MapState;
});