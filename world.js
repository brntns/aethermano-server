'use strict';
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var gameMap = require('./map.js');
var gameItems = require('./items.js')
var map = new gameMap.Map();
var items = new gameItems.Items();

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
		var X = map.rooms[0].x;
		var Y = map.rooms[0].y + map.rooms[0].height - 4;
		// console.log(Y);
		// console.log(X);
		items.createItem(X,Y,'door');
		// push and clear
		mapWrap.locations.push(items.itemData);
		this.maps.push(mapWrap);
		map.clear();
		//room 1
		map.generate(50, 30,'room');
		mapWrap.map.push(map.mapData);
		this.maps.push(mapWrap);
		map.clear();
		console.log(map.rooms);
	}
};
