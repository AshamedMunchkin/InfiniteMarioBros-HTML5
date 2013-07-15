/**
	Generates a psuedo-random procedural level.
	Code by Rob Kleffner, 2011
*/

Mario.LevelGenerator = function(width, height) {
    this.width = width;
    this.height = height;
    this.odds = [];
    this.totalOdds = 0;
    this.difficulty = 0;
    this.type = 0;
};

Mario.LevelGenerator.prototype = {
    createLevel: function(type, difficulty) {
        var i = 0, length = 0, floor = 0, x = 0, y = 0, ceiling = 0, run = 0, level = null;
        
        this.type = type;
        this.difficulty = difficulty;
        this.odds[Mario.Odds.straight] = 20;
        this.odds[Mario.Odds.hillStraight] = 10;
        this.odds[Mario.Odds.tubes] = 2 + difficulty;
        this.odds[Mario.Odds.jump] = 2 * difficulty;
        this.odds[Mario.Odds.cannon] = -10 + 5 * difficulty;
        
        if (this.type !== Mario.LevelType.overground) {
            this.odds[Mario.Odds.hillStraight] = 0;
        }
        
        for (i = 0; i < this.odds.length; i++) {
            if (this.odds[i] < 0) {
                this.odds[i] = 0;
            }
            this.totalOdds += this.odds[i];
            this.odds[i] = this.totalOdds - this.odds[i];
        }
        
        level = new Mario.Level(this.width, this.height);
        length += this.buildStraight(level, 0, level.width, true);
        while (length < level.width - 64) {
            length += this.buildZone(level, length, level.width - length);
        }
        
        floor = this.height - 1 - (Math.random() * 4) | 0;
        level.exitX = length + 8;
        level.exitY = floor;
        
        for (x = length; x < level.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (y >= floor) {
                    level.setBlock(x, y, 1 + 9 * 16);
                }
            }
        }
        
        if (type === Mario.LevelType.castle || type === Mario.LevelType.underground) {
            for (x = 0; x < level.width; x++) {
                if (run-- <= 0 && x > 4) {
                    ceiling = (Math.random() * 4) | 0;
                    run = ((Math.random() * 4) | 0) + 4;
                }
                for (y = 0; y < level.height; y++) {
                    if ((x > 4 && y <= ceiling) || x < 1) {
                        level.setBlock(x, y, 1 + 9 * 16);
                    }
                }
            }
        }
        
        this.fixWalls(level);
        
        return level;
    },
    
    buildZone: function(level, x, maxLength) {
        var t = (Math.random() * this.totalOdds) | 0, type = 0, i = 0;
        for (i = 0; i < this.odds.length; i++) {
            if (this.odds[i] <= t) {
                type = i;
            }
        }
        
        switch (type) {
            case Mario.Odds.straight:
                return this.buildStraight(level, x, maxLength, false);
            case Mario.Odds.hillStraight:
                return this.buildHillStraight(level, x, maxLength);
            case Mario.Odds.tubes:
                return this.buildTubes(level, x, maxLength);
            case Mario.Odds.jump:
                return this.buildJump(level, x, maxLength);
            case Mario.Odds.cannons:
                return this.buildCannons(level, x, maxLength);
        }
        return 0;
    },
    
    buildJump: function(level, xo, maxLength) {
        var js = ((Math.random() * 4) | 0) + 2, jl = ((Math.random() * 2) | 0) + 2, length = js * 2 + jl, x = 0, y = 0,
            hasStairs = ((Math.random() * 3) | 0) === 0, floor = this.height - 1 - ((Math.random() * 4) | 0);
        
        for (x = xo; x < xo + length; x++) {
            if (x < xo + js || x > xo + length - js - 1) {
                for (y = 0; y < this.height; y++) {
                    if (y >= floor) {
                        level.setBlock(x, y, 1 + 9 * 16);
                    } else if (hasStairs) {
                        if (x < xo + js) {
                            if (y >= floor - (x - xo) + 1) {
                                level.setBlock(x, y, 9);
                            }
                        } else {
                            if (y >= floor - ((xo + length) - x) + 2) {
                                level.setBlock(x, y, 9);
                            }
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    buildCannons: function(level, xo, maxLength) {
		alert("cannons");
        var length = ((Math.random() * 10) | 0) + 2, floor = this.height - 1 - (Math.random() * 4) | 0,
            xCannon = xo + 1 + (Math.random() * 4) | 0, x = 0, y = 0, cannonHeight = 0;
            
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            if (x > xCannon) {
                xCannon += 2 * (Math.random() * 4) | 0;
            }
            if (xCannon === xo + length - 1) {
                xCannon += 10;
            }
            cannonHeight = floor - ((Math.random() * 4) | 0) - 1;
            
            for (y = 0; y < this.height; y++) {
                if (y >= floor) {
                    level.setBlock(x, y, 1 + 9 * 16);
                } else {
                    if (x === xCannon && y >= cannonHeight) {
                        if (y === cannonHeight) {
                            level.setBlock(x, y, 14);
                        } else if (y === cannonHeight + 1) {
                            level.setBlock(x, y, 14 + 16);
                        } else {
                            level.setBlock(x, y, 14 + 2 * 16);
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    buildHillStraight: function(level, xo, maxLength) {
        var length = ((Math.random() * 10) | 0) + 10, floor = this.height - 1 - (Math.random() * 4) | 0,
            x = 0, y = 0, h = floor, keepGoing = true, l = 0, xxo = 0, occupied = [], xx = 0, yy = 0;
        
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            for (y = 0; y < this.height; y++) {
                if (y >= floor) {
                    level.setBlock(x, y, 1 + 9 * 16);
                }
            }
        }
        
        this.addEnemyLine(level, xo + 1, xo + length - 1, floor - 1);
        
        while (keepGoing) {
            h = h - 2 - (Math.random() * 3) | 0;
            if (h <= 0) {
                keepGoing = false;
            } else {
                l = ((Math.random() * 5) | 0) + 3;
                xxo = ((Math.random() * (length - l - 2)) | 0) + xo + 1;
                
                if (occupied[xxo - xo] || occupied[xxo - xo + l] || occupied[xxo - xo - 1] || occupied[xxo - xo + l + 1]) {
                    keepGoing = false;
                } else {
                    occupied[xxo - xo] = true;
                    occupied[xxo - xo + l] = true;
                    this.addEnemyLine(level, xxo, xxo + l, h - 1);
                    if (((Math.random() * 4) | 0) === 0) {
                        this.decorate(level, xxo - 1, xxo + l + 1, h);
                        keepGoing = false;
                    }
                    
                    for (x = xxo; x < xxo + l; x++) {
                        for (y = h; y < floor; y++) {
                            xx = 5;
                            yy = 9;
                            if (x === xxo) {
                                xx = 4;
                            }
                            if (x === xxo + l - 1) {
                                xx = 6;
                            }
                            if (y === h) {
                                yy = 8;
                            }
                            
                            if (level.getBlock(x, y) === 0) {
                                level.setBlock(x, y, xx + yy * 16);
                            } else {
                                if (level.getBlock(x, y) === (4 + 8 * 16)) {
                                    level.setBlock(x, y, 4 + 11 * 16);
                                }
                                if (level.getBlock(x, y) === (6 + 8 * 16)) {
                                    level.setBlock(x, y, 6 + 11 * 16);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    addEnemyLine: function(level, x0, x1, y) {
        var x = 0, type = 0;
        for (x = x0; x < x1; x++) {
            if (((Math.random() * 35) | 0) < this.difficulty + 1) {
                type = (Math.random() * 4) | 0;
                if (this.difficulty < 1) {
                    type = Mario.Enemy.goomba;
                } else if (this.difficulty < 3) {
                    type = (Math.random() * 3) | 0;
                }
                level.setSpriteTemplate(x, y, new Mario.SpriteTemplate(type, ((Math.random() * 35) | 0) < this.difficulty));
            }
        }
    },
    
    buildTubes: function(level, xo, maxLength) {
        var length = ((Math.random() * 10) | 0) + 5, floor = this.height - 1 - (Math.random() * 4) | 0,
            xTube = xo + 1 + (Math.random() * 4) | 0, tubeHeight = floor - ((Math.random() * 2) | 0) - 2,
            x = 0, y = 0, xPic = 0;
        
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            if (x > xTube + 1) {
                xTube += 3 + ((Math.random() * 4) | 0);
                tubeHeight = floor - ((Math.random() * 2) | 0) - 2;
            }
            if (xTube >= xo + length - 2) {
                xTube += 10;
            }
            
            if (x === xTube && ((Math.random() * 11) | 0) < this.difficulty + 1) {
                level.setSpriteTemplate(x, tubeHeight, new Mario.SpriteTemplate(Mario.Enemy.flower, false));
            }
            
            for (y = 0; y < this.height; y++) {
                if (y >= floor) {
                    level.setBlock(x, y, 1 + 9 * 16);
                } else {
                    if ((x === xTube || x === xTube + 1) && y >= tubeHeight) {
                        xPic = 10 + x - xTube;
                        if (y === tubeHeight) {
                            level.setBlock(x, y, xPic);
                        } else {
                            level.setBlock(x, y, xPic + 16);
                        }
                    }
                }
            }
        }
        
        return length;
    },
    
    buildStraight: function(level, xo, maxLength, safe) {
        var length = ((Math.random() * 10) | 0) + 2, floor = this.height - 1 - ((Math.random() * 4) | 0), x = 0, y = 0;
        
        if (safe) {
            length = 10 + ((Math.random() * 5) | 0);
        }
        if (length > maxLength) {
            length = maxLength;
        }
        
        for (x = xo; x < xo + length; x++) {
            for (y = 0; y < this.height; y++) {
                if (y >= floor) {
                    level.setBlock(x, y, 1 + 9 * 16);
                }
            }
        }
        
        if (!safe) {
            if (length > 5) {
                this.decorate(level, xo, xo + length, floor);
            }
        }
        
        return length;
    },
    
    decorate: function(level, x0, x1, floor) {
        if (floor < 1) {
            return;
        }
        
        var rocks = true, s = (Math.random() * 4) | 0, e = (Math.random() * 4) | 0, x = 0;
        
        this.addEnemyLine(level, x0 + 1, x1 - 1, floor - 1);
        
        if (floor - 2 > 0) {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 1) {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++) {
                    level.setBlock(x, floor - 2, 2 + 2 * 16);
                }
            }
        }
        
        s = (Math.random() * 4) | 0;
        e = (Math.random() * 4) | 0;
        
        if (floor - 4 > 0) {
            if ((x1 - 1 - e) - (x0 + 1 + s) > 2) {
                for (x = x0 + 1 + s; x < x1 - 1 - e; x++) {
                    if (rocks) {
                        if (x !== x0 + 1 && x !== x1 - 2 && ((Math.random() * 3) | 0) === 0) {
                            if (((Math.random() * 4) | 0) === 0) {
                                level.setBlock(x, floor - 4, 4 + 2 + 16);
                            } else {
                                level.setBlock(x, floor - 4, 4 + 1 + 16);
                            }
                        } else if (((Math.random() * 4) | 0) === 0) {
                            if (((Math.random() * 4) | 0) === 0) {
                                level.setBlock(x, floor - 4, 2 + 16);
                            } else {
                                level.setBlock(x, floor - 4, 1 + 16);
                            }
                        } else {
                            level.setBlock(x, floor - 4, 16);
                        }
                    }
                }
            }
        }
    },
    
    fixWalls: function(level) {
        var blockMap = [], x = 0, y = 0, xx = 0, yy = 0, blocks = 0;
        
        for (x = 0; x < this.width + 1; x++) {
            blockMap[x] = [];
        
            for (y = 0; y < this.height + 1; y++) {
                blocks = 0;
                for (xx = x - 1; xx < x + 1; xx++) {
                    for (yy = y - 1; yy < y + 1; yy++) {
                        if (level.getBlockCapped(xx, yy) === (1 + 9 * 16)) {
                            blocks++;
                        }
                    }
                }
                blockMap[x][y] = blocks === 4;
            }
        }
        
        this.blockify(level, blockMap, this.width + 1, this.height + 1);
    },
    
    blockify: function(level, blocks, width, height) {
        var to = 0, b = [], x = 0, y = 0, xx = 0, yy = 0, i = 0, _xx = 0, _yy = 0;
        
        for (i = 0; i < 2; i++) {
            b[i] = [];
        }
        
        if (this.type === Mario.LevelType.castle) {
            to = 8;
        } else if (this.type === Mario.LevelType.underground) {
            to = 12;
        }
        
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                for (xx = x; xx <= x + 1; xx++) {
                    for (yy = y; yy <= y + 1; yy++) {
                        _xx = xx;
                        _yy = yy;
                        if (_xx < 0) {
                            _xx = 0;
                        }
                        if (_yy < 0) {
                            _yy = 0;
                        }
                        if (_xx > width - 1) {
                            _xx = width - 1;
                        }
                        if (_yy > height - 1) {
                            _yy = height - 1;
                        }
                        
                        b[xx - x][yy - y] = blocks[_xx][_yy];
                    }
                }
                
                if (b[0][0] === b[1][0] && b[0][1] === b[1][1]) {
                    if (b[0][0] === b[0][1]) {
                        if (b[0][0]) {
                            level.setBlock(x, y, 1 + 9 * 16 + to);
                        }
                    } else {
                        if (b[0][0]) {
                            level.setBlock(x, y, 1 + 10 * 16 + to);
                        } else {
                            level.setBlock(x, y, 1 + 8 * 16 + to);
                        }
                    }
                } else if (b[0][0] === b[0][1] && b[1][0] === b[1][1]) {
                    if (b[0][0]) {
                        level.setBlock(x, y, 2 + 9 * 16 + to);
                    } else {
                        level.setBlock(x, y, 9 * 16 + to);
                    }
                } else if (b[0][0] === b[1][1] && b[0][1] === b[1][0]) {
                    level.setBlock(x, y, 1 + 9 * 16 + to);
                } else if (b[0][0] === b[1][0]) {
                    if (b[0][0]) {
                        if (b[0][1]) {
                            level.setBlock(x, y, 3 + 10 * 16 + to);
                        } else {
                            level.setBlock(x, y, 3 + 11 * 16 + to);
                        }
                    } else {
                        if (b[0][1]) {
                            level.setBlock(x, y, 2 + 8 * 16 + to);
                        } else {
                            level.setBlock(x, y, 8 * 16 + to);
                        }
                    }
                } else if (b[0][1] === b[1][1]) {
                    if (b[0][1]) {
                        if (b[0][0]) {
                            level.setBlock(x, y, 3 + 9 * 16 + to);
                        } else {
                            level.setBlock(x, y, 3 + 8 * 16 + to);
                        }
                    } else {
                        if (b[0][0]) {
                            level.setBlock(x, y, 2 + 10 * 16 + to);
                        } else {
                            level.setBlock(x, y, 10 * 16 + to);
                        }
                    }
                } else {
                    level.setBlock(x, y, 1 + 16 * to);
                }
            }
        }
    }
};