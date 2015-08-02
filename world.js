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
			id:'',
			map: [],
			locations:[],
			spawnpoints:[]
		};
		//level 1
		map.generate(300, 100,'level');
		mapWrap.map.push(map.mapData);
		this.maps.push(mapWrap);
		map.clear();
		//room 1
		map.generate(50, 30,'room');
		mapWrap.map.push(map.mapData);
		this.maps.push(mapWrap);
			map.clear();
	}
};
