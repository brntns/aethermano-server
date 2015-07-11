'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();

exports.Monster = function(){

	this.monsterData = {
		"id":0,
		"spawn":{}
  };
  this.monsters = [];
};
exports.Monster.prototype = {
	create: function () {
		console.log('Creating Monsters...');
		this.genUuid();
		this.spawnPoint();
    this.gen();
		console.log('Done Creating Monsters!');
	},
  gen: function(){
		this.monsters.push(this.monsterData);
  },
	spawnPoint: function(){
			var ret = 400; // TODO: pipe from map.js
			var X = Math.floor(Math.random()*ret*16);
			var Y = Math.floor(Math.random()*ret*16);
			var spawnPointer = {x:X,y:Y};
			this.monsterData.spawn = spawnPointer;
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
