var app = require('http').createServer()
	, io = require('socket.io').listen(app)
	, _ = require('lodash')
	, gameWorld = require('./world/world.js')



var world = new gameWorld.World();
world.create();
//map.create();




app.listen(process.env.PORT);



var players = [];
var x = 0;
var y = 0;

io.sockets.on('connection', function (socket) {
	// connect to level
	socket.room = 1;
	socket.join(1);
	//spawn points
	var spawnx = 10;//Math.floor(0.4*Math.random()*map.mapWidth*16+0.3*map.mapWidth);
	var spawny = 10;//Math.floor(0.4*Math.random()*map.mapHeight*16+0.3*map.mapHeight);
	var spawnPoint = {x: spawnx, y: spawny, level:socket.room};
	var player = { id: socket.id , x: spawnPoint.x, y: spawnPoint.y, status: 0, class: 1000};
	// add player
	players.push(player);
	// connect player
	socket.emit('playerConnected', [player]);
	//push map
	socket.emit('getMap', world.maps);
	//update player
  	socket.broadcast.to('level1').emit('updatePlayers', [player])
	// update Spawnpoints
	socket.on('mapCreated', function(){
		socket.emit('playerSpawn', spawnPoint);
		// send Monster
	//	socket.emit('updateMonsters',monsters);
	});
	// update player postition
	socket.on('newPlayerPosition', function (data) {
		player.x = data.x;
		player.y = data.y;
		player.status = data.status;
		player.level = data.level;
		player.class = data.class;
		socket.broadcast.to(data.level).emit('updatePlayers', [player]);
	});
	socket.on('userChat', function(data){
			io.sockets.emit('updateChat', data);
	});
	socket.on('monsterSet', function(monster){
		// send Monster
		startMovement(monster);
	});
	socket.on('monsterSlashed', function(monster){
		// send Monster
		//
		// for (var i = 0; i < monsters.length; i++) {
		// 	if(monsters[i].id === monster.id){
		// 		// monsters[i].x = monster.x;
		// 		// monsters[i].y = monster.y;
		// 		monsters[i].velox = monster.velox;
		// 		monsters[i].veloy = monster.veloy;
		// 		monsters[i].hp = monster.hp;
		// 	}
		// 	io.sockets.emit('updateMonsters', monsters[i]);
		//
		// }
		// 	console.log('All Monsters:' + JSON.stringify(monsters));
					socket.broadcast.emit('updateMonsters', monster);
	});
	//update monsters
	socket.on('monsterUpdate', function (data) {
    // console.log('updating:' + JSON.stringify(data));
		// for (var i = 0; i < monsters.length; i++) {
		// 	if(monsters[i].id === data.id){
		// 		monsters[i].x = data.x;
		// 		monsters[i].y = data.y;
		// 		monsters[i].velox = data.velox;
		// 		monsters[i].veloy = data.veloy;
		// 		monsters[i].hp = data.hp;
		// 		monsters[i].aggro = data.aggro;
		// 	}
			socket.broadcast.emit('updateMonsters', data);
		//}
	});

	socket.on('monsterKill', function(monster){
		// console.log('killed' + monster.id)
		// 	_.remove(monsters, function(m) {
		// 		return m.id == monster.id;
		// 	});
				io.sockets.emit('removeMonster', monster.id);

	});
	socket.on('requestMonster', function(data){
		monster.spawn(data);
  	io.sockets.emit('updateMonsters',monsters);
  });
	socket.on('buildLadder', function(data){
		socket.broadcast.emit('buildLadder',data);
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
	var spawnx = 10;//Math.floor(0.4*Math.random()*map.mapWidth*16+0.3*map.mapWidth);
	var spawny = 10;//Math.floor(0.4*Math.random()*map.mapHeight*16+0.3*map.mapHeight);
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

//block
// var fs = require('fs'),
// PNG = require('pngjs').PNG;
// var colormap = require('./colormap');
//
// function writeImg() {
//   var img = new PNG({
//     filterType: 4,
//     width: map.ret,
//     height: map.ret
//   });
//   for (var y = 0; y < img.height; y++) {
//     for (var x = 0; x < img.width; x++) {
//       var idx = (img.width * y + x) << 2;
//       // invert color
//       var colourN = 0;
//       if (map.map[x+map.ret*y] < 69){
//       	colourN = map.map[x+map.ret*y]
//         img.data[idx] = colormap[colourN].r;
//         img.data[idx+1] = colormap[colourN].g;
//         img.data[idx+2] = colormap[colourN].b;
//         // and reduce opacity
//         img.data[idx+3] = 255;
//       } else {
//       	colourN = map.map[x+map.ret*y] - 34;
//         img.data[idx] = colormap[colourN].r;
//         img.data[idx+1] = colormap[colourN].g;
//         img.data[idx+2] = colormap[colourN].b;
//         // and reduce opacity
//         img.data[idx+3] = 255;
//       }
//     }
//   }
//   img.pack().pipe(fs.createWriteStream('out.png'));
//   console.log('map.ret: '+map.ret);
// }


// // Monster Movement Loops
// function monsterMoveRight(monster){
// 	monster.x++;
// 	io.sockets.emit('updateMonsters', [monster])
// 	console.log(monster);
// }
// function startMovement(monster){
// 	var loop = new Infiniteloop();
// 	loop.add(monsterMoveRight,monster);
// 	loop.setInterval(150).run();
// }
//block
// var fs = require('fs'),
// PNG = require('pngjs').PNG;
//
// function writeImg() {
//   var img = new PNG({
//     filterType: 4,
//     width: map.ret,
//     height: map.ret
//   });
//   for (var y = 0; y < img.height; y++) {
//     for (var x = 0; x < img.width; x++) {
//       var idx = (img.width * y + x) << 2;
//       // invert color
//       if (map.map[x+map.ret*y] == 0){
//         img.data[idx] = 255;
//         img.data[idx+1] = 255;
//         img.data[idx+2] = 255;
//         // and reduce opacity
//         img.data[idx+3] = 255;
//       } else {
//         img.data[idx] = 0;
//         img.data[idx+1] = 0;
//         img.data[idx+2] = 0;
//         // and reduce opacity
//         img.data[idx+3] = 255;
//       }
//     }
//   }
//   img.pack().pipe(fs.createWriteStream('out.png'));
//   console.log('map.ret: '+map.ret);
// }
//
//  writeImg();
//
