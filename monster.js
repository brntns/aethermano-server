'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();

exports.Monster = function(){

	this.monsterData = {
		"id":0,
    "width":16,
		"spawn":{}
  };
  this.monsters = [];
};
exports.Monster.prototype = {
	create: function (mapSize) {
		console.log('Creating Monsters...');
		this.genUuid();
		this.spawnPoint(mapSize);
    this.gen();
		console.log('Done Creating Monsters!');
	},
  gen: function(){
		this.monsters.push(this.monsterData);
  },
	spawnPoint: function(mapSize){
			var X = Math.floor(Math.random()*mapSize*16);
			var Y = Math.floor(Math.random()*mapSize*16);
			var spawnPointeru = {x:X,y:Y};
			this.monsterData.spawn = spawnPointeru;
	},
	genUuid: function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
  	this.monsterData.id = uuid;
	}
};
