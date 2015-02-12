/*jslint node:true,nomen:true*/
var _ = require('underscore');

module.exports = function (opts) {
    'use strict';
    var
        parts = opts.parts,
        ex = opts.ex,
        game = opts.game,
        color = opts.color,
        w = game.width,
        h = game.height,
        size = opts.size,
        findX = function () {
            var x = size * _.random(2, Math.floor(w / size) - 2);
            return _.pluck(parts, 'x').indexOf(x) === -1 ? x : findX();
        },
        findY = function () {
            var y = size * _.random(2, Math.floor(h / size) - 2);
            return _.pluck(parts, 'y').indexOf(y) === -1 ? y : findY();
        },
        actor = new ex.Actor(findX(), findY(), size, size, color);
    this.eat = function () {
        actor.kill();
    };
    this.actor = actor;
    game.add(actor);
};
