'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var ret = 600;
exports.Map = function(){

	this.mapData = {
    "height":16,
    "layers":[{
      "data":[],
      "height":ret,
      "name":"Tile Layer 1",
      "opacity":1,
      "type":"tilelayer",
      "visible":true,
      "width":ret,
      "x":2,
      "y":2
    }],
    "orientation":"orthogonal",
    "properties":{},
    "tileheight":16,
    "tilesets":[{
      "firstgid":1,
      "image":"tiles-1.png",
      "imageheight":128,
      "imagewidth":272,
      "margin":0,
      "name":"tiles-1",
      "properties":{},
      "spacing":0,
      "tileheight":16,
      "tilewidth":16
    }],
    "tilewidth":16,
    "version":1,
    "width":16,
    "portalPosX":1,
    "portalPosY":1
  };
  this.ret = ret;
  this.map = [];
  this.maps = [];
  this.shafts = [];
	this.locationSprites= [];
};
exports.Map.prototype = {
  create: function create() {
    console.log('Creating New Map...');
    this.generate(ret);
      //this.setMap();
    console.log('Done Creating Map!' + JSON.stringify(this.maps.length));
  },
  clear: function clear() {
    this.mapSize = null;
    this.map = [];
  },
  makeTerrain: function makeTerrain(x, y, width, height, color) {
    for (var z = 0; z < width; z++){
      for (var i = 0; i < height; i++){
        this.map[x+y*ret+z+i*ret] = color;
      }
    }
  },
  Random: function Random(rndMin, rndMax) {
    var x = Math.floor(Math.random()*(rndMax-rndMin+1)+rndMin);
    return x;
  },
  mainShafts: function mainShafts(x, y, width, height) {
    var n = 0;
    var X = 0;
    var Y = 0;
    var Width = 5;
    var Height = 0;
    var boundLeft = 0;
    var boundRight = 0;
    var shaft = {};
    var shafts = [];
    if (width < 100) {
      n = 1;
    } else {
      n = Random(Math.floor(width/150)+1,Math.floor(width/75));
    }
    for var i = 0; i < n; i++) {
      X = Random(x+i*Math.floor(width/n)+10,x+(i+1)*Math.floor(width/n)-15);
      Height = Random(Math.floor(height/1.5),height-10);
      this.makeTerrain(X,Y,Width,Height);
      boundLeft = x+i*Math.floor(width/n);
      boundRight = x+(i+1)*Math.floor(width/n);
      shaft = {
        "x":X,
        "y":Y,
        "width":Width,
        "height": Height,
        "boundLeft": boundLeft,
        "boundRight": boundRight
      };
      shafts.push(shaft);
    }
    return shaft;
  },
  connectShafts: function connectShafts(x, y, width, height) {
    var 
    if (this.shafts.length > 1) {
      for (var i = 0; i < this.shafts.length; i++) {

      }
    }
  },
  branchShafts: function branchShafts(x, y, width, height) {

  },
  Bedrock: function Bedrock(x, y, width, height) {
    this.makeTerrain(x, y, width, height, 1);
    this.mainShafts(x, y, width, height);
    this.connectShafts(x, y, width, height);
    this.branchShafts(x, y, width, height);
  },
  generate: function generate(size) {
    this.clear();
    this.mapSize = size * size;
    //Clear Terrain
    for (var y = 0; y < this.mapSize; y++) {
      this.map[y] = 0;
      this.locationSprites = [];
    }
    this.setMap();
  },
  setMap: function(){
    this.mapData.layers[0].data = this.map;
    this.maps.push(this.mapData);
    console.log(this.locationSprites);
    //console.log(this.maps);
  }
};










