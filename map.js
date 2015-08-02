'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
exports.Map = function(){
	this.mapData = {};
  this.map = [];
  this.maps = [];
  this.shafts = [];
	this.locationSprites = [];
  this.locations = [];
  this.mapFeatures = [];
};
exports.Map.prototype = {
    //console.log('Creating New Map...');
    //console.log('Done Creating Map!' + JSON.stringify(this.maps.length));
  clear: function clear() {
		this.mapData = {};
    this.mapSize = 0;
    this.map = [];
    this.locationSprites = [];
    this.locations = [];
    this.mapFeatures = [];
  },
  createRoom: function createRoom(x, y, width, height, color) {
    for (var z = 0; z < width; z++){
      for (var i = 0; i < height; i++){
        this.map[x+y*width+z+i*width] = color;
      }
    }
  },
  makeFeature: function makeFeature(x, y, width, height, boundLeft, boundRight, boundTop, boundBottom, color, type, subtype) {
    var feature = {};
    feature = {
      "x": x,
      "y": y,
      "width": width,
      "height": height,
      "boundLeft": boundLeft,
      "boundRight": boundRight,
      "boundTop": boundTop,
      "boundBottom": boundBottom,
      "color": color,
      "type": type,
      "subtype": subtype
    };
    return feature;
  },
	makeTerrain: function makeTerrain(x, y, width, height, mapWidth, mapHeight, color) {
		for (var z = 0; z < width; z++){
			for (var i = 0; i < height; i++){
				this.map[x+y*mapWidth+z+i*mapWidth] = color;
			}
		}
	},
  Random: function Random(rndMin, rndMax) {
    if (rndMin < rndMax) {
      var x = Math.floor(Math.random()*(rndMax-rndMin+1)+rndMin);
      return x;
    } else {
      return rndMin;
    }
  },
  randomSpacing: function randomSpacing(value, coeff1, coeff2, buffer1, buffer2) {
    var Val = 0;
    var Values = [];
    var n = 0;
    if (value < coeff1 || value < coeff2) {
      n = 1;
    } else {
      n = this.Random(Math.floor(value/coeff1)+1,Math.floor(value/coeff2));
    }
    for (var i = 0; i < n; i++) {
      Val = this.Random(i*Math.floor(value/n)+buffer1,(i+1)*Math.floor(value/n)-buffer2);
      Values[i] = Val;
    }
    return Values;
  },
  intersect: function intersect(a, b) {
    if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) {
      return false;
    }
    return !(a.x + a.width < b.x || a.y + a.height < b.y || a.x > b.x + b.width || a.y > b.y + b.height);
  },
  intersectAll: function intersectAll(object, group) {
    for (var i = 0; i < group.length; i++) {
      if (this.intersect(object, group[i])) {
        return true;
      }
    }
    return false;
  },
  inMapBounds: function inMapBounds (object, mapWidth, mapHeight) {
    if (object.x < 0 || object.x + object.width > mapWidth || object.y < 0 || object.y + object.height > mapHeight) {
      return false;
    }
    return true;
  },
  mainShafts: function mainShafts(x, y, width, height) {
    var X = 0;
    var Y = 0;
    var Width = 8;
    var Height = 0;
    var boundLeft = 0;
    var boundRight = 0;
    var shaft = {};
    var shaftStarts = this.randomSpacing(width,125,75,10,15);
    for (var i = 0; i < shaftStarts.length; i++) {
      X = shaftStarts[i];
      Height = this.Random(Math.floor(height/1.5),height-10);
      boundLeft = x+i*Math.floor(width/shaftStarts.length);
      boundRight = x+(i+1)*Math.floor(width/shaftStarts.length);
      shaft = this.makeFeature(X, Y, Width, Height, boundLeft, boundRight, 0, 0, 0, 1, 0);
      this.shafts.push(shaft);
      this.mapFeatures.push(shaft);
    }
  },
  connectShafts: function connectShafts(x, y, width, height) {
    var X = 0;
    var Y = 0;
    var Width = 0;
    var Height = 4;
    var connector = {};
    if (this.shafts.length > 1) {
      for (var i = 0; i < this.shafts.length-1; i++) {
        var boundary1 = Math.max(this.shafts[i].y,this.shafts[i+1].y,10);
        var boundary2 = Math.min(this.shafts[i].y + this.shafts[i].height - 10, this.shafts[i+1].y + this.shafts[i+1].height - 10);
        var connectorStarts = this.randomSpacing(boundary2-boundary1, 50, 30, 5, 9);
        for (var j = 0; j < connectorStarts.length; j++) {
          X = this.shafts[i].x + this.shafts[i].width;
          Y = connectorStarts[j];
          Width = this.shafts[i+1].x - this.shafts[i].x - this.shafts[i].width;
          connector = this.makeFeature(X, Y, Width, Height, 0, 0, 0, 0, 0, 2, 0);
          this.mapFeatures.push(connector);
        }
      }
    }
  },
  branchShafts: function branchShafts(x, y, width, height) {
    var n = 0;
    var X = 0;
    var Y = 0;
    var Width = 0;
    var Height = 3;
    var branch = {};
    var branches = [];
    var room = {};
    var rooms = [];
    var sizeX = 0;
    var sizeY = 0;
    if (this.shafts.length > 1) {
      for (var i = 0; i < this.shafts.length; i++) {
        branches = [];
        var branchStarts = this.randomSpacing(this.shafts[i].height, 10, 5, 3, 6);
        for (var j = 0; j < branchStarts.length; j++) {
          branch = this.makeBranch(this.shafts[i], branchStarts[j], X, Y, Width, Height, 0);
          sizeX = this.Random(8,30);
          sizeY = this.Random(7,25);
          room = this.makeRoom(branch, sizeX, sizeY, 5);
          var testBranch = this.makeFeature(X, Y, Width-1, Height, 0, 0, 0, 0, 0, 3, 0);
          if (!this.intersectAll(testBranch, this.mapFeatures)
          && !this.intersectAll(room, this.mapFeatures)
          && this.inMapBounds(branch)
          && this.inMapBounds(room)) {
            branches.push(branch);
            rooms.push(room);
            this.mapFeatures.push(branch);
            this.mapFeatures.push(room);
          }
        }
        var branchStarts = this.randomSpacing(this.shafts[i].height, 10, 5, 3, 6);
        for (var j = 0; j < branchStarts.length; j++) {
          branch = this.makeBranch(this.shafts[i], branchStarts[j], X, Y, Width, Height, 1);
          sizeX = this.Random(8,30);
          sizeY = this.Random(7,25);
          room = this.makeRoom(branch, sizeX, sizeY, 5);
          var testBranch = this.makeFeature(X+1, Y - 1, Width, Height + 2, 0, 0, 0, 0, 0, 3, 1);
          var testRoom = this.makeFeature(X, Y, Width, Height, 0, 0, 0, 0, 0, 4, 0)
          if (!this.intersectAll(testBranch, this.mapFeatures)
          && !this.intersectAll(room, this.mapFeatures)
          && this.inMapBounds(branch)
          && this.inMapBounds(room)) {
            branches.push(branch);
            rooms.push(room);
            this.mapFeatures.push(branch);
            this.mapFeatures.push(room);
          }
        }
      }
    }
    console.log(rooms);
  },
  makeBranch: function makeBranch(shafts, branchStarts, X, Y, Width, Height, orientation) {
    if (orientation === 0) {
      X = this.Random(shafts.boundLeft + 5, shafts.x - 5);
      Width = shafts.x - X;
    } else {
      X = shafts.x + shafts.width;
      Width = this.Random(5, shafts.boundRight - X);
    }
    Y = branchStarts;
    return this.makeFeature(X, Y, Width, Height, 0, 0, 0, 0, 0, 3, orientation);
  },
  makeRoom: function makeRoom(object, sizeX, sizeY, offset) {
    if (object.subtype === 0) {
      var X = object.x - sizeX;
    } else {
      var X = object.x + object.width;
    }
    var Y = this.Random(object.y - sizeY + object.height, object.y - sizeY + object.height + offset);
    var Width = sizeX;
    var Height = sizeY;
    return this.makeFeature(X, Y, Width, Height, 0, 0, 0, 0, 0, 4, 0);
  },
  writeToMap: function writeToMap(array, mapWidth, mapHeight) {
    for (var j = 0; j < array.length; j++) {
      this.makeTerrain(array[j].x, array[j].y, array[j].width, array[j].height, mapWidth, mapHeight, array[j].color);
    }
  },
  Bedrock: function Bedrock(x, y, width, height, mapWidth, mapHeight) {
    this.makeTerrain(x, y, width, height, mapWidth, mapHeight, 134);
    this.mainShafts(x, y, width, height);
    this.connectShafts(x, y, width, height);
    this.branchShafts(x, y, width, height);
    this.writeToMap(this.mapFeatures);
  },
  generate: function generate(mapWidth, mapHeight, type) {
    this.mapSize = mapWidth * mapHeight;
    //Clear Terrain
    //this.clear();
    for (var i = 0; i < this.mapSize; i++) {
      this.map[i] = 0;
    }
		if (type === 'room') {
			this.setMap(mapWidth, mapHeight, this.maps.length + 1, 'room');
			this.createRoom(0, 0,  mapWidth , mapHeight / 2 -5, 134)
			this.createRoom(0, mapHeight / 2 +3 ,  mapWidth , mapHeight / 2 , 134)
		} else {
	    this.setMap(mapWidth, mapHeight,this.maps.length + 1,'level');
	    this.Bedrock(0, 0, mapWidth, mapHeight, mapWidth, mapHeight);
		}
  },
  setMap: function(mapWidth, mapHeight, id, type){
		this.mapData = {
			"id": id,
			"type":type,
			"height":16,
			"layers":[{
				"data":[],
				"height":mapHeight,
				"name":"Tile Layer 1",
				"opacity":1,
				"type":"tilelayer",
				"visible":true,
				"width":mapWidth,
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
			"width":16
		};
    this.mapData.layers[0].data = this.map;
    this.maps.push(this.mapData);
    this.locationSprites.push(this.locations);
    //console.log(this.locationSprites);
    //console.log(this.maps);
  }
};
