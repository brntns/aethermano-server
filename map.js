'use strict';
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var ret = 800;
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
  randomTerrain2: function randomTerrain2(numb, X, Y, width, height, sizeX, dsizeX, sizeY, dsizeY, colour, dcolour) {
    var TSize = width*height;
    var num = Math.floor(TSize/numb);
    for (var n = 0; n < num; n++) {
      var PosX = this.Random(X,X+width);
      var PosY = this.Random(Y,Y+height);
      var SizeX = this.Random(sizeX, sizeX+dsizeX);
      var SizeY = this.Random(sizeY, sizeY+dsizeY);
      this.makeTerrainInBounds2(0, 0, ret, ret, PosX, PosY, SizeX, SizeY, colour, dcolour);
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
  makeTerrainInBounds2: function makeTerrainInBounds2(x, y, width, height, posX, posY, sizeX, sizeY, colour, dcolour) {
    if ((posX <= x+width)&&(posY <= y+height)&&(posX+sizeX > x)&&(posY+sizeY > y)) {
      var PosX = posX;
      var PosY = posY;
      var SizeX = sizeX;
      var SizeY = sizeY;
      if (posX < x) {
        PosX = x;
      }
      if (posY < y) {
        PosY = y;
      }
      if (PosX+sizeX > x+width) {
        SizeX = x+width-PosX;
      }
      if (PosY+sizeY > y+height) {
        SizeY = y+height-PosY;
      }
      for (var j = 0; j < SizeX; j++){
        for (var i = 0; i < SizeY; i++){
          var Colour = this.Random(colour,colour+dcolour);
          this.map[PosX+PosY*ret+j+i*ret] = Colour;
        }
      }
    }
  },
  portal: function portal(posXMin, posXMax, posYMin, posYMax, sizeX, sizeY, portalRadius, colourMin, colourMax) {
    console.log("generating portal. coordinates:");
  	var PosX = Math.floor(Math.random()*(posXMax-posXMin+1)+posXMin);
  	var PosY = Math.floor(Math.random()*(posYMax-posYMin+1)+posYMin);
    this.mapData.portalPosX = PosX;
    this.mapData.portalPosY = PosY;
    console.log(PosX, PosY);
  	for (var z = 0; z < sizeX; z++){
  		for (var i = 0; i < sizeY; i++){
  			if(Math.sqrt((z-sizeX/2)*(z-sizeX/2)+(i-sizeY/2)*(i-sizeY/2)) < portalRadius){
  				var portalColour = this.Random(colourMin, colourMax)
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
  circle2: function circle2(numb, X, Y, width, height, radius, dradius, colour, dcolour) {
    var TSize = width*height;
    var num = Math.floor(TSize/numb);
    for (var n = 0; n < num; n++) {
      var PosX = this.Random(X,X+width);
      var PosY = this.Random(Y,Y+height);
      var Radius = this.Random(radius,radius+dradius);
      for (var j = 0; j < 2*Radius; j++){
        for (var i = 0; i < 2*Radius; i++){
          if(Math.sqrt((j-Radius)*(j-Radius)+(i-Radius)*(i-Radius)) < Radius){
            var Colour = this.Random(colour,colour+dcolour);
            this.map[PosX+PosY*ret+j+i*ret] = Colour;
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
  diamond2: function diamond2(numb, X, Y, width, height, sizeX, dsizeX, sizeY, dsizeY, colour, dcolour) {
    var TSize = width*height;
    var num = Math.floor(TSize/numb);
    for (var n = 0; n < num; n++) {
      var PosX = this.Random(X,X+width);
      var PosY = this.Random(Y,Y+height);
      var DsizeX = this.Random(sizeX, sizeX+dsizeX);
      var DsizeY = this.Random(sizeY, sizeY+dsizeY);
      for (var j = 0; j < DsizeX; j++){
        for (var i = 0; i < DsizeY; i++){
          var ecc = DsizeY/DsizeX;
          if(ecc*Math.abs(j-DsizeX/2) + Math.abs(i-DsizeY/2) < DsizeY/2){
            var Colour = this.Random(colour,colour+dcolour);
            this.map[PosX+PosY*ret+j+i*ret] = Colour;
          }
        }
      }
    }
  },
  ring: function ring(posXMin, posXMax, posYMin, posYMax, radius, thick, colourMin, colourMax) {
    var PosX = this.Random(posXMin,posXMax);
    var PosY = this.Random(posYMin,posYMax);
    for (var z = -radius; z < radius; z++){
      for (var i = -radius; i < radius; i++){
        var rad = Math.sqrt(z*z+i*i);
        if(rad > radius-thick && rad <= radius){
          var ringColour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
          if (PosX+z <= ret-1 && PosX+z >= 0 && PosY+i <= ret-1 && PosY+i >= 0 ) {
            this.map[PosX+PosY*ret+z+i*ret] = ringColour;
          }
        }
      }
    }
  },
  randomRings: function randomRings(numb, posXMin, posXMax, posYMin, posYMax, radiusMin, radiusMax, thickMin, thickMax, colourMin, colourMax) {
    var TSize = (posXMax - posXMin)*(posYMax - posYMin);
    var num = Math.floor(TSize/numb);
    for (var j = 0; j < num; j++) {
      var radius = this.Random(radiusMin,radiusMax);
      var thick = this.Random(thickMin,thickMax);
      this.ring(posXMin, posXMax, posYMin, posYMax, radius, thick, colourMin, colourMax);
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
  WindPalace: function WindPalace(x, y, width, height, overlap) {
    // Wind Palace
    //Make Space
    this.makeTerrain(x, y, width, height, 0, 0);
    //Borders
    this.diamond2(800, x-overlap, y-overlap, width+2*overlap, 2*overlap, 17, 6, 17, 6, 0, 0);
    this.diamond2(800, x-overlap, y-overlap, width+2*overlap, 2*overlap, 14, 3, 14, 3, 0, 0);
    this.diamond2(800, x-overlap, y-overlap, width+2*overlap, 2*overlap, 9, 2, 9, 2, 0, 0);

    this.diamond2(800, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 17, 6, 17, 6, 0, 0);
    this.diamond2(800, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 14, 3, 14, 3, 0, 0);
    this.diamond2(800, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 9, 2, 9, 2, 0, 0);

    this.diamond2(800, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 17, 6, 17, 6, 0, 0);
    this.diamond2(800, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 14, 3, 14, 3, 0, 0);
    this.diamond2(800, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 9, 2, 9, 2, 0, 0);

    this.diamond2(800, x-overlap, y-overlap, 2*overlap, height+2*overlap, 17, 6, 17, 6, 0, 0);
    this.diamond2(800, x-overlap, y-overlap, 2*overlap, height+2*overlap, 14, 3, 14, 3, 0, 0);
    this.diamond2(800, x-overlap, y-overlap, 2*overlap, height+2*overlap, 9, 2, 9, 2, 0, 0);

    //Wind Palace Terrain
    this.diamond2(1800, x, y, width, height, 17, 6, 17, 6, 122, 4);
    this.diamond2(1200, x, y, width, height, 14, 3, 14, 3, 122, 4);
    this.diamond2(800, x, y, width, height, 9, 2, 9, 2, 122, 4);
    this.diamond2(1800, x, y, width, height, 17, 6, 17, 6, 122, 4);
    this.diamond2(1200, x, y, width, height, 14, 3, 14, 3, 122, 4);
    this.diamond2(800, x, y, width, height, 9, 2, 9, 2, 122, 4);
  },
  Jungle: function Jungle(x, y, width, height, overlap) {
    // Jungle
    //Make Space
    this.makeTerrain(x, y, width, height, 0, 0);
    //Jungle Terrain
    this.randomSnakes(300, 0, 15, 30, x-overlap, x+width+overlap, y-overlap, y+height+overlap, 3, 12, 4, 16, 1, 1, 31, 34);
    this.randomSnakes(300, 30, 15, 30, x-overlap, x+width+overlap, y-overlap, y+height+overlap, 3, 12, 4, 16, 2, 1, 31, 34);
    this.randomSnakes(2000, 0, 15, 30, x-overlap, x+width+overlap, y-overlap, y+height+overlap, 3, 12, 4, 16, 2, 2, 0, 0);
    this.randomSnakes(3000, 0, 15, 30, x-overlap, x+width+overlap, y-overlap, y+height+overlap, 3, 12, 4, 16, 3, 3, 0, 0);
  },
  Bedrock: function Bedrock(x, y, width, height, overlap) {
    //Bedrock
    //Make Space
    this.makeTerrain(x, y, width, height, 0, 0);
    //Bedrock Terrain
    this.makeTerrain(x,y,width,height,132,136);
    this.randomTerrain(3250, x-overlap, x+width+overlap, y-overlap, y+width+overlap, 14, 32, 14, 32, 0, 0);
    //Underground Passages
    this.randomSnakes(7200, 0, 25, 50, x-overlap, x+width+overlap, y-overlap, y+height+overlap, 6, 24, 4, 10, 3, 3, 0, 0);
    this.randomSnakes(25000, 0, 5, 10, x-overlap, x+width+overlap, y-overlap, y+height+overlap, 30, 40, 4, 10, 3, 3, 0, 0);
  },
  FireKingdom: function FireKingdom(x, y, width, height, overlap) {
    //Fire Kingdom
    //Make Space
    this.makeTerrain(x, y, width, height, 0, 0);
    //Borders
    this.circle2(300, x-overlap, y-overlap, width+2*overlap, 2*overlap, 7, 6, 0, 0);
    this.circle2(200, x-overlap, y-overlap, width+2*overlap, 2*overlap, 4, 5, 0, 0);
    this.circle2(200, x-overlap, y-overlap, width+2*overlap, 2*overlap, 3, 2, 0, 0);
    this.circle2(50, x-overlap, y-overlap, width+2*overlap, 2*overlap,  1, 1, 0, 0);

    this.circle2(300, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 7, 6, 0, 0);
    this.circle2(200, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 4, 5, 0, 0);
    this.circle2(200, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 3, 2, 0, 0);
    this.circle2(50, x-overlap, y+height-overlap, width+2*overlap, 2*overlap,  1, 1, 0, 0);
    
    this.circle2(300, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 7, 6, 0, 0);
    this.circle2(200, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 4, 5, 0, 0);
    this.circle2(200, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 3, 2, 0, 0);
    this.circle2(50, x+width-overlap, y-overlap, 2*overlap, height+2*overlap,  1, 1, 0, 0);

    this.circle2(300, x-overlap, y-overlap, 2*overlap, height+2*overlap, 7, 6, 0, 0);
    this.circle2(200, x-overlap, y-overlap, 2*overlap, height+2*overlap, 4, 5, 0, 0);
    this.circle2(200, x-overlap, y-overlap, 2*overlap, height+2*overlap, 3, 2, 0, 0);
    this.circle2(50, x-overlap, y-overlap, 2*overlap, height+2*overlap,  1, 1, 0, 0);
    //Fire Terrain
    this.circle2(2500, x, y, width, height, 2, 6, 1, 3);
    this.circle2(750, x, y, width, height, 4, 3, 1, 3);
    this.circle2(275, x, y, width, height, 2, 3, 1, 3);

    this.circle2(2500, x, y, width, height, 6, 2, 0, 0);
    this.circle2(1500, x, y, width, height, 4, 3, 0, 0);
    this.circle2(1150, x, y, width, height, 2, 3, 0, 0);

    this.circle2(55, x, y, width, height, 1, 4, 1, 3);
  },
  IceKingdom: function IceKingdom(x, y, width, height, overlap) {
    //Ice Kingdom
    //Make Space
    this.makeTerrain(x, y, width, height, 0, 0);
    //Borders
    this.randomTerrain2(100, x-overlap, y-overlap, width+2*overlap, 2*overlap, 2, 1, 5, 25, 0, 0);
    this.randomTerrain2(50, x-overlap, y-overlap, width+2*overlap, 2*overlap, 1, 0, 5, 25, 0, 0);

    this.randomTerrain2(100, x-overlap, y+height-overlap, width+2*overlap, 2*overlap,  2, 1, 5, 25, 0, 0);
    this.randomTerrain2(50, x-overlap, y+height-overlap, width+2*overlap, 2*overlap, 1, 0, 5, 25, 0, 0);

    this.randomTerrain2(100, x+width-overlap, y-overlap, 2*overlap, height+2*overlap,  2, 1, 5, 25, 0, 0);
    this.randomTerrain2(50, x+width-overlap, y-overlap, 2*overlap, height+2*overlap, 1, 0, 5, 25, 0, 0);

    this.randomTerrain2(100, x-overlap, y-overlap, 2*overlap, height+2*overlap,  2, 1, 5, 25, 0, 0);
    this.randomTerrain2(50, x-overlap, y-overlap, 2*overlap, height+2*overlap, 1, 0, 5, 25, 0, 0);
    //Ice Terrain
    var Iceheight = Math.floor(height/7)+1;
    this.randomTerrain2(50, x-overlap, y-overlap, width+overlap, Iceheight+overlap, 3, 1, 5, 25, 59, 4);
    this.randomTerrain2(150, x-overlap, y+Iceheight, width+overlap, Iceheight, 2, 1, 5, 25, 59, 4);
    this.randomTerrain2(250, x-overlap, y+2*Iceheight, width+overlap, Iceheight, 1, 1, 5, 25, 59, 4);
    this.randomTerrain2(100, x-overlap, y-overlap, width+2*overlap, height+2*overlap, 1, 0, 5, 25, 59, 4);
    //this.randomTerrain2(50, x-overlap, y-overlap, width+overlap, height+overlap, 3, 1, 5, 25, 0, 0);
    //randomTerrain2(numb, X, Y, width, height, sizeX, dsizeX, sizeY, dsizeY, colour, dcolour)
  },
	generate: function generate(size) {
  	this.clear();
  	this.mapSize = size * size;
  //Clear Terrain
  	for (var y = 0; y < this.mapSize; y++) {
    		this.map[y] = 0;
  	}
    if (size < 300) {
      this.makeTerrain(0, 0, size, size, 17, 43);
      this.makeTerrain(5, 5, size-5, size-5, 0, 0);
      this.makeTerrain(10,size-10,3,7,17,43);
      this.makeTerrain(10,size-10,7,2,17,43);
      this.portal(size-24, size-24, size-24, size-24,24,24,8,13,16);
    } else {
    //Set Values
      var Outer = Math.floor(size/6);
      var Inner = Math.floor(size/8);
      var HalfInner = Math.floor(Inner/2);
      var StepInner = HalfInner + Math.floor(HalfInner/4);
      var Realms = Math.floor(size/6.5);
      var Overlap = 8;//Math.floor(size/100);
      var Center = Math.floor(size/2);
      var IceHeight = Math.floor(Realms/7);
    //Build Terrain
    /*Bedrock
      this.makeTerrain(0,0,size,size,132,136);
      this.randomTerrain(3750, 0, size, 0, size, 24, 32, 24, 32, 0, 0);
      this.makeTerrain(Outer, Outer, size-2*Outer, size-2*Outer, 0, 0);
    //Center Part of the Map
      //Ladders
      this.randomTerrain(750, Outer, size-Outer, Outer, size-Outer, 1, 2, 24, 32, 13, 16);
      //Terrain
      this.randomTerrain(100,Outer, size-Outer, Outer , size-Outer, 3, 30, 1, 2, 122, 136);
      this.randomTerrain(1000,Outer-Overlap, size-Outer+Overlap, Outer-Overlap , size-Outer+Overlap, 3, 30, 3, 30, 0, 0);
      this.randomTerrain(700,Outer, size-Outer, Outer , size-Outer, 1, 10, 1, 1, 122, 136);
      this.randomTerrain(2500,Outer-Overlap, size-Outer+Overlap, Outer-Overlap, size-Outer+Overlap, 30, 50, 30, 50, 0, 0); //Large Voids
      this.randomTerrain(1000,Outer, size-Outer, Outer , size-Outer, 1, 2, 1, 1, 122, 136);
    //Underground Passages
      this.randomSnakes(2500, 0, 25, 50, Realms-Overlap, size-Realms+Overlap, 0, Outer+Overlap, 6, 24, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(2500, 0, 25, 50, 0, Outer+Overlap, Realms-Overlap, size-Realms+Overlap, 6, 24, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(2500, 0, 25, 50, Realms-Overlap, size-Realms+Overlap, size-Outer+Overlap, size, 6, 24, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(2500, 0, 25, 50, size-Outer-Overlap, size, Realms-Overlap, size-Realms+Overlap, 6, 24, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(12500, 0, 5, 10, Realms-Overlap, size-Realms+Overlap, 0, Outer+Overlap, 30, 40, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(12500, 0, 5, 10, 0, Outer+Overlap, Realms-Overlap, size-Realms+Overlap, 30, 40, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(12500, 0, 5, 10, Realms-Overlap, size-Realms+Overlap, size-Outer+Overlap, size, 30, 40, 4, 10, 3, 3, 0, 0);
      this.randomSnakes(12500, 0, 5, 10, size-Outer-Overlap, size, Realms-Overlap, size-Realms+Overlap, 30, 40, 4, 10, 3, 3, 0, 0);
    //The Very Center
      this.ring(Center, Center, Center, Center, Inner, Inner, 0, 0);
      this.ring(Center, Center, Center, Center, HalfInner, HalfInner, 40, 45);
      this.randomRings(600, Center-HalfInner, Center+HalfInner, Center-HalfInner, Center+HalfInner, 7, 28, 1, 4, 40, 45);
      this.randomRings(500, Center-StepInner, Center+StepInner, Center-StepInner, Center+StepInner, 6, 38, 1, 4, 0, 0);
    //Fire Kingdom
      //Make Space
      this.makeTerrain(0, 0, Realms, Realms, 0, 0);
      //Borders
      this.circle(300, 0, Realms+Overlap, Realms-Overlap, Realms+Overlap, 7, 12, 0, 0);
      this.circle(200, 0, Realms+Overlap, Realms-Overlap, Realms+Overlap, 4, 9, 0, 0);
      this.circle(100, 0, Realms+Overlap, Realms-Overlap, Realms+Overlap, 3, 5, 0, 0);
      this.circle(50, 0, Realms+Overlap, Realms-Overlap, Realms+Overlap, 1, 2, 0, 0);

      this.circle(300, Realms-Overlap, Realms+Overlap, 0, Realms+Overlap, 7, 12, 0, 0);
      this.circle(200, Realms-Overlap, Realms+Overlap, 0, Realms+Overlap, 4, 9, 0, 0);
      this.circle(100, Realms-Overlap, Realms+Overlap, 0, Realms+Overlap, 3, 5, 0, 0);
      this.circle(50, Realms-Overlap, Realms+Overlap, 0, Realms+Overlap, 1, 2, 0, 0);
      //Fire Terrain
      this.circle(1000, 0, Realms, 0, Realms, 7, 12, 1, 4);
      this.circle(7500, 0, Realms, 0, Realms, 4, 9, 1, 4);
      this.circle(200, 0, Realms, 0, Realms, 3, 5, 1, 4);

      this.circle(2000, 0, Realms, 0, Realms, 9, 13, 0, 0);
      this.circle(1000, 0, Realms, 0, Realms, 7, 10, 0, 0);
      this.circle(750, 0, Realms, 0, Realms, 4, 7, 0, 0);
    //Ice Kingdom
      //Make Space
      this.makeTerrain(size-Realms, size-Realms, Realms, Realms, 0, 0);
      //Borders
      this.randomTerrain(100, size-Realms-Overlap, size-Realms+Overlap, size-Realms-Overlap, size, 2, 3, 5, 30, 0, 0);
      this.randomTerrain(50, size-Realms-Overlap, size-Realms+Overlap, size-Realms-Overlap, size, 1, 1, 5, 30, 0, 0);

      this.randomTerrain(100, size-Realms-Overlap, size, size-Realms-Overlap, size-Realms+Overlap, 2, 3, 5, 30, 0, 0);
      this.randomTerrain(50, size-Realms-Overlap, size, size-Realms-Overlap, size-Realms+Overlap, 1, 1, 5, 30, 0, 0);
      //Ice Terrain
      this.randomTerrain(50, size-Realms-Overlap, size, size-IceHeight, size, 3, 4, 5, 30, 59, 63);
      this.randomTerrain(150, size-Realms-Overlap, size, size-2*IceHeight , size-IceHeight, 2, 3, 5, 30, 59, 63);
      this.randomTerrain(250, size-Realms-Overlap, size , size-3*IceHeight , size-2*IceHeight, 2, 2, 5, 30, 59, 63);
      this.randomTerrain(200, size-Realms-Overlap, size , size-Realms-Overlap, size, 1, 1, 5, 30, 59, 63);
      this.randomTerrain(50, size-Realms-Overlap, size , size-Realms-Overlap , size-Realms-Overlap+IceHeight, 1, 3, 5, 30, 0, 0);

    // Wind Palace
      //Make Space
      this.makeTerrain(0, size-Realms, Realms, Realms, 0, 0);
      //Borders
      this.diamond(800, Realms-Overlap, Realms+Overlap, size-Realms-Overlap, size, 17, 23, 17, 23, 0, 0);
      this.diamond(600, Realms-Overlap, Realms+Overlap, size-Realms-Overlap, size, 14, 17, 14, 17, 0, 0);
      this.diamond(400, Realms-Overlap, Realms+Overlap, size-Realms-Overlap, size, 9, 11, 9, 11, 0, 0);

      this.diamond(800, 0, Realms+Overlap, size-Realms-Overlap, size-Realms+Overlap, 17, 23, 17, 23, 0, 0);
      this.diamond(600, 0, Realms+Overlap, size-Realms-Overlap, size-Realms+Overlap, 14, 17, 14, 17, 0, 0);
      this.diamond(400, 0, Realms+Overlap, size-Realms-Overlap, size-Realms+Overlap, 9, 11, 9, 11, 0, 0);
      //Wind Palace Terrain
      this.diamond(1800, 0, Realms+Overlap, size-Realms-Overlap, size, 17, 23, 17, 23, 122, 126);
      this.diamond(1200, 0, Realms+Overlap, size-Realms-Overlap, size, 14, 17, 14, 17, 122, 126);
      this.diamond(800, 0, Realms+Overlap, size-Realms-Overlap, size, 9, 11, 9, 11, 122, 126);
      this.diamond(1800, 0, Realms+Overlap, size-Realms-Overlap, size, 17, 23, 17, 23, 122, 126);
      this.diamond(1200, 0, Realms+Overlap, size-Realms-Overlap, size, 14, 17, 14, 17, 122, 126);
      this.diamond(800, 0, Realms+Overlap, size-Realms-Overlap, size, 9, 11, 9, 11, 122, 126); */
    //Ninth Circle (It's cold there!)
    //Bedrock
      this.Bedrock(0, 2*Realms, size, Realms, Overlap);
      this.Bedrock(0, 4*Realms, size, Realms, Overlap);
    //Hell
      this.FireKingdom(0, 3*Realms, size, Realms, Overlap);
    //Forest
      this.Jungle(0, Realms, size, Realms, Overlap);
    //Cloud Palace
      this.WindPalace(0, 0, size, Realms, Overlap);
      this.IceKingdom(0, 5*Realms, size, Realms, Overlap);
    /* Jungle
      //Make Space
      this.makeTerrain(size-Realms, 0, Realms, Realms, 0, 0);
      //Jungle Terrain
      this.randomSnakes(300, 0, 15, 30, size-Realms-Overlap, size, 0, Realms+Overlap, 3, 12, 4, 16, 1, 1, 31, 34);
      this.randomSnakes(300, 30, 15, 30, size-Realms-Overlap, size, 0, Realms+Overlap, 3, 12, 4, 16, 2, 1, 31, 34);
      this.randomSnakes(1000, 0, 15, 30, size-Realms-Overlap, size, 0, Realms+Overlap, 3, 12, 4, 16, 2, 2, 0, 0);
      this.randomSnakes(1500, 0, 15, 30, size-Realms-Overlap, size, 0, Realms+Overlap, 3, 12, 4, 16, 3, 3, 0, 0); */
    //Portal Spawn
    	this.portal(0,size-24 ,0,size-24,24,24,8, 13, 16);
    }
      this.setMap();
	},
	setMap: function(){
     this.mapData.layers[0].data = this.map;
     this.maps.push(this.mapData);
//      console.log(this.maps);
	}
};
