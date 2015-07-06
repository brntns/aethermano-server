var app = require('http').createServer()
	, io = require('socket.io').listen(app)
	, _ = require('lodash')
	, gameMap = require('./map.js')
  , gameItems = require('./items.js')
	, gameMonster = require('./monster.js')

var map = new gameMap.Map();
var items = new gameItems.Items();
var monster = new gameMonster.Monster();

map.create();
map.create();
monster.create();
monster.create();
monster.create();
monster.create();
items.create();


app.listen(process.env.PORT);

//  app.listen(8000);


var players = [];
var x = 0;
var y = 0;
var monsterSpawns = [{
	x:50, y: 10000
},{
	x: 50, y: 7500
},{
	x: 50, y: 5000
},{
	x: 50, y: 2500
}];

io.sockets.on('connection', function (socket) {
	// connect to level
	socket.room = 1;
	socket.join(1);
	//spawn points
  var spawnx = Math.random()*640*16;//10;
  var spawny = Math.random()*640*16;//640*16-10;
  var spawnPoint = {x: spawnx, y: spawny, level:socket.room};
	var player = { id: socket.id , x: spawnPoint.x, y: spawnPoint.y, status: spawnPoint.status};
	// add player
	players.push(player);
	// connect player
	socket.emit('playerConnected', player);
	//push map
	socket.emit('getMap', map.maps, monster.monsters,items.itemData);
	//update player
  socket.broadcast.to('level1').emit('updatePlayers', [player])
	// update Spawnpoints
	socket.on('mapCreated', function(){
		socket.emit('playerSpawn', spawnPoint);
		socket.emit('monsterSpawns', monsterSpawns);
	});
	//console.log('Player Connected: ', player);
	// update player postition
	socket.on('newPlayerPosition', function (data) {
		player.x = data.x;
		player.y = data.y;
		player.status = data.status;
    player.level = data.level;
    // console.log(data.level)
    socket.broadcast.to(data.level).emit('updatePlayers', [player])
	});
	//update monsters
	socket.on('monsterUpdate', function (data) {
    // console.log(data.level)
    socket.broadcast.to(data.level).emit('updateMonsters', [monster])
	});
	//update level
  socket.on('requestLevelChange', function (level) {
		console.log(level);
		console.log(map.maps.length);
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
    var spawnx = Math.random()*640*16;
    var spawny = Math.random()*640*16;
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
