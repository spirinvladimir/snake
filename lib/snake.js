/*jslint node:true,nomen:true*/
var Food = require('./food'),
    _ = require('underscore');

module.exports = function (opts) {
    'use strict';
    var
        self = this,
        v = {},
        running = false,
        speed = 150,
        game = opts.game,
        size = Math.floor(Math.min(game.width, game.height) / 22),
        ex = opts.ex,
        color = opts.color,
        part = function (x, y, color) {
            var actor = new ex.Actor(x, y, size, size, color);
            game.add(actor);
            return actor;
        },
        startPlaceRandX = _.random(2, Math.floor(game.width / size) - 2),
        startPlaceRandY = _.random(2, Math.floor(game.height / size) - 2),
        parts = [
            part((startPlaceRandX + 1) * size, startPlaceRandY * size, color.body),
            part(startPlaceRandX * size, startPlaceRandY * size, color.body)
        ],
        food = new Food({
            ex: ex,
            game: game,
            color: color.food,
            parts: parts,
            size: size
        }),
        cutTail = function () {
            var last = parts.pop(),
                prelast = parts[parts.length - 1];
            last.moveTo(
                prelast.x,
                prelast.y,
                2 * speed
            );
            return last;
        },
        addNeck = function (time) {
            var firstPart = parts[0],
                x = firstPart.x,
                y =  firstPart.y,
                newPart = part(x, y, color.body);
            parts.unshift(newPart);
            newPart.moveTo(
                x + v.x * size,
                y + v.y * size,
                speed
            );
            newPart.on('exitviewport', function () {
                self.onLose();
            });
            return newPart;
        },
        hiTail = function (actor) {
            var i;
            for (i = 2; i < parts.length - 2; i += 1) {
                if (parts[i] && actor.within(parts[i], size / 2)) {
                    return true;
                }
            }
        },
        step = function () {
            addNeck().callMethod(function () {
                if (this.within(food.actor, size / 2)) {
                    speed += 50;
                    food.eat();
                    food = new Food({
                        ex: ex,
                        game: game,
                        color: color.food,
                        parts: parts,
                        size: size
                    });
                    step();
                } else if (hiTail(this)) {
                    self.onLose();
                } else {
                    cutTail().callMethod(function () {
                        this.kill();
                        document.title = 'Score: ' + (parts.length - 2);
                        step();
                    });
                }
            });
        };
    this.right = function () {
        v.x = 1;
        v.y = 0;
    };
    this.left = function () {
        v.x = -1;
        v.y = 0;
    };
    this.up = function () {
        v.x = 0;
        v.y = -1;
    };
    this.down = function () {
        v.x = 0;
        v.y = 1;
    };
    this.run = function (obj) {
        v.x = obj.x || 0;
        v.y = obj.y || 0;
        step();
    };
};
