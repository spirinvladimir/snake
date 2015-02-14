/*jslint node:true,nomen:true*/
/*global window*/
module.exports = function (opts) {
    'use strict';
    var direction = opts.direction,
        self = this,
        handleOrientation = function (event) {
            var y = event.beta,
                x = event.gamma,
                maxX = 30,
                maxY = 20,
                d;
            if (y > maxY) {
                d = 'down';
            } else if (y < -maxY) {
                d = 'up';
            } else if (x > maxX) {
                d = 'right';
            } else if (x < -maxX) {
                d = 'left';
            }
            if (d !== direction) {
                d = direction;
                self.snake[d]();
            }
        };
    this.snake = opts.snake;
    window.removeEventListener('deviceorientation', handleOrientation);
    window.addEventListener('deviceorientation', handleOrientation);
};
