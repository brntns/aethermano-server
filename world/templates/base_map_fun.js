  clear: function clear() {
		this.mapData = {};
    this.mapSize = 0;
    this.map = [];
		this.rooms = [];
    this.locationSprites = [];
    this.locations = [];
    this.mapFeatures = [];
  },
  countRooms: function countRooms (array) {
    var n = 0;
    var N = [];
    loop:
    for (var j = 0; j < 12; j++) {
      n = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i].type === 4 && array[i].subtype === j) {
          n++;
        }
      }
      N.push(n);
    }
    return N;
  },
  inMapBounds: function inMapBounds (object, mapWidth, mapHeight) {
    if (object.x < 0 || object.x + object.width > mapWidth || object.y < 0 || object.y + object.height > mapHeight) {
      return false;
    }
    return true;
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
  randomTerrain: function randomTerrain(n, x, y, width, height, mapWidth, mapHeight, color) {
    var N = Math.floor((mapHeight*mapWidth)/n);
    var X = 0;
    var Y = 0;
    for (var i = 0; i < N; i++) {
      X = this.Random(x,x+width);
      Y = this.Random(y,y+height);
      if (this.map[X + mapWidth*Y] !== 0) {
        this.map[X + mapWidth*Y] = color;
      }
    }
  },
  writeTiles: function writeTiles (mapWidth, mapHeight) {
    var map = this.map;
    for (var i = 1; i < mapWidth-1; i++) {
      for (var j = 1; j < mapHeight-1; j++) {
        if (map[i+mapWidth*j] !== 0) {
          if (map[(i-1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j-1)] !== 0
          && map[(i+1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j+1)] !== 0) {
            if (map[(i-1)+mapWidth*(j+1)] === 0
            && map[(i-1)+mapWidth*(j-1)] !== 0
            && map[(i+1)+mapWidth*(j-1)] !== 0
            && map[(i+1)+mapWidth*(j+1)] !== 0) {
              map[i+mapWidth*j] = 3;
            } else if (map[(i-1)+mapWidth*(j+1)] !== 0
            && map[(i-1)+mapWidth*(j-1)] === 0
            && map[(i+1)+mapWidth*(j-1)] !== 0
            && map[(i+1)+mapWidth*(j+1)] !== 0) {
              map[i+mapWidth*j] = 2;
            } else if (map[(i-1)+mapWidth*(j+1)] !== 0
            && map[(i-1)+mapWidth*(j-1)] !== 0
            && map[(i+1)+mapWidth*(j-1)] === 0
            && map[(i+1)+mapWidth*(j+1)] !== 0) {
              map[i+mapWidth*j] = 5;
            } else if (map[(i-1)+mapWidth*(j+1)] !== 0
            && map[(i-1)+mapWidth*(j-1)] !== 0
            && map[(i+1)+mapWidth*(j-1)] !== 0
            && map[(i+1)+mapWidth*(j+1)] === 0) {
              map[i+mapWidth*j] = 4;
            }
          } else if (map[(i-1)+mapWidth*j] === 0
          && map[i+mapWidth*(j-1)] !== 0
          && map[(i+1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j+1)] !== 0) {
            map[i+mapWidth*j] = 6;
          } else if (map[(i-1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j-1)] !== 0
          && map[(i+1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j+1)] === 0) {
            map[i+mapWidth*j] = 7;
          } else if (map[(i-1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j-1)] !== 0
          && map[(i+1)+mapWidth*j] === 0
          && map[i+mapWidth*(j+1)] !== 0) {
            map[i+mapWidth*j] = 8;
          } else if (map[(i-1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j-1)] === 0
          && map[(i+1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j+1)] !== 0) {
            map[i+mapWidth*j] = 9;
          } else if (map[(i-1)+mapWidth*j] === 0
          && map[i+mapWidth*(j-1)] === 0
          && map[(i+1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j+1)] !== 0) {
            map[i+mapWidth*j] = 10;
          } else if (map[(i-1)+mapWidth*j] === 0
          && map[i+mapWidth*(j-1)] !== 0
          && map[(i+1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j+1)] === 0) {
            map[i+mapWidth*j] = 11;
          } else if (map[(i-1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j-1)] !== 0
          && map[(i+1)+mapWidth*j] === 0
          && map[i+mapWidth*(j+1)] === 0) {
            map[i+mapWidth*j] = 12;
          } else if (map[(i-1)+mapWidth*j] !== 0
          && map[i+mapWidth*(j-1)] === 0
          && map[(i+1)+mapWidth*j] === 0
          && map[i+mapWidth*(j+1)] !== 0) {
            map[i+mapWidth*j] = 13;
          }
        }
      }
    }
  },
  writeToMap: function writeToMap(array, mapWidth, mapHeight) {
    for (var j = 0; j < array.length; j++) {
      this.makeTerrain(array[j].x, array[j].y, array[j].width, array[j].height, mapWidth, mapHeight, array[j].color);
    }
  }
