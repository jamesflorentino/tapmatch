(function() {
  'use strict';

  function Card(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y);
    this.color = key;
    this.back = game.make.sprite(0,0,'empty');
    this.front = game.make.sprite(0,0,key);
    this.anchor.set(0.5);
    this.front.anchor.set(0.5);
    this.back.anchor.set(0.5);
    this.addChild(this.back);
    this.addChild(this.front);
    this.showBack();
  }

  Card.prototype = Object.create(Phaser.Sprite.prototype);
  Card.prototype.constructor = Card;

  Card.prototype.showFront = function() {
    if (this.front.visible) {
      return;
    }
    this.front.visible = true;
    this.back.visible = false;
    this.front.scale.x = 0;
    this.front.scale.y = 0;
    this.tween = this.game.add.tween(this.front.scale)
      .to({x: 1.25, y: 1.25}, 120, Phaser.Easing.Quadratic.InOut)
      .to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out);

    this.tween.start();
  };

  Card.prototype.showBack = function() {
    this.front.visible = false;
    this.back.visible = true;
  };

  Card.prototype.flip = function() {
    this.back.visible = !this.back.visible;
    this.front.visible = !this.front.visible;
  };

  Card.prototype.kill = function() {
    var card = this;
    this.front.scale.set(1);
    this.back.visible = false;
    this.game.add.tween(this.front.scale)
      .to({ x: 1.52, y: 1.52}, 500, Phaser.Easing.Quadratic.Out, true);
    this.game.add.tween(this.front)
      .to({ alpha: 0 }, 500, null, true)
      .onComplete.add(function() {
        Phaser.Sprite.prototype.kill.apply(card, arguments);
      });
  };

  Card.prototype.debug = function() {
    this.showFront();
  };
  

  window['tapmatch'] = window['tapmatch'] || {};
  window['tapmatch'].Card = Card;
}());
