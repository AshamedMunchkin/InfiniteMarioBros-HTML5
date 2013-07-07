/**
	Notch made his own sprite class for this game. Rather than hack around my own,
    I directly ported his to JavaScript and used that where needed.
	Code by Rob Kleffner, 2011
*/

Mario.NotchSprite = function(image) {
    this.xOld = 0; this.yOld = 0;
    this.x = 0; this.y = 0;
    this.xa = 0; this.ya = 0;
    this.xPic = 0; this.yPic = 0;
    this.xPicO = 0; this.yPicO = 0;
    this.picWidth = 32; this.picHeight = 32;
    this.xFlip = false; this.yFlip = false;
    this.visible = true;
    this.image = image;
    this.delta = 0;
    this.spriteTemplate = null;
    this.layer = 1;
};

Mario.NotchSprite.prototype = new Enjine.Drawable();

Mario.NotchSprite.prototype.draw = function(context, camera) {
    var xPixel = 0, yPixel = 0;
    if (!this.visible) {
        return;
    }
    
    xPixel = ((this.xOld + (this.x - this.xOld) * this.delta) | 0) - this.xPicO;
    yPixel = ((this.yOld + (this.y - this.yOld) * this.delta) | 0) - this.yPicO;
    
    context.save();
    context.scale(this.xFlip ? -1 : 1, this.yFlip ? -1 : 1);
    context.translate(this.xFlip ? -320 : 0, this.yFlip ? -240 : 0);
    context.drawImage(this.image, this.xPic * this.picWidth, this.yPic * this.picHeight, this.picWidth, this.picHeight,
        this.xFlip ? (320 - xPixel - this.picWidth) : xPixel, this.yFlip ? (240 - yPixel - this.picHeight) : yPixel, this.picWidth, this.picHeight);
    context.restore();
};

Mario.NotchSprite.prototype.update = function(delta) {
    this.xOld = this.x;
    this.yOld = this.y;
    this.move();
    this.delta = delta;
};

Mario.NotchSprite.prototype.updateNoMove = function(delta) {
    this.xOld = this.x;
    this.yOld = this.y;
    this.delta = 0;
};

Mario.NotchSprite.prototype.move = function() {
    this.x += this.xa;
    this.y += this.ya;
};

Mario.NotchSprite.prototype.getX = function(delta) {
    return ((this.xOld + (this.x - this.xOld) * delta) | 0) - this.xPicO;
};

Mario.NotchSprite.prototype.getY = function(delta) {
    return ((this.yOld + (this.y - this.yOld) * delta) | 0) - this.yPicO;
};

Mario.NotchSprite.prototype.collideCheck = function() { };

Mario.NotchSprite.prototype.bumpCheck = function(xTile, yTile) { };

Mario.NotchSprite.prototype.release = function(mario) { };

Mario.NotchSprite.prototype.shellCollideCheck = function(shell) {
    return false;
};

Mario.NotchSprite.prototype.fireballCollideCheck = function(fireball) {
    return false;
};