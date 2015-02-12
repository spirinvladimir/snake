/*jslint node:true,nomen:true*/
var _ = require('lodash');

module.exports = function (opts) {
    'use strict';
    var
        parts = opts.parts,
        randPart = parts[_.random(0, parts.length - 1)],
        x = randPart.x,
        y = randPart.y,
        ex = opts.ex,
        game = opts.game,
        color = opts.color,
        w = game.width,
        h = game.height,
        size = opts.size,
        findX = function () {
            var r;
            if (w - x > 2 * size) {
                r = x + size * _.random(1, Math.floor((w - x) / size - 1));
            } else if (x > size) {
                r = size * _.random(0, Math.floor((x - size) / size));
            }
            return _.pluck(parts, 'x').indexOf(r) === -1 ? r : findX();
        },
        findY = function () {
            var r;
            if (h - y > 2 * size) {
                r = y + size * _.random(1, Math.floor((h - y) / size - 1));
            } else if (y > size) {
                r = size * _.random(0, Math.floor((y - size) / size));
            }
            return _.pluck(parts, 'y').indexOf(r) === -1 ? r : findY();
        },
        actor = new ex.Actor(findX(), findY(), size, size, color);
    this.eat = function () {
        actor.kill();
    };
    this.actor = actor;
    game.add(actor);
};
