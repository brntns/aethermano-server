'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var mapWidth = 300;
var mapHeight = 100;
exports.Map = function(){

	this.mapData = {
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
    "width":16,
    "portalPosX":1,
    "portalPosY":1
  };
  this.mapWidth = mapWidth;
  this.mapHeight = mapHeight;
  this.map = [];
  this.maps = [];
  this.shafts = [];
	this.locationSprites = [];
  this.locations = [];
  this.mapFeatures = [];
};
exports.Map.prototype = {
  create: function create() {
    console.log('Creating New Map...');
    this.generate(mapWidth, mapHeight);
      //this.setMap();
    console.log('Done Creating Map!' + JSON.stringify(this.maps.length));
  },
  clear: function clear() {
    this.mapSize = null;
    this.map = [];
    this.locationSprites = [];
    this.locations = [];
    this.mapFeatures = [];
  },
  makeTerrain: function makeTerrain(x, y, width, height, color) {
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
      this.makeTerrain(X,Y,Width,Height,0);
      boundLeft = x+i*Math.floor(width/shaftStarts.length);
      boundRight = x+(i+1)*Math.floor(width/shaftStarts.length);
      shaft = {
        "x":X,
        "y":Y,
        "width":Width,
        "height": Height,
        "boundLeft": boundLeft,
        "boundRight": boundRight
      };
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
          this.makeTerrain(X,Y,Width,Height,0);
          connector = {
            "x":X,
            "y":Y,
            "width":Width,
            "height": Height
          };
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
    if (this.shafts.length > 1) {
      for (var i = 0; i < this.shafts.length; i++) {
        branches = [];
        var branchStartsLeft = this.randomSpacing(this.shafts[i].height, 30, 15, 3, 6);
        for (var j = 0; j < branchStartsLeft.length; j++) {
          X = this.Random(this.shafts[i].boundLeft + 5, this.shafts[i].x - 5);
          Y = branchStartsLeft[j];
          Width = this.shafts[i].x - X;
          branch = {
            "x":X,
            "y":Y,
            "width":Width,
            "height": Height
          };
          branches.push(branch);
          this.mapFeatures.push(branch);
          //console.log("pushed branch left");
        }
        var branchStartsRight = this.randomSpacing(this.shafts[i].height, 40, 20, 3, 6);
        for (var j = 0; j < branchStartsRight.length; j++) {
          X = this.shafts[i].x + this.shafts[i].width;
          Y = branchStartsRight[j];
          Width = this.Random(5, this.shafts[i].boundRight - X);
          branch = {
            "x":X,
            "y":Y,
            "width":Width,
            "height": Height
          };
          branches.push(branch);
          this.mapFeatures.push(branch);
          //console.log("pushed branch right");
        }
        //console.log(branches);
        for (var j = 0; j < branches.length; j++) {
          this.makeTerrain(branches[j].x, branches[j].y, branches[j].width, branches[j].height, 0);
        }
      }
    }
  },
  Bedrock: function Bedrock(x, y, width, height) {
    this.makeTerrain(x, y, width, height, 134);
    this.mainShafts(x, y, width, height);
    console.log(this.shafts);
    this.connectShafts(x, y, width, height);
    //console.log(this.shafts);
    this.branchShafts(x, y, width, height);
  },
  generate: function generate(mapWidth, mapHeight) {
    this.mapSize = mapWidth * mapHeight;
    //Clear Terrain
    this.clear();
    for (var i = 0; i < this.mapSize; i++) {
      this.map[i] = 0;
    }
    this.setMap();
    this.Bedrock(0, 0, mapWidth, mapHeight);
  },
  setMap: function(){
    this.mapData.layers[0].data = this.map;
    this.maps.push(this.mapData);
    this.locationSprites.push(this.locations);
    //console.log(this.locationSprites);
    //console.log(this.maps);
  }
};










