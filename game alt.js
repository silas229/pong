// function sound(src) {
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.sound.play();
// }
//
// document.getElementById('spielername').addEventListener('focus', function() {
// 	var startSound = new sound('sounds/start.ogg');
// 	// startSound.play();
// })

if (!sessionStorage.getItem('sound') === null) {
	sessionStorage.setItem('sound', true);
}
var sound = sessionStorage.getItem('sound');
soundicon = document.getElementById("soundicon");

/**
 * Toggle sound
 * @author silas229
 * @return {void}
 */
function toggleSound() {
	if (sound) {
		sessionStorage.setItem('sound', false);
		soundicon.src = "sound-off.svg";
		sound.start.pause();
	} else {
		sessionStorage.setItem('sound', true);
		soundicon.src = "sound-on.svg";
	}
	var sound = sessionStorage.getItem('sound');
}

/**
 * Load sounds
 * @author silas229
 * @return {object}
 */
function loadSounds() {
	this.start = new Audio("sounds/start.ogg");
	this.point = new Audio("sounds/point.ogg");
	this.side = new Audio("sounds/side.ogg");
	this.paddle = new Audio("sounds/paddle.ogg");
	this.win = new Audio("sounds/win.ogg");
	this.lose = new Audio("sounds/lose.ogg");
	return this;
}
snd = loadSounds();

if (sound) snd.start.play();

var stopandgo = false;
pause = document.querySelector("#pause img");
function togglePause(){
	if(stopandgo){
		stopandgo = false;
		pause.src = "pause.svg";
	} else {
			stopandgo = true;
			pause.src = "play.svg";
	}
}

var Pong = {
	canvas: false,
	ctx: false,
	init: function() {
		Pong.canvas = document.getElementById('canvas');
		Pong.ctx = Pong.canvas.getContext('2d');

/*
		setIntervall(update,1000/30);
		Pong.canvas.addEventListener('mousemove',function(e){
			p1y=e.clientY-ph/2;
		});
*/
		var width = 16;
		Pong.dx = 2;
		Pong.dy = -2;
		Pong.x = Pong.canvas.width/2;
		Pong.y = Pong.canvas.height-30;

		window.addEventListener('keydown', function (e) {
            Pong.key = e.keyCode;
    })
    window.addEventListener('keyup', function (e) {
        Pong.key = false;
    })

		Pong.ctx.fillStyle = "white";
		Pong.ctx.strokeStyle = "white";
		Pong.ctx.lineWidth = width;

		Pong.ctx.setLineDash([width, width]);
		Pong.ctx.beginPath();
		Pong.ctx.moveTo(315,-(width/2));
		Pong.ctx.lineTo(315, 480);
		Pong.ctx.stroke();
		Pong.ctx.closePath();

		Pong.draw();
	},
	clear: function(){
    Pong.context.clearRect(0, 0, Pong.canvas.width, Pong.canvas.height);
  },
	draw: function() {
		Pong.ctx.beginPath();
		Pong.ctx.rect(Pong.x,Pong.y,20,20);
		Pong.ctx.fill();
		Pong.ctx.closePath();
		Pong.x += Pong.dx;
		Pong.y += Pong.dy;
	},
	// loop: function() {
  //   Pong.clear();
  //   myGamePiece.speedX = 0;
  //   myGamePiece.speedY = 0;
  //   if (Pong.key && Pong.key == 37) {myGamePiece.speedX = -1; }
  //   if (Pong.key && Pong.key == 39) {myGamePiece.speedX = 1; }
  //   if (Pong.key && Pong.key == 38) {myGamePiece.speedY = -1; }
  //   if (Pong.key && Pong.key == 40) {myGamePiece.speedY = 1; }
  //   myGamePiece.newPos();
  //   myGamePiece.update();
	// },
	// setInterval(loop,10);
};

// requestAnimationFrame(animate, elem);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(x, y, 10, 10);
    drawBall();
    x += dx;
    y += dy;
}

setInterval(draw, 10);

document.getElementById('nameInput').addEventListener('submit', function (event) {
	event.preventDefault();
	window.name = document.getElementById("spielername").value;
	if (window.name == '') {
		window.name = 'Spieler';
	}
	document.getElementById('name').innerHTML = window.name;
	document.getElementsByClassName('modal')[0].style.display = 'none';
	document.getElementById('pause').style.display = 'inline-block';
	snd.start.pause();
}, false);

function endGame() {
	if (!localStorage.getItem('increment')) {
		localStorage.setItem('increment', 0);
	}
	var values = {
		name: window.name,
		gewonnen: 3,
		verloren: 2,
		tore: 17,
		gegentore: 12
	};
	console.log(values);
	console.log(JSON.stringify(values));
	localStorage.setItem('game'+localStorage.getItem('increment'), JSON.stringify(values));
	localStorage.setItem('increment', parseInt(localStorage.getItem('increment')) + 1);

	return true;
}
