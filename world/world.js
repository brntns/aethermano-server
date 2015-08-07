'use strict';
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var gameMaps = require('./maps.js');
var maps = new gameMaps.Map();


exports.World = function(){
	this.maps = [];

};
exports.World.prototype = {
	create: function () {

		this.build(0,'level',1000,300);
		/*this.build(1,'room',50,30);
		this.build(2,'room',50,30);
		this.build(3,'room',50,30);
		this.build(4,'room',50,30);
		this.build(5,'level',300,100);
		this.build(6,'level',300,100);
		console.log(this.maps); */

	},
	build: function build(id,type,width,height){
		var mapWrap = {
			id:id,
			map: [],
			locations:[],
			spawnpoints:[]
		};
		//level
		maps.generate(width,height,type);
		//door
		/*console.log(map.rooms[id]);
		if(type === 'level'){
			var doorX = map.rooms[id].x;
			var doorY = map.rooms[id].y + map.rooms[id].height - 4;
		} else {
			var doorX = Math.floor(width / 2);
			var doorY = Math.floor(height / 2);
		}
		items.createItem(doorX,doorY,'door',id + 1); */
		// push and clear
		mapWrap.map.push(maps.mapData);
	//	mapWrap.locations.push(items.itemData);
		this.maps.push(mapWrap);
		maps.clear();
		//items.clear();
	}
};
