/**
	Represents a life-giving mushroom.
	Code by Rob Kleffner, 2011
*/

Mario.Mushroom = function(world, x, y) {
    this.runTime = 0;
    this.groundInertia = 0.89;
    this.airInertia = 0.89;
    this.onGround = false;
    this.width = 4;
    this.height = 24;
    this.world = world;
    this.x = x;
    this.y = y;
    this.image = Enjine.Resources.images["items"];
    this.xPicO = 8;
    this.yPicO = 15;
    this.yPic = 0;
    this.height = 12;
    this.facing = 1;
    this.picWidth = this.picHeight = 16;
    this.life = 0;
};

Mario.Mushroom.prototype = new Mario.NotchSprite();

Mario.Mushroom.prototype.collideCheck = function() {
    var xMarioD = Mario.MarioCharacter.x - this.x, yMarioD = Mario.MarioCharacter.y - this.y;
    if (xMarioD > -16 && xMarioD < 16) {
        if (yMarioD > -this.height && yMarioD < Mario.MarioCharacter.height) {
            Mario.MarioCharacter.getMushroom();
            this.world.removeSprite(this);
        }
    }
};

Mario.Mushroom.prototype.move = function() {
    if (this.life < 9) {
        this.layer = 0;
        this.y--;
        this.life++;
        return;
    }
    
    var sideWaysSpeed = 1.75;
    this.layer = 1;
    
    if (this.xa > 2) {
        this.facing = 1;
    }
    if (this.xa < -2) {
        this.facing = -1;
    }
    
    this.xa = this.facing * sideWaysSpeed;
    
    this.xFlip = this.facing === -1;
    this.runTime += Math.abs(this.xa) + 5;
    
    if (!this.subMove(this.xa, 0)) {
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

Mario.Mushroom.prototype.subMove = function(xa, ya) {
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

Mario.Mushroom.prototype.isBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.x / 16) | 0 && y === (this.y / 16) | 0) {
        return false;
    }
    
    return this.world.level.isBlocking(x, y, xa, ya);
};

Mario.Mushroom.prototype.bumpCheck = function(x, y) {
    if (this.x + this.width > x * 16 && this.x - this.width < x * 16 - 16 && y === ((y - 1) / 16) | 0) {
        this.facing = -Mario.MarioCharacter.facing;
        this.ya = -10;
    }
};