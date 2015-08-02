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
		var mapWrap = {
			map: [],
			locations:[]
		};

		map.generate(300, 100,'level');
	//	map.generate(43, 32,'room');
	//	map.create();
	//	console.log(map.maps);
		mapWrap.map.push(map.mapData);
		this.maps.push(mapWrap);
	}
};
