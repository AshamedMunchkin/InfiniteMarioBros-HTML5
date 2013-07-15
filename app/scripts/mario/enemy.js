/**
	A generic template for an enemy in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Enemy = function(world, x, y, dir, type, winged) {
    this.groundInertia = 0.89;
    this.airInertia = 0.89;
    this.runTime = 0;
    this.onGround = false;
    this.mayJump = false;
    this.jumpTime = 0;
    this.xJumpSpeed = 0;
    this.yJumpSpeed = 0;
    this.width = 4;
    this.height = 24;
    this.deadTime = 0;
    this.flyDeath = false;
    this.wingTime = 0;
    this.noFireballDeath = false;
    
    this.x = x;
    this.y = y;
    this.world = world;
    
    this.type = type;
    this.winged = winged;
    
    this.image = Enjine.Resources.images["enemies"];
    
    this.xPicO = 8;
    this.yPicO = 31;
    this.avoidCliffs = this.type === Mario.Enemy.redKoopa;
    this.noFireballDeath = this.type === Mario.Enemy.spiky;
    
    this.yPic = this.type;
    if (this.yPic > 1) {
        this.height = 12;
    }
    this.facing = dir;
    if (this.facing === 0) {
        this.facing = 1;
    }
    
    this.picWidth = 16;
};

Mario.Enemy.prototype = new Mario.NotchSprite();

Mario.Enemy.prototype.collideCheck = function() {
    if (this.deadTime !== 0) {
        return;
    }
    
    var xMarioD = Mario.MarioCharacter.x - this.x, yMarioD = Mario.MarioCharacter.y - this.y;
        
    if (xMarioD > -this.width * 2 - 4 && xMarioD < this.width * 2 + 4) {
        if (yMarioD > -this.height && yMarioD < Mario.MarioCharacter.height) {
            if (this.type !== Mario.Enemy.spiky && Mario.MarioCharacter.ya > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.onGround || !Mario.MarioCharacter.wasOnGround)) {
                Mario.MarioCharacter.stomp(this);
                if (this.winged) {
                    this.winged = false;
                    this.ya = 0;
                } else {
                    this.yPicO = 31 - (32 - 8);
                    this.picHeight = 8;
                    
                    if (this.spriteTemplate !== null) {
                        this.spriteTemplate.isDead = true;
                    }
                    
                    this.deadTime = 10;
                    this.winged = false;
                    
                    if (this.type === Mario.Enemy.redKoopa) {
                        this.world.addSprite(new Mario.Shell(this.world, this.x, this.y, 0));
                    } else if (this.type === Mario.Enemy.greenKoopa) {
                        this.world.addSprite(new Mario.Shell(this.world, this.x, this.y, 1));
                    }
                }
            } else {
                Mario.MarioCharacter.getHurt();
            }
        }
    }
};

Mario.Enemy.prototype.move = function() {
    var i = 0, sideWaysSpeed = 1.75, runFrame = 0;

    this.wingTime++;
    if (this.deadTime > 0) {
        this.deadTime--;
        
        if (this.deadTime === 0) {
            this.deadTime = 1;
            for (i = 0; i < 8; i++) {
                this.world.addSprite(new Mario.Sparkle(this.world, ((this.x + Math.random() * 16 - 8) | 0) + 4, ((this.y - Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.world.removeSprite(this);
        }
        
        if (this.flyDeath) {
            this.x += this.xa;
            this.y += this.ya;
            this.ya *= 0.95;
            this.ya += 1;
        }
        return;
    }
    
    if (this.xa > 2) {
        this.facing = 1;
    }
    if (this.xa < -2) {
        this.facing = -1;
    }
    
    this.xa = this.facing * sideWaysSpeed;
    
    this.mayJump = this.onGround;
    
    this.xFlip = this.facing === -1;
    
    this.runTime += Math.abs(this.xa) + 5;
    
    runFrame = ((this.runTime / 20) | 0) % 2;
    
    if (!this.onGround) {
        runFrame = 1;
    }
    
    if (!this.subMove(this.xa, 0)) {
        this.facing = -this.facing;
    }
    this.onGround = false;
    this.subMove(0, this.ya);
    
    this.ya *= this.winged ? 0.95 : 0.85;
    if (this.onGround) {
        this.xa *= this.groundInertia;
    } else {
        this.xa *= this.airInertia;
    }
    
    if (!this.onGround) {
        if (this.winged) {
            this.ya += 0.6;
        } else {
            this.ya += 2;
        }
    } else if (this.winged) {
        this.ya = -10;
    }
    
    if (this.winged) {
        runFrame = ((this.wingTime / 4) | 0) % 2;
    }
    
    this.xPic = runFrame;
};

Mario.Enemy.prototype.subMove = function(xa, ya) {
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
        if (this.isBlocking(this.x + xa + this.width, this.y + ya - ((this.height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, ya)) {
            collide = true;
        }
        
        if (this.avoidCliffs && this.onGround && !this.world.level.isBlocking(((this.x + this.xa + this.width) / 16) | 0, ((this.y / 16) + 1) | 0, this.xa, 1)) {
            collide = true;
        }
    }
    if (xa < 0) {
        if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya)) {
            collide = true;
        }
        if (this.isBlocking(this.x + xa - this.width, this.y + ya - ((this.height / 2) | 0), xa, ya)) {
            collide = true;
        }
        if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, ya)) {
            collide = true;
        }
        
        if (this.avoidCliffs && this.onGround && !this.world.level.isBlocking(((this.x + this.xa - this.width) / 16) | 0, ((this.y / 16) + 1) | 0, this.xa, 1)) {
            collide = true;
        }
    }
    
    if (collide) {
        if (xa < 0) {
            this.x = (((this.x - this.width) / 16) | 0) * 16 + this.width;
            this.xa = 0;
        }
        if (xa > 0) {
            this.x = (((this.x + this.width) / 16 + 1) | 0) * 16 - this.width - 1;
            this.xa = 0;
        }
        if (ya < 0) {
            this.y = (((this.y - this.height) / 16) | 0) * 16 + this.height;
            this.jumpTime = 0;
            this.ya = 0;
        }
        if (ya > 0) {
            this.y = (((this.y - 1) / 16 + 1) | 0) * 16 - 1;
            this.onGround = true;
        }
        
        return false;
    } else {
        this.x += xa;
        this.y += ya;
        return true;
    }
};

Mario.Enemy.prototype.isBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.x / 16) | 0 && y === (this.y / 16) | 0) {
        return false;
    }
    
    return this.world.level.isBlocking(x, y, xa, ya);
};

Mario.Enemy.prototype.shellCollideCheck = function(shell) {
    if (this.deadTime !== 0) {
        return false;
    }
    
    var xd = shell.x - this.x, yd = shell.y - this.y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.height && yd < shell.height) {
            Enjine.Resources.playSound("kick");
            
            this.xa = shell.facing * 2;
            this.ya = -5;
            this.flyDeath = true;
            if (this.spriteTemplate !== null) {
                this.spriteTemplate.isDead = true;
            }
            this.deadTime = 100;
            this.winged = false;
            this.yFlip = true;
            return true;
        }
    }
    return false;
};

Mario.Enemy.prototype.fireballCollideCheck = function(fireball) {
    if (this.deadTime !== 0) {
        return false;
    }
    
    var xd = fireball.x - this.x, yd = fireball.y - this.y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.height && yd < fireball.height) {
            if (this.noFireballDeath) {
                return true;
            }
        
            Enjine.Resources.playSound("kick");
            
            this.xa = fireball.facing * 2;
            this.ya = -5;
            this.flyDeath = true;
            if (this.spriteTemplate !== null) {
                this.spriteTemplate.isDead = true;
            }
            this.deadTime = 100;
            this.winged = false;
            this.yFlip = true;
            return true;
        }
    }
};

Mario.Enemy.prototype.bumpCheck = function(xTile, yTile) {
    if (this.deadTime !== 0) {
        return;
    }
    
    if (this.x + this.width > xTile * 16 && this.x - this.width < xTile * 16 + 16 && yTile === ((this.y - 1) / 16) | 0) {
        Enjine.Resources.playSound("kick");
        
        this.xa = -Mario.MarioCharacter.facing * 2;
        this.ya = -5;
        this.flyDeath = true;
        if (this.spriteTemplate !== null) {
            this.spriteTemplate.isDead = true;
        }
        this.deadTime = 100;
        this.winged = false;
        this.yFlip = true;
    }
};

Mario.Enemy.prototype.subDraw = Mario.NotchSprite.prototype.draw;

Mario.Enemy.prototype.draw = function(context, camera) {
    var xPixel = 0, yPixel = 0;
    
    if (this.winged) {
        xPixel = ((this.xOld + (this.x - this.xOld) * this.delta) | 0) - this.xPicO;
        yPixel = ((this.yOld + (this.y - this.yOld) * this.delta) | 0) - this.yPicO;
        
        if (this.type !== Mario.Enemy.redKoopa && this.type !== Mario.Enemy.greenKoopa) {
            this.xFlip = !this.xFlip;
            context.save();
            context.scale(this.xFlip ? -1 : 1, this.yFlip ? -1 : 1);
            context.translate(this.xFlip ? -320 : 0, this.yFlip ? -240 : 0);
            context.drawImage(this.image, (((this.wingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.xFlip ? (320 - xPixel - 24) : xPixel - 8, this.yFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
            this.xFlip = !this.xFlip;
        }
    }
    
    this.subDraw(context, camera);
    
    if (this.winged) {
        xPixel = ((this.xOld + (this.x - this.xOld) * this.delta) | 0) - this.xPicO;
        yPixel = ((this.yOld + (this.y - this.yOld) * this.delta) | 0) - this.yPicO;
        
        if (this.type === Mario.Enemy.redKoopa && this.type === Mario.Enemy.greenKoopa) {
            context.save();
            context.scale(this.xFlip ? -1 : 1, this.yFlip ? -1 : 1);
            context.translate(this.xFlip ? -320 : 0, this.yFlip ? -240 : 0);
            context.drawImage(this.image, (((this.wingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.xFlip ? (320 - xPixel - 24) : xPixel - 8, this.yFlip ? (240 - yPixel) : yPixel - 8, 16, 32);
            context.restore();
        } else {
            context.save();
            context.scale(this.xFlip ? -1 : 1, this.yFlip ? -1 : 1);
            context.translate(this.xFlip ? -320 : 0, this.yFlip ? -240 : 0);
            context.drawImage(this.image, (((this.wingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.xFlip ? (320 - xPixel - 24) : xPixel - 8, this.yFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
        }
    }
};

//Static variables
Mario.Enemy.redKoopa = 0;
Mario.Enemy.greenKoopa = 1;
Mario.Enemy.goomba = 2;
Mario.Enemy.spiky = 3;
Mario.Enemy.flower = 4;