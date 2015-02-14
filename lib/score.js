/*jslint node:true*/
/*global window*/
module.exports = function () {
    'use strict';
    var ls = window.localStorage,
        score = 0,
        record = ls.getItem('record') || 0;
    this.inc = function () {
        score += 1;
        if (score > record) {
            record = score;
            ls.setItem('record', record);
        }
        document.title = 'Score: ' + score + ' Record: ' + record;
    };
    document.title = 'Score: ' + score + ' Record: ' + record;
};