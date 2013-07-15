/**
	Global representation of the mario character.
	Code by Rob Kleffner, 2011
*/

Mario.Character = function() {
    //these are static in Notch's code... here it doesn't seem necessary
    this.large = false;
    this.fire = false;
    this.coins = 0;
    this.lives = 3;
    this.levelString = "none";
    this.groundInertia = 0.89;
    this.airInertia = 0.89;
    
    //non static variables in Notch's code
    this.runTime = 0;
    this.wasOnGround = false;
    this.onGround = false;
    this.mayJump = false;
    this.ducking = false;
    this.sliding = false;
    this.jumpTime = 0;
    this.xJumpSpeed = 0;
    this.yJumpSpeed = 0;
    this.canShoot = false;
    
    this.width = 4;
    this.height = 24;
    
    //Level scene
    this.world = null;
    this.facing = 0;
    this.powerUpTime = 0;
    
    this.xDeathPos = 0; this.yDeathPos = 0;
    this.deathTime = 0;
    this.winTime = 0;
    this.invulnerableTime = 0;
    
    //Sprite
    this.carried = null;
    
    this.lastLarge = false;
    this.lastFire = false;
    this.newLarge = false;
    this.newFire = false;
};

Mario.Character.prototype = new Mario.NotchSprite(null);

Mario.Character.prototype.initialize = function(world) {
    this.world = world;
    this.x = 32;
    this.y = 0;
	this.powerUpTime = 0;
    
    //non static variables in Notch's code
    this.runTime = 0;
    this.wasOnGround = false;
    this.onGround = false;
    this.mayJump = false;
    this.ducking = false;
    this.sliding = false;
    this.jumpTime = 0;
    this.xJumpSpeed = 0;
    this.yJumpSpeed = 0;
    this.canShoot = false;
    
    this.width = 4;
    this.height = 24;
    
    //Level scene
    this.world = world;
    this.facing = 0;
    this.powerUpTime = 0;
    
    this.xDeathPos = 0; this.yDeathPos = 0;
    this.deathTime = 0;
    this.winTime = 0;
    this.invulnerableTime = 0;
    
    //Sprite
    this.carried = null;
    
    this.setLarge(this.large, this.fire);
};

Mario.Character.prototype.setLarge = function(large, fire) {
    if (fire) {
        large = true;
    }
    if (!large) {
        fire = false;
    }
    
    this.lastLarge = this.large;
    this.lastFire = this.fire;
    this.large = large;
    this.fire = fire;
    this.newLarge = this.large;
    this.newFire = this.fire;
    
    this.blink(true);
};

Mario.Character.prototype.blink = function(on) {
    this.large = on ? this.newLarge : this.lastLarge;
    this.fire = on ? this.newFire : this.lastFire;
    
    if (this.large) {
        if (this.fire) {
            this.image = Enjine.Resources.images["fireMario"];
        } else {
            this.image = Enjine.Resources.images["mario"];
        }
        
        this.xPicO = 16;
        this.yPicO = 31;
        this.picWidth = this.picHeight = 32;
    } else {
        this.image = Enjine.Resources.images["smallMario"];
        this.xPicO = 8;
        this.yPicO = 15;
        this.picWidth = this.picHeight = 16;
    }
};

Mario.Character.prototype.move = function() {
    if (this.winTime > 0) {
        this.winTime++;
        this.xa = 0;
        this.ya = 0;
        return;
    }
    
    if (this.deathTime > 0) {
        this.deathTime++;
        if (this.deathTime < 11) {
            this.xa = 0;
            this.ya = 0;
        } else if (this.deathTime === 11) {
            this.ya = -15;
        } else {
            this.ya += 2;
        }
        this.x += this.xa;
        this.y += this.ya;
        return;
    }
    
    if (this.powerUpTime !== 0) {
        if (this.powerUpTime > 0) {
            this.powerUpTime--;
            this.blink((((this.powerUpTime / 3) | 0) & 1) === 0);
        } else {
            this.powerUpTime++;
            this.blink((((-this.powerUpTime / 3) | 0) & 1) === 0);
        }
        
        if (this.powerUpTime === 0) {
            this.world.paused = false;
        }
        
        this.calcPic();
        return;
    }
    
    if (this.invulnerableTime > 0) {
        this.invulnerableTime--;
    }
    
    this.visible = (((this.invulnerableTime / 2) | 0) & 1) === 0;
    
    this.wasOnGround = this.onGround;
    var sideWaysSpeed = Enjine.Keyboard.isKeyDown(Enjine.Keys.a) ? 1.2 : 0.6;
    
    if (this.onGround) {
        if (Enjine.Keyboard.isKeyDown(Enjine.Keys.down) && this.large) {
            this.ducking = true;
        } else {
            this.ducking = false;
        }
    }
        
    if (this.xa > 2) {
        this.facing = 1;
    }
    if (this.xa < -2) {
        this.facing = -1;
    }
    
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.s) || (this.jumpTime < 0 && !this.onGround && !this.sliding)) {
        if (this.jumpTime < 0) {
            this.xa = this.xJumpSpeed;
            this.ya = -this.jumpTime * this.yJumpSpeed;
            this.jumpTime++;
        } else if (this.onGround && this.mayJump) {
            Enjine.Resources.playSound("jump");
            this.xJumpSpeed = 0;
            this.yJumpSpeed = -1.9;
            this.jumpTime = 7;
            this.ya = this.jumpTime * this.yJumpSpeed;
            this.onGround = false;
            this.sliding = false;
        } else if (this.sliding && this.mayJump) {
            Enjine.Resources.playSound("jump");
            this.xJumpSpeed = -this.facing * 6;
            this.yJumpSpeed = -2;
            this.jumpTime = -6;
            this.xa = this.xJumpSpeed;
            this.ya = -this.jumpTime * this.yJumpSpeed;
            this.onGround = false;
            this.sliding = false;
            this.facing = -this.facing;
        } else if (this.jumpTime > 0) {
            this.xa += this.xJumpSpeed;
            this.ya = this.jumpTime * this.yJumpSpeed;
            this.jumpTime--;
        }
    } else {
        this.jumpTime = 0;
    }
    
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.left) && !this.ducking) {
        if (this.facing === 1) {
            this.sliding = false;
        }
        this.xa -= sideWaysSpeed;
        if (this.jumpTime >= 0) {
            this.facing = -1;
        }
    }
    
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.right) && !this.ducking) {
        if (this.facing === -1) {
            this.sliding = false;
        }
        this.xa += sideWaysSpeed;
        if (this.jumpTime >= 0) {
            this.facing = 1;
        }
    }
    
    if ((!Enjine.Keyboard.isKeyDown(Enjine.Keys.left) && !Enjine.Keyboard.isKeyDown(Enjine.Keys.right)) || this.ducking || this.ya < 0 || this.onGround) {
        this.sliding = false;  
    }
    
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.a) && this.canShoot && this.fire && this.world.fireballsOnScreen < 2) {
        Enjine.Resources.playSound("fireball");
        this.world.addSprite(new Mario.Fireball(this.world, this.x + this.facing * 6, this.y - 20, this.facing));
    }
    
    this.canShoot = !Enjine.Keyboard.isKeyDown(Enjine.Keys.a);
    this.mayJump = (this.onGround || this.sliding) && !Enjine.Keyboard.isKeyDown(Enjine.Keys.s);
    this.xFlip = (this.facing === -1);
    this.runTime += Math.abs(this.xa) + 5;
    
    if (Math.abs(this.xa) < 0.5) {
        this.runTime = 0;
        this.xa = 0;
    }
    
    this.calcPic();
    
    if (this.sliding) {
        this.world.addSprite(new Mario.Sparkle(this.world, ((this.x + Math.random() * 4 - 2) | 0) + this.facing * 8,
            ((this.y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5));
        this.ya *= 0.5;
    }
    
    this.onGround = false;
    this.subMove(this.xa, 0);
    this.subMove(0, this.ya);
    if (this.y > this.world.level.height * 16 + 16) {
        this.die();
    }
    
    if (this.x < 0) {
        this.x = 0;
        this.xa = 0;
    }
    
    if (this.x > this.world.level.exitX * 16) {
        this.win();
    }
    
    if (this.x > this.world.level.width * 16) {
        this.x = this.world.level.width * 16;
        this.xa = 0;
    }
    
    this.ya *= 0.85;
    if (this.onGround) {
        this.xa *= this.groundInertia;
    } else {
        this.xa *= this.airInertia;
    }
    
    if (!this.onGround) {
        this.ya += 3;
    }
    
    if (this.carried !== null) {
        this.carried.x *= this.x + this.facing * 8;
        this.carried.y *= this.y - 2;
        if (!Enjine.Keyboard.isKeyDown(Enjine.Keys.a)) {
            this.carried.release(this);
            this.carried = null;
        }
    }
};

Mario.Character.prototype.calcPic = function() {
    var runFrame = 0, i = 0;
    
    if (this.large) {
        runFrame = ((this.runTime / 20) | 0) % 4;
        if (runFrame === 3) {
            runFrame = 1;
        }
        if (this.carried === null && Math.abs(this.xa) > 10) {
            runFrame += 3;
        }
        if (this.carried !== null) {
            runFrame += 10;
        }
        if (!this.onGround) {
            if (this.carried !== null) {
                runFrame = 12;
            } else if (Math.abs(this.xa) > 10) {
                runFrame = 7;
            } else {
                runFrame = 6;
            }
        }
    } else {
        runFrame = ((this.runTime / 20) | 0) % 2;
        if (this.carried === null && Math.abs(this.xa) > 10) {
            runFrame += 2;
        }
        if (this.carried !== null) {
            runFrame += 8;
        }
        if (!this.onGround) {
            if (this.carried !== null) {
                runFrame = 9;
            } else if (Math.abs(this.xa) > 10) {
                runFrame = 5;
            } else {
                runFrame = 4;
            }
        }
    }
    
    if (this.onGround && ((this.facing === -1 && this.xa > 0) || (this.facing === 1 && this.xa < 0))) {
        if (this.xa > 1 || this.xa < -1) {
            runFrame = this.large ? 9 : 7;
        }
        
        if (this.xa > 3 || this.xa < -3) {
            for (i = 0; i < 3; i++) {
                this.world.addSprite(new Mario.Sparkle(this.world, (this.x + Math.random() * 8 - 4) | 0, (this.y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
        }
    }
    
    if (this.large) {
        if (this.ducking) {
            runFrame = 14;
        }
        this.height = this.ducking ? 12 : 24;
    } else {
        this.height = 12;
    }
    
    this.xPic = runFrame;
};

Mario.Character.prototype.subMove = function(xa, ya) {
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
        this.sliding = true;
        if (this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya)) {
            collide = true;
        } else {
            this.sliding = false;
        }
        
        if (this.isBlocking(this.x + xa + this.width, this.y + ya - ((this.height / 2) | 0), xa, ya)) {
            collide = true;
        } else {
            this.sliding = false;
        }
        
        if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, ya)) {
            collide = true;
        } else {
            this.sliding = false;
        }
    }
    if (xa < 0) {
        this.sliding = true;
        if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya)) {
            collide = true;
        } else {
            this.sliding = false;
        }
        
        if (this.isBlocking(this.x + xa - this.width, this.y + ya - ((this.height / 2) | 0), xa, ya)) {
            collide = true;
        } else {
            this.sliding = false;
        }
        
        if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, ya)) {
            collide = true;
        } else {
            this.sliding = false;
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

Mario.Character.prototype.isBlocking = function(x, y, xa, ya) {
    var blocking = false, block = 0, xx = 0, yy = 0;
    
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    if (x === ((this.x / 16) | 0) && y === ((this.y / 16) | 0)) {
        return false;
    }
    
    block = this.world.level.getBlock(x, y);
    
    if (((Mario.Tile.behaviors[block & 0xff]) & Mario.Tile.pickUpable) > 0) {
        this.getCoin();
        Enjine.Resources.playSound("coin");
        this.world.level.setBlock(x, y, 0);
        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                this.world.addSprite(new Mario.Sparkle(this.world, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5));
            }
        }
    }
    
    blocking = this.world.level.isBlocking(x, y, xa, ya);
    if (blocking && ya < 0) {
        this.world.bump(x, y, this.large);
    }
    return blocking;
};

Mario.Character.prototype.stomp = function(object) {
    var targetY = 0;

    if (this.deathTime > 0 || this.world.paused) {
        return;
    }
    
    targetY = object.y - object.height / 2;
    this.subMove(0, targetY - this.y);
    
    if (object instanceof Mario.Enemy || object instanceof Mario.BulletBill) {
        
        Enjine.Resources.playSound("kick");
        this.xJumpSpeed = 0;
        this.yJumpSpeed = -1.9;
        this.jumpTime = 8;
        this.ya = this.jumpTime * this.yJumpSpeed;
        this.onGround = false;
        this.sliding = false;
        this.invulnerableTime = 1;
    } else if (object instanceof Mario.Shell) {
        if (Enjine.Keyboard.isKeyDown(Enjine.Keys.a) && object.facing === 0) {
            this.carried = object;
            object.carried = true;
        } else {
            Enjine.Resources.playSound("kick");
            this.xJumpSpeed = 0;
            this.yJumpSpeed = -1.9;
            this.jumpTime = 8;
            this.ya = this.jumpTime * this.yJumpSpeed;
            this.onGround = false;
            this.sliding = false;
            this.invulnerableTime = 1;
        }
    }
};

Mario.Character.prototype.getHurt = function() {
    if (this.deathTime > 0 || this.world.paused) {
        return;
    }
    if (this.invulnerableTime > 0) {
        return;
    }
    
    if (this.large) {
        this.world.paused = true;
        this.powerUpTime = -18;
        Enjine.Resources.playSound("powerdown");
        if (this.fire) {
            this.setLarge(true, false);
        } else {
            this.setLarge(false, false);
        }
        this.invulnerableTime = 32;
    } else {
        this.die();
    }
};

Mario.Character.prototype.win = function() {
    this.xDeathPos = this.x | 0;
    this.yDeathPos = this.y | 0;
    this.world.paused = true;
    this.winTime = 1;
    Enjine.Resources.playSound("exit");
};

Mario.Character.prototype.die = function() {
    this.xDeathPos = this.x | 0;
    this.yDeathPos = this.y | 0;
    this.world.paused = true;
    this.deathTime = 1;
    Enjine.Resources.playSound("death");
    this.setLarge(false, false);
};

Mario.Character.prototype.getFlower = function() {
    if (this.deathTime > 0 && this.world.paused) {
        return;
    }
    
    if (!this.fire) {
        this.world.paused = true;
        this.powerUpTime = 18;
        Enjine.Resources.playSound("powerup");
        this.setLarge(true, true);
    } else {
        this.getCoin();
        Enjine.Resources.playSound("coin");
    }
};

Mario.Character.prototype.getMushroom = function() {
    if (this.deathTime > 0 && this.world.paused) {
        return;
    }
    
    if (!this.large) {
        this.world.paused = true;
        this.powerUpTime = 18;
        Enjine.Resources.playSound("powerup");
        this.setLarge(true, false);
    } else {
        this.getCoin();
        Enjine.Resources.playSound("coin");
    }
};

Mario.Character.prototype.kick = function(shell) {
    if (this.deathTime > 0 && this.world.paused) {
        return;
    }
    
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.a)) {
        this.carried = shell;
        shell.carried = true;
    } else {
        Enjine.Resources.playSound("kick");
        this.invulnerableTime = 1;
    }
};

Mario.Character.prototype.get1Up = function() {
    Enjine.Resources.playSound("1up");
    this.lives++;
    if (this.lives === 99) {
        this.lives = 99;
    }
};

Mario.Character.prototype.getCoin = function() {
    this.coins++;
    if (this.coins === 100) {
        this.coins = 0;
        this.get1Up();
    }
};
