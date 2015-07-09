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
		var TSize = (pos_xMax - pos_xMin)*(pos_yMax - pos_yMin);
    var num = Math.floor(TSize/numb);
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
  circle: function circle(numb, pos_xMin, pos_xMax, pos_yMin, pos_yMax, circleRadiusMin, circleRadiusMax, colourMin, colourMax) {
    var TSize = (pos_xMax - pos_xMin)*(pos_yMax - pos_yMin);
    var num = Math.floor(TSize/numb);
    for (var y = 0; y < num; y++) {    
      var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
      var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
      var radius = Math.floor(Math.random()*(circleRadiusMax-circleRadiusMin+1)+circleRadiusMin);
      for (var z = 0; z < 2*radius; z++){
        for (var i = 0; i < 2*radius; i++){
          if(Math.sqrt((z-radius)*(z-radius)+(i-radius)*(i-radius)) < radius){
            var circleColour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
            this.map[Position_x+Position_y*ret+z+i*ret] = circleColour;
          }
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
  },randomSnakes: function randomSnakes(numb, segMin, segMax, posXMin, posXMax, posYMin, posYMax, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax) {
    var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
    for (var j = 0; j < num; j++) {
      var startX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
      var startY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
      var seg = Math.floor(Math.random()*(segMax-segMin+1)+segMin);
      this.snake(seg, startX, startY, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax);
    }
  },
  snake: function snake(seg, startX, startY, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax) {
    var PosX = startX;
    var PosY = startY;
    var lastD = Math.floor(Math.random()*4);;
    for (var i = 0; i < seg; i++) {
      var direction = Math.floor(Math.random()*4);
      var randColour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
      var randLengthX = Math.floor(Math.random()*(lengthXMax-lengthXMin+1)+lengthXMin);
      var randLengthY = Math.floor(Math.random()*(lengthYMax-lengthYMin+1)+lengthYMin);
      if (direction === 0) {
        if (lastD === 3) {
          for (var x = 0; x < randLengthX; x++) {
            for (var y = 0; y < thickY; y++) {
              this.map[PosX+ret*PosY+x+ret*y] = randColour;
            }
          }
          PosX = PosX + randLengthX - 1;
          PosY = PosY;
          lastD = 0;
        } else if (lastD === 1) {
          for (var x = 0; x < randLengthX; x++) {
            for (var y = 0; y < thickY; y++) {
              this.map[PosX+thickX+ret*PosY+x+ret*y] = randColour;
            }
          }
          PosX = PosX + randLengthX + thickX - 1;
          PosY = PosY;
          lastD = 0;
        } else {
          i--;
        }
      } else if (direction === 1) {
        if (lastD === 0) {
          for (var x = 0; x < thickX; x++) {
            for (var y = 0; y < randLengthY; y++) {
              this.map[PosX-thickX+ret*PosY+x-ret*y] = randColour;
            }
          }
          PosX = PosX - thickX;
          PosY = PosY - randLengthY + 1;
          lastD = 1;
        } else if (lastD === 2) {
          for (var x = 0; x < thickX; x++) {
            for (var y = 0; y < randLengthY; y++) {
              this.map[PosX+ret*PosY+x-ret*y] = randColour;
            }
          }
          PosX = PosX;
          PosY = PosY - randLengthY + 1;
          lastD = 1;
        } else {
          i--;
        }
      } else if (direction === 2) {
        if (lastD === 1) {
          for (var x = 0; x < randLengthX; x++) {
            for (var y = 0; y < thickY; y++) {
              this.map[PosX+ret*PosY-x+ret*y] = randColour;
            }
          }
          PosX = PosX - randLengthX + 1;
          PosY = PosY;
          lastD = 2;
        } else if (lastD === 3) {
          for (var x = 0; x < randLengthX; x++) {
            for (var y = 0; y < thickY; y++) {
              this.map[PosX+thickX+ret*PosY-x+ret*y] = randColour;
            }
          }
          PosX = PosX - randLengthX + thickX + 1;
          PosY = PosY;
          lastD = 2;
        } else {
          i--;
        }
      } else {
        if (lastD === 0) {
          for (var x = 0; x < thickX; x++) {
            for (var y = 0; y < randLengthY; y++) {
              this.map[PosX+ret*PosY+x+ret*y] = randColour;
            }
          }
          PosX = PosX;
          PosY = PosY + randLengthY - 1;
          lastD = 3;
        } else if (lastD === 2) {
          for (var x = 0; x < thickX; x++) {
            for (var y = 0; y < randLengthY; y++) {
              this.map[PosX-thickX+ret*PosY+x+ret*y] = randColour;
            }
          }
          PosX = PosX - thickX;
          PosY = PosY + randLengthY - 1;
          lastD = 3;
        } else {
          i--;
        }
      }
    }
  },
  colouring: function colouring(prob, posXMin, posXMax, posYMin, posYMax, colourMin, colourMax) {
    for (var x = posXMin; x < posXMax+1;x++) {
      for (var y = posYMin; y < posYMax; y++) {
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
  /*
  //Ground
    this.randomTerrain(500, 0, ret, 0, ret, 20, 30, 20, 30, 17, 45);
    this.randomTerrain(250, 0, ret, 0, ret, 2, 3, 7, 20, 0, 0);
    this.randomTerrain(250, 0, ret, 0, ret, 14, 32, 2, 3, 0, 0);
    this.randomTerrain(750, 0, ret, 0, ret, 24, 38, 4, 6, 0, 0);
    this.randomTerrain(50, 230, ret-230, 230, ret-230, 1, 1, 1, 1, 0, 0);
    this.makeTerrain(260, 260, ret-520, ret-520, 0, 0); 
  */
    this.makeTerrain(0,0,ret,ret,17,45);
    this.randomSnakes(1000, 5, 50, 0, ret, 0, ret, 6, 24, 4, 10, 3, 3, 0, 0);
  /*
  //Fire Kingdom
    this.makeTerrain(0, 0, 160, 160, 0, 0);
    this.circle(300,0, 160, 0, 160, 2, 9, 17, 45);
    this.circle(100,0, 160, 0, 160, 2, 4, 17, 45);
    this.colouring(0.3, 0, 250, 0, 250, 1, 4);
    this.colouring(0.6, 0, 175, 0, 175, 1, 4);
    this.colouring(1, 0, 100, 0, 100, 1, 4);
  //Ice Kingdom
    this.makeTerrain(ret-250, ret-250, 250, 250, 17, 45);
    this.snake(100, ret-125, ret-125, 5, 20, 5, 20, 3, 3, 0, 0);
    this.colouring(0.3, ret-250, ret-1, ret-250, ret-1, 59, 63);
    this.colouring(0.6, ret-175, ret-1, ret-175, ret-1, 59, 63);
    this.colouring(1, ret-100, ret-1, ret-100, ret-1, 59, 63);
  // Center Part of the Map
  	this.randomTerrain(100,250, ret-250 ,250 , ret-250, 3, 30, 1, 2, 17, 45);
  	this.randomTerrain(1000,250, ret-250 ,250 , ret-250, 3, 30, 3, 30, 0, 0);
  	this.randomTerrain(700,250, ret-250 ,250 , ret-250, 1, 10, 1, 1, 17, 45);
    this.randomTerrain(2500,250, ret-280 ,250 , ret-280, 30, 50, 30, 50, 0, 0); //Large Voids
    this.randomTerrain(1000,250, ret-250 ,250 , ret-250, 1, 2, 1, 1, 17, 45);
  //Corner Colours
    this.colouring(0.3, ret-250, ret-1, 0, 250, 31, 34);
    this.colouring(0.6, ret-175, ret-1, 0, 175, 31, 34);
    this.colouring(1, ret-100, ret, 0, 100, 31, 34);
    this.colouring(0.3, 0, 250, ret-250, ret-1, 55, 59);
    this.colouring(0.6, 0, 175, ret-175, ret-1, 55, 59);
    this.colouring(1, 0, 100, ret-100, ret-1, 55, 59);
    //Testing Room lower left corner
    var testRoomSize = 40
    this.makeTerrain(0, ret-testRoomSize, testRoomSize, testRoomSize, 0, 0);
    */
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
