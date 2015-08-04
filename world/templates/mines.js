'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var Monster = require('./decorator/monster.js');
var Items = require('./decorator/items.js');
var monster = new Monster.Monster();
var items = new Items.Items();

exports.Mines = function(){

};
exports.Mines.prototype = {

};
