/**
    Displays the title screen and menu.
    Code by Rob Kleffner, 2011
*/
/* global define */

define(function(require, exports) {
    'use strict';

    var Camera = require('enjine/camera');
    var DrawableManager = require('enjine/drawablemanager');
    var GameState = require('enjine/gamestate');
    var Keyboard = require('enjine/keyboard');
    var Keys = require('enjine/keys');
    var Resources = require('enjine/resources');
    var Sprite = require('enjine/sprite');

    var BackgroundGenerator = require('mario/backgroundgenerator');
    var BackgroundRenderer = require('mario/backgroundrenderer');
    var Character = require('mario/character');
    var LevelType = require('mario/leveltype');
    var MapState = require('mario/mapstate');
    var Mario = require('mario/mario');
    var SpriteCuts = require('mario/spritecuts');

    var TitleState = function() {
        this.drawManager = null;
        this.camera = null;
        this.logoY = null;
        this.bounce = null;
        this.font = null;
    };

    TitleState.prototype = new GameState();

    TitleState.prototype.enter = function() {
        this.drawManager = new DrawableManager();
        this.camera = new Camera();

        var bgGenerator = new BackgroundGenerator(2048, 15, true, LevelType.overground);
        var bgLayer0 = new BackgroundRenderer(bgGenerator.createLevel(), 320, 240, 2);
        bgGenerator.setValues(2048, 15, false, LevelType.overground);
        var bgLayer1 = new BackgroundRenderer(bgGenerator.createLevel(), 320, 240, 1);

        this.title = new Sprite();
        this.title.image = Resources.images.title;
        this.title.x = 0;
        this.title.y = 120;

        this.logo = new Sprite();
        this.logo.image = Resources.images.logo;
        this.logo.x = 0;
        this.logo.y = 0;

        this.font = SpriteCuts.createRedFont();
        this.font.strings[0] = { string: 'Press S to Start', x: 96, y: 120 };

        this.logoY = 20;

        this.drawManager.add(bgLayer0);
        this.drawManager.add(bgLayer1);

        this.bounce = 0;

        Mario.globalMapState = new MapState.MapState();
        //set up the global main character variable
        Mario.marioCharacter = new Character();
        Mario.marioCharacter.image = Resources.images.smallMario;

        //Mario.PlayTitleMusic();
    };

    TitleState.prototype.exit = function() {
        //Mario.StopMusic();

        this.drawManager.clear();
        delete this.drawManager;
        delete this.camera;
        delete this.font;
    };

    TitleState.prototype.update = function(delta) {
        this.bounce += delta * 2;
        this.logoY = 20 + Math.sin(this.bounce) * 10;

        this.camera.x += delta * 25;

        this.drawManager.update(delta);
    };

    TitleState.prototype.draw = function(context) {
        this.drawManager.draw(context, this.camera);

        context.drawImage(Resources.images.title, 0, 120);
        context.drawImage(Resources.images.logo, 0, this.logoY);

        this.font.draw(context, this.camera);
    };

    TitleState.prototype.checkForChange = function(context) {
        if (Keyboard.isKeyDown(Keys.s)) {
            context.changeState(Mario.globalMapState);
        }
    };

    exports.TitleState = TitleState;
});