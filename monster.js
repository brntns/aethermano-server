'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
//var start = process.hrtime();

exports.Monster = function(){
  this.monsters = [];
};
exports.Monster.prototype = {
	create: function () {
		this.monsterData = {};
		console.log('Creating Monsters...');
		this.genUuid();
		this.spawnPoint();
    this.gen();
		console.log('Done Creating Monsters!');
	},
  gen: function(){
	//	console.log(this.monsterData);
		this.monsters.push(this.monsterData);
  },
	spawnPoint: function(){
			var ret = 400; // TODO: pipe from map.js
			var X =  300;//Math.floor(Math.random()*ret*16);
			var Y = 300;//Math.floor(Math.random()*ret*16);
  		this.monsterData.x = X;
      this.monsterData.y = Y;
      this.monsterData.velox = 0;
      this.monsterData.veloy = 0;
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
