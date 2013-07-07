/**
	Renders a playable level.
	Code by Rob Kleffner, 2011
*/

Mario.LevelRenderer = function(level, width, height) {
    this.width = width;
    this.height = height;
    this.level = level;
    this.tilesY = ((height / 16) | 0) + 1;
    this.delta = 0;
    this.tick = 0;
    this.bounce = 0;
    this.animTime = 0;
    
    this.background = Mario.SpriteCuts.getLevelSheet();
};

Mario.LevelRenderer.prototype = new Enjine.Drawable();

Mario.LevelRenderer.prototype.update = function(delta) {
    this.animTime += delta;
    this.tick = this.animTime | 0;
    this.bounce += delta * 30;
    this.delta = delta;
};

Mario.LevelRenderer.prototype.draw = function(context, camera) {
    this.drawStatic(context, camera);
    this.drawDynamic(context, camera);
};

Mario.LevelRenderer.prototype.drawStatic = function(context, camera) {
    var x = 0, y = 0, b = 0, frame = null, xTileStart = (camera.x / 16) | 0, xTileEnd = ((camera.x + this.width) / 16) | 0;
    
    for (x = xTileStart; x < xTileEnd + 1; x++) {
        for (y = 0; y < this.tilesY; y++) {
            b = this.level.getBlock(x, y) & 0xff;
            if ((Mario.Tile.behaviors[b] & Mario.Tile.animated) === 0) {
                frame = this.background[b % 16][(b / 16) | 0];
                context.drawImage(Enjine.Resources.images["map"], frame.x, frame.y, frame.width, frame.height, ((x << 4) - camera.x) | 0, (y << 4) | 0, frame.width, frame.height);
            }
        }
    }
};

Mario.LevelRenderer.prototype.drawDynamic = function(context, camera) {
    var x = 0, y = 0, b = 0, animTime = 0, yo = 0, frame = null;
    for (x = (camera.x / 16) | 0; x <= ((camera.x + this.width) / 16) | 0; x++) {
        for (y = (camera.y / 16) | 0; y <= ((camera.y + this.height) / 16) | 0; y++) {
            b = this.level.getBlock(x, y);
            
            if (((Mario.Tile.behaviors[b & 0xff]) & Mario.Tile.animated) > 0) {
                animTime = ((this.bounce / 3) | 0) % 4;
                if ((((b % 16) / 4) | 0) === 0 && ((b / 16) | 0) === 1) {
                    animTime = ((this.bounce / 2 + (x + y) / 8) | 0) % 20;
                    if (animTime > 3) {
                        animTime = 0;
                    }
                }
                if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                    animTime = 2;
                }
                yo = 0;
                if (x >= 0 && y >= 0 && x < this.level.width && y < this.level.height) {
                    yo = this.level.data[x][y];
                }
                if (yo > 0) {
                    yo = (Math.sin((yo - this.delta) / 4 * Math.PI) * 8) | 0;
                }
                frame = this.background[(((b % 16) / 4) | 0) * 4 + animTime][(b / 16) | 0];
                context.drawImage(Enjine.Resources.images["map"], frame.x, frame.y, frame.width, frame.height, (x << 4) - camera.x, (y << 4) - camera.y - yo, frame.width, frame.height);
            }
        }
    }
};

Mario.LevelRenderer.prototype.drawExit0 = function(context, camera, bar) {
    var y = 0, yh = 0, frame = null;
    for (y = this.level.exitY - 8; y < this.level.exitY; y++) {
        frame = this.background[12][y === this.level.exitY - 8 ? 4 : 5];
        context.drawImage(Enjine.Resources.images["map"], frame.x, frame.y, frame.width, frame.height, (this.level.exitX << 4) - camera.x - 16, (y << 4) - camera.y, frame.width, frame.height);
    }
    
    if (bar) {
        yh = this.level.exitY * 16 - (3 * 16) - (Math.sin(this.animTime) * 3 * 16) - 8;// - ((Math.sin(((this.bounce + this.delta) / 20) * 0.5 + 0.5) * 7 * 16) | 0) - 8;
        frame = this.background[12][3];
        context.drawImage(Enjine.Resources.images["map"], frame.x, frame.y, frame.width, frame.height, (this.level.exitX << 4) - camera.x - 16, yh - camera.y, frame.width, frame.height);
        frame = this.background[13][3];
        context.drawImage(Enjine.Resources.images["map"], frame.x, frame.y, frame.width, frame.height, (this.level.exitX << 4) - camera.x, yh - camera.y, frame.width, frame.height);
    }
};

Mario.LevelRenderer.prototype.drawExit1 = function(context, camera) {
    var y = 0, frame = null;
    for (y = this.level.exitY - 8; y < this.level.exitY; y++) {
        frame = this.background[13][y === this.level.exitY - 8 ? 4 : 5];
        context.drawImage(Enjine.Resources.images["map"], frame.x, frame.y, frame.width, frame.height, (this.level.exitX << 4) - camera.x + 16, (y << 4) - camera.y, frame.width, frame.height);
    }
};