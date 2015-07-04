'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();

exports.Monster = function(){

	this.monsterData = {
	    "width":16,
	    "data":[]
  };
  this.monsters = [];
};
exports.Monster.prototype = {
	create: function () {
		console.log('Creating Monsters...');
    this.gen();
		console.log('Done Creating Monsters!');
	},
  gen: function(){
    var uglymonster = {
      "name":"Boba",
      "boss": true
    };

    this.monsterData.data.push(uglymonster);
		this.monsters.push(this.monsterData);
  }
};
