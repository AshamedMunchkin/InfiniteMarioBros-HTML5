/**
    State shown when the player loses!
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require, exports) {
    'use strict';

    var AnimatedSprite = require('enjine/animatedsprite');
    var Camera = require('enjine/camera');
    var DrawableManager = require('enjine/drawablemanager');
    var GameState = require('enjine/gamestate');
    var Keyboard = require('enjine/keyboard');
    var Keys = require('enjine/keys');
    var Resources = require('enjine/resources');

    var SpriteCuts = require('mario/spritecuts');
    var TitleState = require('mario/titlestate');

    var LoseState = function() {
        this.drawManager = null;
        this.camera = null;
        this.gameOver = null;
        this.font = null;
        this.wasKeyDown = false;
    };

    LoseState.prototype = new GameState();

    LoseState.prototype.enter = function() {
        this.drawManager = new DrawableManager();
        this.camera = new Camera();

        this.gameOver = new AnimatedSprite();
        this.gameOver.image = Resources.images.gameOverGhost;
        this.gameOver.setColumnCount(9);
        this.gameOver.setRowCount(1);
        this.gameOver.addNewSequence('turnLoop', 0, 0, 0, 8);
        this.gameOver.playSequence('turnLoop', true);
        this.gameOver.framesPerSecond = 1/15;
        this.gameOver.x = 112;
        this.gameOver.y = 68;
        this.gameOver.xPivot = 0;
        this.gameOver.yPivot = 0;

        this.font = SpriteCuts.createBlackFont();
        this.font.strings[0] = { string: 'Game over!', x: 116, y: 160 };

        this.drawManager.add(this.font);
        this.drawManager.add(this.gameOver);
    };

    LoseState.prototype.exit = function() {
        this.drawManager.clear();
        delete this.drawManager;
        delete this.camera;
        delete this.gameOver;
        delete this.font;
    };

    LoseState.prototype.update = function(delta) {
        this.drawManager.update(delta);
        if (Keyboard.isKeyDown(Keys.s)) {
            this.wasKeyDown = true;
        }
    };

    LoseState.prototype.draw = function(context) {
        this.drawManager.draw(context, this.camera);
    };

    LoseState.prototype.checkForChange = function(context) {
        if (this.wasKeyDown && !Keyboard.isKeyDown(Keys.s)) {
            context.changeState(new TitleState.TitleState());
        }
    };

    exports.LoseState = LoseState;
});
