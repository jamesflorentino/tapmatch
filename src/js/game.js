(function() {
  'use strict'; 
  function Game() {}

  Game.prototype = {
    create: function () {

      this.level = 0;
      this.columns = 1;
      this.rows = 1;
      this.selected = [];
      this.completed = [];
      this.cards = this.add.group();
      this.life = 10;
      this.maxLife = 10;

      this.lifeBg = this.add.sprite(0, 0, 'life-bg');
      this.lifePane = this.add.sprite(0, 0, 'life-pane');

      this.gameover = this.add.sprite(0, 0, 'gameover');
      this.gameover.visible = false;
      this.gameover.anchor.set(0.5);

      this.levelcomplete = this.add.sprite(0, 0, 'level-complete');
      this.levelcomplete.visible = false;
      this.levelcomplete.anchor.set(0.5);
      this.levelcomplete.inputEnabled = true;
      this.levelcomplete.events.onInputDown.add(this.initLevel, this);

      this.btnRetry = this.add.sprite(0, 0, 'btn-retry');
      this.btnRetry.visible = false;
      this.btnRetry.anchor.set(0.5);
      this.btnRetry.inputEnabled = true;
      this.btnRetry.events.onInputDown.add(this.restartGame, this);
      this.initLevel();
    },

    initLevel: function() {
      this.completed = [];
      this.selected = [];
      this.mapping = [
        'orange',
        'violet',
        'blue',
        'red',
        'yellow',
        'green',
      ];
      this.level++;
      if (this.level < 10) {
        if (this.level % 2) {
          this.columns++;
        } else {
          this.rows++;
        }
      }

      if (this.rows * this.columns % 2) {
        this.rows++;
      }

      var game = this;
      var columns = this.columns || 2;
      var rows = this.rows || 2;

      this.cards.removeAll();
      var list = this.generateMatrix(columns, rows, this.mapping);
      var tileSize = 64;
      var tileMargin = 15;
      var tileSpace = tileSize + tileMargin;
      var tableWidth = tileSpace * columns;
      var tableHeight = tileSpace * rows;
      tableWidth -= tileMargin;
      tableHeight -= tileMargin;

      var scale = 1;
      var border = { width: this.game.width, height: this.game.height - this.lifeBg.height};
      var isWider = border.width < tableWidth;
      var isTaller = border.height < tableHeight;
      if (isWider || isTaller) {
        var scaleX = border.width / (tableWidth + tileMargin * 2);
        var scaleY = border.height / (tableHeight + tileMargin * 2);
        if (tableWidth - border.width > tableHeight - border.height) {
          console.log('wider');
          scale = scaleX;
        } else {
          console.log('taller');
          scale = scaleY;
        }
        tableWidth *= scale;
        tableHeight *= scale;
        this.cards.scale.set(scale);
      }

      this.cards.x = border.width * 0.5 - tableWidth * 0.5;
      this.cards.y = border.height * 0.5 - tableHeight * 0.5;
      this.cards.y += this.lifeBg.height;

      var _count = 0;
      for(var y=0; y<rows; y++) {
        for(var x=0; x<columns; x++) {
          var id = list[_count];
          var color = this.mapping[id];
          var card = new window.tapmatch.Card(
            game,
            x * tileSpace + tileSize * 0.5,
            y * tileSpace + tileSize * 0.5,
            color
          );
          card.inputEnabled = true;
          card.events.onInputDown.add(this.onCardTouch, this);
          //card.debug();
          //card.scale.set(scale);
          this.add.tween(card.scale)
            .from({ x: 0, y: 0 }, 450, Phaser.Easing.Exponential.Out, true, (x+y) * 50);
          this.cards.addChild(card);
          _count++;
        }
      }

      this.gameover.visible =
      this.levelcomplete.visible =
      this.btnRetry.visible = false;
    },

    generateMatrix: function(columns, rows, mapping) {
      var list = [];

      var _count = 0;
      while(list.length < columns * rows) {
        var id = _count;
        list.push(id);
        list.push(id);
        _count++;
        if (_count >= mapping.length) {
          _count = 0;
        }
      }

      Phaser.ArrayUtils.shuffle(list);
      return list;
    },

    onCardTouch: function(card) {
      //if (this) {
      //  return this.initLevel();
      //}
      var game = this;
      card.showFront();
      if (this.selected.indexOf(card) === -1) {
        this.selected.push(card);
      }
      if (this.selected.length === 2) {
        if (this.selected[0].color === this.selected[1].color) {
          this.selected.forEach(function(s) {
            s.kill();
            game.completed.push(s);
            //s.alpha = 0.5;
            //s.inputEnabled = false;
          });
          this.selected = [];
          this.increaseLife();
          this.checkResult();
        } else {
          this.reduceLife();
        }
      }
      if (this.selected.length > 2){
        this.selected.pop();
        this.selected.forEach(function(s) {
          s.showBack();
        });
        this.selected = [card];
      }
    },

    reduceLife: function() {
      this.life--;
      this.life = Math.max(0, this.life);
      this.add.tween(this.lifePane.scale)
        .to({ x: this.life /this.maxLife }, 500, Phaser.Easing.Quadratic.Out, true);
      if (!this.life) {
        return this.showGameOver();
      }
    },

    increaseLife: function() {
      this.life++;
      this.life = Math.min(this.maxLife, this.life);
      this.add.tween(this.lifePane.scale)
        .to({ x: this.life /this.maxLife }, 500, Phaser.Easing.Quadratic.Out, true);
    },

    checkResult: function() {
      var isCompleted = this.completed.length === this.cards.children.length;
      if (isCompleted) {
        //this.showGameOver();
        this.showLevelComplete();
      }
    },

    showLevelComplete: function() {
      var levelcomplete = this.levelcomplete;
      levelcomplete.x = this.world.width * 0.5;
      levelcomplete.y = this.world.height * 0.5;
      levelcomplete.alpha = 0;
      levelcomplete.scale.set(10);
      this.add.tween(levelcomplete.scale)
        .to({ x: 1, y: 1 }, 1000, Phaser.Easing.Bounce.Out, true, 1000);
      this.add.tween(levelcomplete)
        .to({ alpha: 1 }, 500, Phaser.Easing.Bounce.Out, true, 1000);
      levelcomplete.visible = true;
    },

    restartGame: function() {
      this.life = this.maxLife;
      this.level = 0;
      this.rows = 1;
      this.columns = 1;
      this.initLevel();
    },

    showGameOver: function() {
      var gameover = this.gameover;
      var btnRetry = this.btnRetry;
      gameover.x = btnRetry.x = this.world.width * 0.5;
      gameover.y = btnRetry.y = 150;
      btnRetry.y += 100;
      gameover.alpha = 0;
      gameover.scale.set(10);
      this.add.tween(gameover.scale)
        .to({ x: 1, y: 1 }, 1000, Phaser.Easing.Bounce.Out, true, 1000);
      this.add.tween(gameover)
        .to({ alpha: 1 }, 500, Phaser.Easing.Bounce.Out, true, 1000);
      this.add.tween(btnRetry)
        .from({ y: btnRetry.y + 200, alpha: 0 }, 1000, Phaser.Easing.Cubic.Out, true, 1250);
      gameover.visible = true;
      btnRetry.visible = true;
    },

    onInputDown: function () {
      //this.game.state.start('menu');
    }
  };

  window['tapmatch'] = window['tapmatch'] || {};
  window['tapmatch'].Game = Game;
}());
