'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var ret = 640;
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
        "x":0,
        "y":0
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
  };
  this.map = [];
  this.maps;
};
exports.Map.prototype = {
	create: function () {
		console.log('Creating New Map...');
    	this.generate(ret);
    	this.setMap();
		console.log('Done Creating Map!');
	},
  	clear: function() {
    	this.mapSize = null;
    	this.map = [];
  	},
  	randomTerrain: function (numb, pos_xMin, pos_xMax, pos_yMin, pos_yMax, size_xMin, size_xMax, size_yMin, size_yMax, colourMin, colourMax) {
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
  	portal: function(pos_xMin, pos_xMax, pos_yMin, pos_yMax, size_x, size_y, portalRadius) {
      console.log("generating portal. coordinates:");
    	var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
    	var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
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
    colouring: function (prob, pos_xMin, pos_xMax, pos_yMin, pos_yMax, colourMin, colourMax) {
      for (var x = pos_xMin; x < pos_xMax+1;x++){
        for (var y = pos_yMin; y < pos_yMax; y++){
          var randy = Math.random();
          if (this.map[x+y*ret] != 0 && randy < prob) {
            var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
            this.map[x+y*ret] = Colour;
          }
        }
      }
    },
  	generate: function (size) {
    	this.clear();
    	this.mapSize = size * size;
    //Clear Terrain
    	for (var y = 0; y < this.mapSize; y++) {
      		this.map[y] = 0;
    	}
    //Build Terrain
    	this.randomTerrain(100, 0, ret , 0 , ret, 3, 30, 1, 2, 17, 45);
    	this.randomTerrain(1000, 0, ret , 0 , ret, 3, 30, 3, 30, 0, 0);
    	this.randomTerrain(700, 0, ret , 0 , ret, 1, 10, 1, 1, 17, 45);
      this.colouring(0.3, 0, 150, 0, 150, 1, 4);
      this.colouring(0.6, 0, 100, 0, 100, 1, 4);
      this.colouring(1, 0, 50, 0, 50, 1, 4);
      this.colouring(0.3, 100, 350, 0, 150, 59, 63);
      this.colouring(0.6, 150, 300, 0, 100, 59, 63);
      this.colouring(1, 0, 200, 250, 50, 59, 63);
    	this.portal(0,ret-24 ,0,ret-24,24,24,8);
  	},
  	setMap: function(){
    	this.mapData.layers[0].data = this.map;
  	}
};
















