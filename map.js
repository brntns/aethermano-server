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
    "portalPosX":1,
    "portalPosY":1
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
	randomTerrain: function randomTerrain(numb, posXMin, posXMax, posYMin, posYMax, sizeXMin, sizeXMax, sizeYMin, sizeYMax, colourMin, colourMax) {
		var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
  	for (var y = 0; y < num; y++) {
  		var PosX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
  		var PosY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
  		var SizeX = Math.floor(Math.random()*(sizeXMax-sizeXMin+1)+sizeXMin);
  		var SizeY = Math.floor(Math.random()*(sizeYMax-sizeYMin+1)+sizeYMin);
  		for (var z = 0; z < SizeX;z++){
  			for (var i = 0; i < SizeY; i++){
  				var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
  				this.map[PosX+PosY*ret+z+i*ret] = Colour;
  			}
  		}
  	}
	},
  makeTerrain: function makeTerrain(posX, posY, sizeX, sizeY, colourMin, colourMax) {
    for (var z = 0; z < sizeX;z++){
      for (var i = 0; i < sizeY; i++){
        var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
        this.map[posX+posY*ret+z+i*ret] = Colour;
      }
    }
  },
  makeTerrainInBounds: function makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY, sizeX, sizeY, colourMin, colourMax) {
    if ((posX <= posXMax)&&(posY <= posYMax)&&(posX+sizeX > posXMin)&&(posY+sizeY > posYMin)) {
      var PosX = posX;
      var PosY = posY;
      var SizeX = sizeX;
      var SizeY = sizeY;
      if (posX < posXMin) {
        PosX = posXMin;
      }
      if (posY < posYMin) {
        PosY = posYMin;
      }
      if (PosX+sizeX > posXMax) {
        SizeX = posXMax-posX;
      }
      if (PosY+sizeY > posYMax) {
        SizeY = posYMax-posY;
      }
      for (var z = 0; z < SizeX;z++){
        for (var i = 0; i < SizeY; i++){
          var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
          this.map[PosX+PosY*ret+z+i*ret] = Colour;
        }
      }
    }
  },   	
  portal: function portal(posXMin, posXMax, posYMin, posYMax, sizeX, sizeY, portalRadius) {
    console.log("generating portal. coordinates:");
  	var PosX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
  	var PosY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
    this.mapData.portalPosX = PosX;
    this.mapData.portalPosY = PosY;
    console.log(PosX, PosY);
  	for (var z = 0; z < sizeX; z++){
  		for (var i = 0; i < sizeY; i++){
  			if(Math.sqrt((z-sizeX/2)*(z-sizeX/2)+(i-sizeY/2)*(i-sizeY/2)) < portalRadius){
  				var portalColour = Math.floor(Math.random()*4+13);
  				this.map[PosX+PosY*ret+z+i*ret] = portalColour;
  			}
  			else {
  				this.map[PosX+PosY*ret+z+i*ret] = 0;
  			}
  		}
  	}
	},
  circle: function circle(numb, posXMin, posXMax, posYMin, posYMax, circleRadiusMin, circleRadiusMax, colourMin, colourMax) {
    var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
    for (var y = 0; y < num; y++) {    
      var PosX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
      var PosY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
      var radius = Math.floor(Math.random()*(circleRadiusMax-circleRadiusMin+1)+circleRadiusMin);
      for (var z = 0; z < 2*radius; z++){
        for (var i = 0; i < 2*radius; i++){
          if(Math.sqrt((z-radius)*(z-radius)+(i-radius)*(i-radius)) < radius){
            var circleColour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
            this.map[PosX+PosY*ret+z+i*ret] = circleColour;
          }
        }
      }
    }
  },
  diamond: function diamond(numb, posXMin, posXMax, posYMin, posYMax, sizeXMin, sizeXMax, sizeYMin, sizeYMax, colourMin, colourMax) {
    var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
    for (var y = 0; y < num; y++) {    
      var PosX = this.Random(posXMin,posXMax);
      var PosY = this.Random(posYMin,posYMax);
      var sizeX = this.Random(sizeXMin, sizeXMax);
      var sizeY = this.Random(sizeYMin, sizeYMax);
      for (var z = 0; z < sizeX; z++){
        for (var i = 0; i < sizeY; i++){
          var ecc = sizeY/sizeX;
          if(ecc*Math.abs(z-sizeX/2) + Math.abs(i-sizeY/2) < sizeY/2){
            var colour = this.Random(colourMax,colourMin);
            this.map[PosX+PosY*ret+z+i*ret] = colour;
          }
        }
      }
    }
  },
  ring: function ring(posXMin, posXMax, posYMin, posYMax, minRadius, maxRadius, colourMin, colourMax) {
    var PosX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
    var PosY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
    for (var z = -maxRadius; z < maxRadius; z++){
      for (var i = -maxRadius; i < maxRadius; i++){
        var rad = Math.sqrt(z*z+i*i);
        if(rad > minRadius && rad <= maxRadius){
          var ringColour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
          if (this.map[PosX+PosY*ret+z+i*ret] != 0 && PosX+z <= 639 && PosY+z >= 0 && PosY+i <= 639 && PosY+i >= 0 ) {
            this.map[PosX+PosY*ret+z+i*ret] = ringColour;
          }
        }
      }
    }
  },
  randomSnakes: function randomSnakes(numb, bend, segMin, segMax, posXMin, posXMax, posYMin, posYMax, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax) {
    var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
    for (var j = 0; j < num; j++) {
      var startX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
      var startY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
      var seg = Math.floor(Math.random()*(segMax-segMin+1)+segMin);
      this.snake(seg, bend, posXMin, posXMax, posYMin, posYMax, startX, startY, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax);
    }
  },
  snake: function snake(seg, bend, posXMin, posXMax, posYMin, posYMax, startX, startY, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax) {
    var posX = startX;
    var posY = startY;
    var lastD = Math.floor(Math.random()*4);
    var bends = 0;
    var direction = Math.floor(Math.random()*4);
    for (var i = 0; i < seg; i++) {
      //RIGHT
      if (direction === 0) {
        //From DOWN
        if ((lastD === 3)&&(bends > -bend-1)) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY, randLengthX, thickY, colourMin, colourMax);
          bends--;
          posX = posX + randLengthX;
          posY = posY;
          lastD = 0;
        //From UP
        } else if ((lastD === 1)&&(bends < bend+1)) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX+thickX, posY, randLengthX, thickY, colourMin, colourMax);
          bends++;
          posX = posX + randLengthX + thickX;
          posY = posY;
          lastD = 0;
        } else {
          i--;
        }
      //UP
      } else if (direction === 1) {
        //From RIGHT
        if ((lastD === 0)&&(bends > -1-bend)) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-thickX, posY-randLengthY, thickX, randLengthY, colourMin, colourMax);
          bends--;
          posX = posX - thickX;
          posY = posY - randLengthY;
          lastD = 1;
        //From LEFT
        } else if ((lastD === 2)&&(bends < bend+1)) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY-randLengthY, thickX, randLengthY, colourMin, colourMax);
          bends++;
          posX = posX;
          posY = posY - randLengthY;
          lastD = 1;
        } else {
          i--;
        }
      //LEFT
      } else if (direction === 2) {
        //From UP
        if ((lastD === 1)&&(bends > -1-bend)) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-randLengthX, posY, randLengthX, thickY, colourMin, colourMax);
          bends--;
          posX = posX - randLengthX;
          posY = posY;
          lastD = 2;
        //From DOWN
        } else if ((lastD === 3)&&(bends < bend+1)) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-randLengthX+thickX, posY, randLengthX, thickY, colourMin, colourMax);
          bends++;
          posX = posX - randLengthX + thickX;
          posY = posY;
          lastD = 2;
        } else {
          i--;
        }
      //DOWN
      } else {
        //From RIGHT
        if ((lastD === 0)&&(bends < bend+1)) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY, thickX, randLengthY, colourMin, colourMax);
          bends++;
          posX = posX;
          posY = posY + randLengthY;
          lastD = 3;
        //From LEFT
        } else if ((lastD === 2)&&(bends > -1-bend)) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-thickX, posY, thickX, randLengthY, colourMin, colourMax);
          bends--;
          posX = posX - thickX;
          posY = posY + randLengthY;
          lastD = 3;
        } else {
          i--;
        }
      }
      var direction = Math.floor(Math.random()*4);
    }
  },
  randomWorms: function randomWorms(numb, segMin, segMax, posXMin, posXMax, posYMin, posYMax, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax) {
    var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
    for (var j = 0; j < num; j++) {
      var startX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
      var startY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
      var seg = Math.floor(Math.random()*(segMax-segMin+1)+segMin);
      this.worm(seg, posXMin, posXMax, posYMin, posYMax, startX, startY, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax);
    }
  },
  worm: function worm(seg, posXMin, posXMax, posYMin, posYMax, startX, startY, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax) {
    var posX = startX;
    var posY = startY;
    var lastD = Math.floor(Math.random()*4);
    var bends = 0;
    for (var i = 0; i < seg; i++) {
      console.log(bends);
      var direction = Math.floor(Math.random()*4);
      //RIGHT
      if (direction === 0) {
        //From UP
        if (lastD === 3) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY, randLengthX, thickY, colourMin, colourMax);
          posX = posX + randLengthX;
          posY = posY;
          lastD = 0;
        //From DOWN
        } else if (lastD === 1) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX+thickX, posY, randLengthX, thickY, colourMin, colourMax);
          posX = posX + randLengthX + thickX;
          posY = posY;
          lastD = 0;
        } else {
          i--;
        }
      //UP
      } else if (direction === 1) {
        //From RIGHT
        if (lastD === 0) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-thickX, posY-randLengthY, thickX, randLengthY, colourMin, colourMax);
          posX = posX - thickX;
          posY = posY - randLengthY;
          lastD = 1;
        //From LEFT
        } else if (lastD === 2) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY-randLengthY, thickX, randLengthY, colourMin, colourMax);
          posX = posX;
          posY = posY - randLengthY;
          lastD = 1;
        } else {
          i--;
        }
      //LEFT
      } else if (direction === 2) {
        if (lastD === 1) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-randLengthX, posY, randLengthX, thickY, colourMin, colourMax);
          posX = posX - randLengthX;
          posY = posY;
          lastD = 2;
        } else if (lastD === 3) {
          var randLengthX = this.Random(lengthXMin, lengthXMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-randLengthX+thickX, posY, randLengthX, thickY, colourMin, colourMax);
          posX = posX - randLengthX + thickX;
          posY = posY;
          lastD = 2;
        } else {
          i--;
        }
      //DOWN
      } else {
        if (lastD === 0) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX, posY, thickX, randLengthY, colourMin, colourMax);
          posX = posX;
          posY = posY + randLengthY;
          lastD = 3;
        } else if (lastD === 2) {
          var randLengthY = this.Random(lengthYMin, lengthYMax);
          this.makeTerrainInBounds(posXMin, posXMax, posYMin, posYMax, posX-thickX, posY, thickX, randLengthY, colourMin, colourMax);
          posX = posX - thickX;
          posY = posY + randLengthY;
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
  Random: function Random(rndMin, rndMax) {
    var x = Math.floor(Math.random()*(rndMax-rndMin+1)+rndMin);
    return x;
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
  // Dungeon
    this.makeTerrain(0,0,ret,ret,17,45);
    this.randomTerrain(3750, 0, ret, 0, ret, 24, 32, 24, 32, 0, 0);
    this.makeTerrain(260, 260, ret-520, ret-520, 0, 0); 
    //this.snake(200, 0, 400, 800, 400, 800, 600, 600, 4, 14, 4, 14, 3, 3, 0, 0);
    //this.worm(200, 1000, 800, 4, 14, 4, 14, 3, 3, 0, 0);
    //randomSnakes(numb, bend, segMin, segMax, posXMin, posXMax, posYMin, posYMax, lengthXMin, lengthXMax, lengthYMin, lengthYMax, thickX, thickY, colourMin, colourMax);
  // Center Part of the Map
    this.randomTerrain(100,250, ret-250 ,250 , ret-250, 3, 30, 1, 2, 17, 45);
    this.randomTerrain(1000,250, ret-250 ,250 , ret-250, 3, 30, 3, 30, 0, 0);
    this.randomTerrain(700,250, ret-250 ,250 , ret-250, 1, 10, 1, 1, 17, 45);
    this.randomTerrain(2500,250, ret-280 ,250 , ret-280, 30, 50, 30, 50, 0, 0); //Large Voids
    this.randomTerrain(1000,250, ret-250 ,250 , ret-250, 1, 2, 1, 1, 17, 45);
  //Fire Kingdom
    this.makeTerrain(0, 0, 250, 250, 0, 0);
    this.circle(2300,0, 250, 0, 250, 7, 12, 1, 4);    
    this.circle(1700,0, 250, 0, 250, 4, 9, 1, 4);
    this.circle(400,0, 250, 0, 250, 3, 5, 1, 4);
    this.circle(300,0, 250, 0, 250, 1, 2, 1, 4);
    /*
    this.colouring(0.3, 0, 250, 0, 250, 1, 4);
    this.colouring(0.6, 0, 175, 0, 175, 1, 4);
    this.colouring(1, 0, 100, 0, 100, 1, 4);
    */
  //Ice Kingdom
    this.makeTerrain(ret-250, ret-250, 250, 250, 0, 0);
    this.randomTerrain(400, ret-250, ret , ret-250 , ret, 2, 3, 5, 30, 59, 63);
    this.randomTerrain(200, ret-250, ret , ret-250 , ret, 1, 1, 5, 30, 59, 63);
    /*
    this.colouring(0.3, ret-250, ret-1, ret-250, ret-1, 59, 63);
    this.colouring(0.6, ret-175, ret-1, ret-175, ret-1, 59, 63);
    this.colouring(1, ret-100, ret-1, ret-100, ret-1, 59, 63);
    */
  // Wind Palace
    this.makeTerrain(0, ret-250, 250, 250, 0, 0);
    this.diamond(300, 0, 250, ret-250, ret, 10, 17, 10, 17, 55, 59);
    /*
    this.colouring(0.3, ret-250, ret-1, 0, 250, 31, 34);
    this.colouring(0.6, ret-175, ret-1, 0, 175, 31, 34);
    this.colouring(1, ret-100, ret, 0, 100, 31, 34);
    */
  // Jungle
    this.makeTerrain(ret-250, 0, 250, 250, 0, 0);
    this.randomSnakes(300, 0, 15, 30, ret-250, ret, 0, 250, 3, 12, 4, 16, 1, 1, 31, 34);
    this.randomWorms(300, 15, 30, ret-250, ret, 0, 250, 3, 12, 4, 16, 2, 1, 31, 34);
    this.randomSnakes(1000, 0, 15, 30, ret-250, ret, 0, 250, 3, 12, 4, 16, 2, 2, 0, 0);
    this.randomSnakes(1500, 0, 15, 30, ret-250, ret, 0, 250, 3, 12, 4, 16, 3, 3, 0, 0);
    /*
    this.colouring(0.3, 0, 250, ret-250, ret-1, 55, 59);
    this.colouring(0.6, 0, 175, ret-175, ret-1, 55, 59);
    this.colouring(1, 0, 100, ret-100, ret-1, 55, 59);
    */
    /*
    //Testing Room lower left corner
    var testRoomSize = 40
    this.makeTerrain(0, ret-testRoomSize, testRoomSize, testRoomSize, 0, 0);
    */
  // Underground Passages
    this.randomSnakes(3500, 0, 25, 50, 230, ret-230, 0, 260, 6, 24, 4, 10, 3, 3, 0, 0);
    this.randomSnakes(3500, 0, 25, 50, 0, 260, 230, ret-230, 6, 24, 4, 10, 3, 3, 0, 0);
    this.randomSnakes(3500, 0, 25, 50, 230, ret-230, ret-260, ret, 6, 24, 4, 10, 3, 3, 0, 0);
    this.randomSnakes(3500, 0, 25, 50, ret-260, ret, 230, ret-230, 6, 24, 4, 10, 3, 3, 0, 0);
  //Portal Spawn
  	this.portal(0,ret-24 ,0,ret-24,24,24,8);
  /*Ring Colour Coding
    var ringMax = Math.max(this.mapData.portalPosX,this.mapData.portalPosY,ret-this.mapData.portalPosX,ret-this.mapData.portalPosY);
    var ringsteps = Math.floor((1.5*ringMax/20))+1;
    var ringstep = 20;
    for (var j = 0; j < ringsteps; j++) {
      this.ring(this.mapData.portalPosX+12,this.mapData.portalPosX+12,this.mapData.portalPosY+12,this.mapData.portalPosY+12,(12+j*ringstep),(12+(j+1)*ringstep),(j+13),(j+13));
    };*/
    this.setMap();
	},
	setMap: function(){
     this.mapData.layers[0].data = this.map;
     this.maps.push(this.mapData);
//      console.log(this.maps);
	}
};
