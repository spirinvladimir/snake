/*jslint node:true*/
/*global window*/
var domready = require('domready'),
    ex = require('./lib/excalibur'),
    Snake = require('./lib/snake');

domready(function () {
    'use strict';
    var game = new ex.Engine(),
        snake = new Snake({
            ex: ex,
            game: game,
            color: {
                head: ex.Color.Red,
                body: ex.Color.Yellow,
                food: ex.Color.Green
            }
        }),
        replay = function () {
            game.rootScene.children.forEach(function (actor) {
                actor.kill();
            });
            setTimeout(function () {
                snake = new Snake({
                    ex: ex,
                    game: game,
                    color: {
                        head: ex.Color.Red,
                        body: ex.Color.Yellow,
                        food: ex.Color.Green
                    }
                });
                snake.onLose = replay;
                snake.run({x: 1});
            }, 500);
        },
        paused = false;
    game.input.keyboard.on('down', function (k) {
        k = k.key;
        if (k === 37) {
            snake.left();
        } else if (k === 38) {
            snake.up();
        } else if (k === 39) {
            snake.right();
        } else if (k === 40) {
            snake.down();
        } else if (k === 32) {
            if (paused) {
                game.start();
                paused = false;
            } else {
                game.stop();
                paused = true;
            }
        }
    });
    document.addEventListener('click', function () {
        replay();
    });
    game.start();
    snake.onLose = replay;
    snake.run({x: 1});
});
