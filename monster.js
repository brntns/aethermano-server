'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
//var start = process.hrtime();

exports.Monster = function(){
  this.monsters = [];
};
exports.Monster.prototype = {
	create: function (ret) {
		this.monsterData = {};
		console.log('Creating Monsters...');
		this.genUuid();
		this.monsterBio(ret);
    this.gen();
		console.log('Done Creating Monsters!');
	},
  spawn: function (data) {
		this.monsterData = {};
		console.log('Creating Monsters...');
		this.genUuid();
		this.monsterBio(data);
    this.gen();
		console.log('Done Creating Monsters!');
	},
  gen: function(){
	//	console.log(this.monsterData);
		this.monsters.push(this.monsterData);
  },
	monsterBio: function(data){
    if(data.x){
      var X = data.x;
      var Y = data.y;
    } else {
      var X = Math.floor(Math.random()*data*16);// 300;
      var Y = Math.floor(Math.random()*data*16);//300
    }
		this.monsterData.x = X;
    this.monsterData.y = Y;
    this.monsterData.velox = 0;
    this.monsterData.veloy = 0;
    this.monsterData.hp = 15;
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
