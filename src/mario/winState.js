/**
    State that's shown when the player wins the game!
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require) {
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

    var WinState = function() {
        this.waitTime = 2;
        this.drawManager = null;
        this.camera = null;
        this.font = null;
        this.kissing = null;
        this.wasKeyDown = false;
    };

    WinState.prototype = new GameState();

    WinState.prototype.enter = function() {
        this.drawManager = new DrawableManager();
        this.camera = new Camera();

        this.font = SpriteCuts.createBlackFont();
        this.font.strings[0] = { string: 'Thank you for saving me, Mario!', x: 36, y: 160 };

        this.kissing = new AnimatedSprite();
        this.kissing.image = Resources.images.endScene;
        this.kissing.x = 112;
        this.kissing.y = 52;
        this.kissing.setColumnCount(2);
        this.kissing.setRowCount(1);
        this.kissing.addNewSequence('loop', 0, 0, 0, 1);
        this.kissing.playSequence('loop', true);
        this.kissing.framesPerSecond = 1/2;
        this.kissing.xPivot = 0;
        this.kissing.yPivot = 0;

        this.waitTime = 2;

        this.drawManager.add(this.font);
        this.drawManager.add(this.kissing);
    };

    WinState.prototype.exit = function() {
        this.drawManager.clear();
        delete this.drawManager;
        delete this.camera;
    };

    WinState.prototype.update = function(delta) {
        this.drawManager.update(delta);

        if (this.waitTime > 0) {
            this.waitTime -= delta;
        } else {
            if (Keyboard.isKeyDown(Keys.s)) {
                this.wasKeyDown = true;
            }
        }
    };

    WinState.prototype.draw = function(context) {
        this.drawManager.draw(context, this.camera);
    };

    WinState.prototype.checkForChange = function(context) {
        if (this.waitTime <= 0) {
            if (this.wasKeyDown && !Keyboard.isKeyDown(Keys.s)) {
                context.changeState(new TitleState());
            }
        }
    };

    return WinState;
});