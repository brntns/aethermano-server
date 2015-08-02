'use strict';
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var gameMap = require('./map.js');
var map = new gameMap.Map();

exports.World = function(){
	this.maps = [];

};
exports.World.prototype = {
	create: function () {
		map.generate(43, 32,'level');
	//	map.create();
	//	console.log(map.maps);
		this.maps.push(map.maps);
	}
};
