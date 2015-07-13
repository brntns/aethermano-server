var app = require('http').createServer()
	, io = require('socket.io').listen(app)
	, _ = require('lodash')
	, gameMap = require('./map.js')
  , gameItems = require('./items.js')
	, gameMonster = require('./monster.js');
var Infiniteloop = require('infinite-loop');

var map = new gameMap.Map();
var items = new gameItems.Items();
var monster = new gameMonster.Monster();
var monsters = monster.monsters;
map.create();
map.create();

var monsterPerScreen = 0.1;
var monsterNum = monsterPerScreen*map.mapSize/3072;
//
//for (i = 0; i < monsterNum; i++) {
	monster.create();
//}
//console.log(monster.monsters);
items.create();
//app.listen(process.env.PORT);
app.listen(8000);

var players = [];
var x = 0;
var y = 0;

io.sockets.on('connection', function (socket) {
	// connect to level
	socket.room = 1;
	socket.join(1);
	//spawn points
	var spawnx = Math.random()*map.ret*16;//10;
	var spawny = Math.random()*map.ret*16;//640*16-10;
	var spawnPoint = {x: spawnx, y: spawny, level:socket.room};
	var player = { id: socket.id , x: spawnPoint.x, y: spawnPoint.y, status: spawnPoint.status};
	// add player
	players.push(player);
	// connect player
	socket.emit('playerConnected', player);
	//push map
	socket.emit('getMap', map.maps, items.itemData);
	//update player
  socket.broadcast.to('level1').emit('updatePlayers', [player])
	// update Spawnpoints
	socket.on('mapCreated', function(){
		socket.emit('playerSpawn', spawnPoint);
		// send Monster
		socket.emit('updateMonsters',monsters);
	});
	// update player postition
	socket.on('newPlayerPosition', function (data) {
		player.x = data.x;
		player.y = data.y;
		player.status = data.status;
    player.level = data.level;
    socket.broadcast.to(data.level).emit('updatePlayers', [player]);
	});
	socket.on('monsterSet', function(monster){
		// send Monster
		startMovement(monster);
	});
	socket.on('monsterSlashed', function(monster){
		// send Monster
		console.log(monster);
		for (var i = 0; i < monsters.length; i++) {
			if(monsters[i].id === monster.id){
				monsters[i].x = monster.x;
				monsters[i].y = monster.y;
				monsters[i].velox = monster.velox;
				monsters[i].veloy = monster.veloy;
			}
			io.sockets.emit('updateMonsters', monsters[i]);
		}
	});
	//update monsters
	socket.on('monsterUpdate', function (data) {
    console.log(data);
		for (var i = 0; i < monsters.length; i++) {
			if(monsters[i].id === data.id){
				monsters[i].x = data.x;
				monsters[i].y = data.y;
				monsters[i].velox = data.velox;
				monsters[i].veloy = data.veloy;
			}
			io.sockets.emit('updateMonsters', monsters[i]);
		}
	});
	socket.on('monsterKill', function(monster){
		console.log('killed' + monster.id)
		for (var i = 0; i < monsters.length; i++) {
			if(monsters[i].id === monster.id){
				io.sockets.emit('removeMonster', monster.id);
			}
		}
	});
	//update level
  socket.on('requestLevelChange', function (level) {
		// console.log(level);
		if (map.maps.length <= level+1) {
			map.create();
		}
    socket.leave(level);
    socket.join(level + 1);
    socket.room = level + 1;
  	socket.emit('changeLevel', {level:socket.room, map:map.maps});
  });
  socket.on('mapUpdated', function(){
    console.log('mapupdated');
    var spawnx = Math.random()*map.ret*16;
    var spawny = Math.random()*map.ret*16;
    var respawnPoint = {x: spawnx, y: spawny};
    socket.emit('playerRepawn', respawnPoint);
  });
	//disctonnect
	socket.on('disconnect', function () {
		_.remove(players, function(p) {
			return p.id == player.id;
		});
		socket.broadcast.emit('removePlayer', player.id);
	});
});
// Monster Movement Loops
function monsterMoveRight(monster){
	monster.x++;
	io.sockets.emit('updateMonsters', [monster])
	console.log(monster);
}
function startMovement(monster){
	var loop = new Infiniteloop();
	loop.add(monsterMoveRight,monster);
	loop.setInterval(150).run();
}
//block
var fs = require('fs'),
PNG = require('pngjs').PNG;

function writeImg() {
  var img = new PNG({
    filterType: 4,
    width: map.ret,
    height: map.ret
  });
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var idx = (img.width * y + x) << 2;
      // invert color
      if (map.map[x+map.ret*y] == 0){
        img.data[idx] = 255;
        img.data[idx+1] = 255;
        img.data[idx+2] = 255;
        // and reduce opacity
        img.data[idx+3] = 255;
      } else {
        img.data[idx] = 0;
        img.data[idx+1] = 0;
        img.data[idx+2] = 0;
        // and reduce opacity
        img.data[idx+3] = 255;
      }
    }
  }
  img.pack().pipe(fs.createWriteStream('out.png'));
  console.log('map.ret: '+map.ret);
}

 writeImg();
