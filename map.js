'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var ret = 1600;
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
       "imageheight":64,
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
    "portalPosx":1,
    "portalPosy":1
  };
  this.map = [];
  this.maps = [];
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
	randomTerrain: function randomTerrain(numb, pos_xMin, pos_xMax, pos_yMin, pos_yMax, size_xMin, size_xMax, size_yMin, size_yMax, colourMin, colourMax) {
		var num = Math.floor(this.mapSize/numb);
  	for (var y = 0; y < num; y++) {
  		var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
  		var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
  		var Size_x = Math.floor(Math.random()*(size_xMax-size_xMin+1)+size_xMin);
  		var Size_y = Math.floor(Math.random()*(size_yMax-size_yMin+1)+size_yMin);
  		for (var z = 0; z < Size_x;z++){
  			for (var i = 0; i < Size_y; i++){
  				var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
  				this.map[Position_x+Position_y*ret+z+i*ret] = Colour;
  			}
  		}
  	}
	},
  makeTerrain: function makeTerrain(pos_x, pos_y, size_x, size_y, colourMin, colourMax) {
    for (var z = 0; z < size_x;z++){
      for (var i = 0; i < size_y; i++){
        var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
        this.map[pos_x+pos_y*ret+z+i*ret] = Colour;
      }
    }
  },  	
  portal: function portal(pos_xMin, pos_xMax, pos_yMin, pos_yMax, size_x, size_y, portalRadius) {
    console.log("generating portal. coordinates:");
  	var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
  	var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
    this.mapData.portalPosx = Position_x;
    this.mapData.portalPosy = Position_y;
    console.log(Position_x, Position_y);
  	for (var z = 0; z < size_x; z++){
  		for (var i = 0; i < size_y; i++){
  			if(Math.sqrt((z-size_x/2)*(z-size_x/2)+(i-size_y/2)*(i-size_y/2)) < portalRadius){
  				var portalColour = Math.floor(Math.random()*4+13);
  				this.map[Position_x+Position_y*ret+z+i*ret] = portalColour;
  			}
  			else {
  				this.map[Position_x+Position_y*ret+z+i*ret] = 0;
  			}
  		}
  	}
	},
  ring: function ring(pos_xMin, pos_xMax, pos_yMin, pos_yMax, minRadius, maxRadius, colourMin, colourMax) {
    var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
    var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
    for (var z = -maxRadius; z < maxRadius; z++){
      for (var i = -maxRadius; i < maxRadius; i++){
        var rad = Math.sqrt(z*z+i*i);
        if(rad > minRadius && rad <= maxRadius){
          var ringColour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
          if (this.map[Position_x+Position_y*ret+z+i*ret] != 0 && Position_x+z <= 639 && Position_y+z >= 0 && Position_y+i <= 639 && Position_y+i >= 0 ) {
            this.map[Position_x+Position_y*ret+z+i*ret] = ringColour;
          }
        }
      }
    }
  },
  colouring: function colouring(prob, pos_xMin, pos_xMax, pos_yMin, pos_yMax, colourMin, colourMax) {
    for (var x = pos_xMin; x < pos_xMax+1;x++) {
      for (var y = pos_yMin; y < pos_yMax; y++) {
        var randy = Math.random();
        if (this.map[x+y*ret] != 0 && randy < prob) {
          var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
          this.map[x+y*ret] = Colour;
        }
      }
    }
  },
	generate: function generate(size) {
  	this.clear();
  	this.mapSize = size * size;
  //Clear Terrain
  	for (var y = 0; y < this.mapSize; y++) {
    		this.map[y] = 0;
  	}
  //Build Terrain
  //Ground
    this.randomTerrain(500, 0, ret, 0, ret, 20, 30, 20, 30, 17, 45);
    this.randomTerrain(250, 0, ret, 0, ret, 2, 3, 7, 20, 0, 0);
    this.randomTerrain(250, 0, ret, 0, ret, 14, 32, 2, 3, 0, 0);
    this.randomTerrain(750, 0, ret, 0, ret, 24, 38, 4, 6, 0, 0);
    this.randomTerrain(50, 230, ret-230, 230, ret-230, 1, 1, 1, 1, 0, 0);
    this.makeTerrain(260, 260, ret-520, ret-520, 0, 0);
  // Center Part of the Map
  	this.randomTerrain(100,250, ret-250 ,250 , ret-250, 3, 30, 1, 2, 17, 45);
  	this.randomTerrain(1000,250, ret-250 ,250 , ret-250, 3, 30, 3, 30, 0, 0);
  	this.randomTerrain(700,250, ret-250 ,250 , ret-250, 1, 10, 1, 1, 17, 45);
    this.randomTerrain(2500,250, ret-250 ,250 , ret-250, 30, 50, 30, 50, 0, 0); //Large Voids
    this.randomTerrain(1000,250, ret-250 ,250 , ret-250, 1, 2, 1, 1, 17, 45);
  //Corner Colours
    this.colouring(0.3, 0, 250, 0, 250, 1, 4);
    this.colouring(0.6, 0, 175, 0, 175, 1, 4);
    this.colouring(1, 0, 100, 0, 100, 1, 4);
    this.colouring(0.3, ret-250, ret, 0, 250, 31, 34);
    this.colouring(0.6, ret-175, ret, 0, 175, 31, 34);
    this.colouring(1, ret-100, ret, 0, 100, 31, 34);
    this.colouring(0.3, ret-250, ret, ret-250, ret, 59, 63);
    this.colouring(0.6, ret-175, ret, ret-175, ret, 59, 63);
    this.colouring(1, ret-100, ret, ret-100, ret, 59, 63);
    this.colouring(0.3, 0, 250, ret-250, ret, 55, 59);
    this.colouring(0.6, 0, 175, ret-175, ret, 55, 59);
    this.colouring(1, 0, 100, ret-100, ret, 55, 59);
    //Testing Room lower left corner
    var testRoomSize = 40
    this.makeTerrain(0, ret-testRoomSize, testRoomSize, testRoomSize, 0, 0);
  //Portal Spawn
  	this.portal(0,ret-24 ,0,ret-24,24,24,8);
  /*Ring Colour Coding
    var ringMax = Math.max(this.mapData.portalPosx,this.mapData.portalPosy,ret-this.mapData.portalPosx,ret-this.mapData.portalPosy);
    var ringsteps = Math.floor((1.5*ringMax/20))+1;
    var ringstep = 20;
    for (var j = 0; j < ringsteps; j++) {
      this.ring(this.mapData.portalPosx+12,this.mapData.portalPosx+12,this.mapData.portalPosy+12,this.mapData.portalPosy+12,(12+j*ringstep),(12+(j+1)*ringstep),(j+13),(j+13));
    };*/
    this.setMap();
	},
	setMap: function(){
     this.mapData.layers[0].data = this.map;
     this.maps.push(this.mapData);
//      console.log(this.maps);
	}
};
