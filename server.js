var app = require('http').createServer()
	, io = require('socket.io').listen(app)
	, _ = require('lodash')
	, gameMap = require('./map.js')
  , gameItems = require('./items.js')

var map = new gameMap.Map();
var items = new gameItems.Items();

map.create();
map.create();
items.create();

//app.listen(process.env.PORT);

  app.listen(8000);

var players = [];
var x = 0;
var y = 0;
var tileSize = 32;
var debug = false;

io.sockets.on('connection', function (socket) {


  socket.room = 1;
  socket.join(1);
  var spawnx = Math.random()*640*16;
  var spawny = Math.random()*640*16;
  var spawnPoint = {x: spawnx, y: spawny, level:socket.room};
	var player = { id: socket.id , x: spawnPoint.x, y: spawnPoint.y, status: spawnPoint.status};
	players.push(player);

	socket.emit('playerConnected', player);
	socket.emit('getMap', map.maps, items.itemData);

  socket.broadcast.to('level1').emit('updatePlayers', [player])

	socket.on('mapCreated', function(){
		socket.emit('playerSpawn', spawnPoint);
	});

	console.log('Player Connected: ', player);
  //console.log(socket.room);
	socket.on('newPlayerPosition', function (data) {
		player.x = data.x;
		player.y = data.y;
		player.status = data.status;
    player.level = data.level;
    // console.log(data.level)
    socket.broadcast.to(data.level).emit('updatePlayers', [player])

	});
  socket.on('requestLevelChange', function (level) {
		if (map.maps.length < level) {
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


	socket.on('disconnect', function () {
		_.remove(players, function(p) {
			return p.id == player.id;
		});
		socket.broadcast.emit('removePlayer', player.id);
	});
});
