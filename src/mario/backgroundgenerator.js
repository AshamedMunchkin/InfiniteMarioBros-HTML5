/**
	Generates the backgrounds for a level.
	Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
    'use strict';

    var Level = require('mario/level');
    var LevelType = require('mario/leveltype');

    var BackgroundGenerator = function(width, height, distant, type) {
        this.width = width;
        this.height = height;
        this.distant = distant;
        this.type = type;
    };

    BackgroundGenerator.prototype = {
        setValues: function(width, height, distant, type) {
            this.width = width;
            this.height = height;
            this.distant = distant;
            this.type = type;
        },

        createLevel: function() {
            var level = new Level(this.width, this.height);
            switch (this.type) {
            case LevelType.overground:
                this.generateOverground(level);
                break;
            case LevelType.underground:
                this.generateUnderground(level);
                break;
            case LevelType.castle:
                this.generateCastle(level);
                break;
            }
            return level;
        },

        generateOverground: function(level) {
            var range = this.distant ? 4 : 6;
            var offs = this.distant ? 2 : 1;
            var oh = Math.floor(Math.random() * range) + offs;
            var h = Math.floor(Math.random() * range) + offs;

            var x = 0, y = 0, h0 = 0, h1 = 0, s = 2;
            for (x = 0; x < this.width; x++) {
                oh = h;
                while (oh === h) {
                    h = Math.floor(Math.random() * range) + offs;
                }

                for (y = 0; y < this.height; y++) {
                    h0 = (oh < h) ? oh : h;
                    h1 = (oh < h) ? h : oh;
                    s = 2;
                    if (y < h0) {
                        if (this.distant){
                            s = 2;
                            if (y < 2) { s = y; }
                            level.setBlock(x, y, 4 + s * 8);
                        } else {
                            level.setBlock(x, y, 5);
                        }
                    } else if (y === h0) {
                        s = h0 === h ? 0 : 1;
                        s += this.distant ? 2 : 0;
                        level.setBlock(x, y, s);
                    } else if (y === h1) {
                        s = h0 === h ? 0 : 1;
                        s += this.distant ? 2 : 0;
                        level.setBlock(x, y, s + 16);
                    } else {
                        s = (y > h1) ? 1 : 0;
                        if (h0 === oh) { s = 1 - s; }
                        s += this.distant ? 2 : 0;
                        level.setBlock(x, y, s + 8);
                    }
                }
            }
        },

        generateUnderground: function(level) {
            var x = 0, y = 0, t = 0, yy = 0;
            if (this.distant) {
                var tt = 0;
                for (x = 0; x < this.width; x++) {
                    if (Math.random() < 0.75) { tt = 1 - tt; }

                    for (y = 0; y < this.height; y++) {
                        t = tt;
                        yy = y - 2;

                        if (yy < 0 || yy > 4) {
                            yy = 2;
                            t = 0;
                        }
                        level.setBlock(x, y, (4 + t + (3 + yy) * 8));
                    }
                }
            } else {
                for (x = 0; x < this.width; x++) {
                    for (y = 0; y < this.height; y++) {
                        t = x % 2;
                        yy = y - 1;
                        if (yy < 0 || yy > 7) {
                            yy = 7;
                            t = 0;
                        }
                        if (t === 0 && yy > 1 && yy < 5) {
                            t = -1;
                            yy = 0;
                        }

                        level.setBlock(x, y, (6 + t + yy * 8));
                    }
                }
            }
        },

        generateCastle: function(level) {
            var x = 0, y = 0, t = 0, yy = 0;
            if (this.distant) {
                for (x = 0; x < this.width; x++) {
                    for (y = 0; y < this.height; y++) {
                        t = x % 2;
                        yy = y - 1;

                        if (yy > 2 && yy < 5) {
                            yy = 2;
                        } else if (yy >= 5) {
                            yy -= 2;
                        }

                        if (yy < 0) {
                            t = 0;
                            yy = 5;
                        } else if (yy > 4) {
                            t = 1;
                            yy = 5;
                        } else if (t < 1 && yy === 3) {
                            t = 0;
                            yy = 3;
                        } else if (t < 1 && yy > 0 && yy < 3) {
                            t = 0;
                            yy = 2;
                        }

                        level.setBlock(x, y, (1 + t + (yy + 4) * 8));
                    }
                }
            } else {
                for (x = 0; x < this.width; x++) {
                    for (y = 0; y < this.height; y++) {
                        t = x % 3;
                        yy = y - 1;

                        if (yy > 2 && yy < 5) {
                            yy = 2;
                        } else if (yy >= 5) {
                            yy -= 2;
                        }

                        if (yy < 0) {
                            t = 1;
                            yy = 5;
                        } else if (yy > 4) {
                            t = 2;
                            yy = 5;
                        } else if (t < 2 && yy === 4) {
                            t = 2;
                            yy = 4;
                        } else if (t < 2 && yy > 0 && yy < 4) {
                            t = 4;
                            yy = -3;
                        }

                        level.setBlock(x, y, (1 + t + (yy + 3) * 8));
                    }
                }
            }
        }
    };

    return BackgroundGenerator;
});
