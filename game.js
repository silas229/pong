// "use strict";

if (!sessionStorage.getItem('sound') === null) {
	sessionStorage.setItem('sound', true);
}
var sound = sessionStorage.getItem('sound');
var soundicon = document.getElementById("soundicon");

document.getElementById("pause").addEventListener("click", function (event) {
	event.preventDefault;
	this.classList.remove("restart");
	msg("&nbsp;");
	toggleSound();
})

/**
 * Toggle sound
 * @author silas229
 * @return {void}
 */
function toggleSound() {
	if (sound) {
		sessionStorage.setItem('sound', false);
		soundicon.src = "sound-off.svg";
		console.log("Ton aus.");
		sound.reset.pause();
	} else {
		sessionStorage.setItem('sound', true);
		soundicon.src = "sound-on.svg";
		console.log("Ton an.");
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
		console.log("Pause.");
		raf = window.requestAnimationFrame(game.draw);
	} else {
			stopandgo = true;
			pause.src = "play.svg";
			console.log("Start.");
			window.cancelAnimationFrame(raf);
	}
}

/*---------------------------------------------------------*/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.textAlign = "center";
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.font = "50px Bit5x3";
//ctx.font = 'bit5x3';
//let f = new FontFace('bit5x3', 'bit5x3.tff');
var raf;
var paddleHeight = 80;
var paddleWidth = 16;
var topPressed = false;
var bottomPressed = false;

var game = {
	start: function() {
	console.log("Spiel gestartet.");
		raf = window.requestAnimationFrame(game.draw);
	}//,
	// stop: function() {
	// console.log("Spiel gestoppt.");
	// 	window.cancelAnimationFrame(raf);
	// }
}

var ball = {
  // vx: function(){this.startDir();},
	// vy: function(){this.startDir();},
	vx: 2,
	vy: -2,
  size: 16,
	x: canvas.width/2 - 8,
	y: canvas.height/2 -8,
  draw: function() {
    ctx.beginPath();
    ctx.rect(this.x,this.y,this.size,this.size);
    ctx.closePath();
    ctx.fill();
  },
	reset: function () {
		this.x = canvas.width/2 - 8;
		this.y = canvas.width/2 - 8;
		this.toggleDir();
		console.log("Ball in der Mitte.");
	},
	toggleDir: function() {
		if (this.vx > 0) {
			this.vx = -2;
		} else {
			this.vx = 2;
		}
		if (this.vy > 0) {
			this.vy = 2;
		} else {
			this.vy = -2;
		}
	},
	// startDir: function() {
  // 	if ((Math.floor(Math.random() * (Math.floor(1) - Math.ceil(0) + 1)) + 0) == 1){
	// 		return 2;
	// 	} else {
	// 		return -2;
	// 	}
	// }
}

var line = {
  width: 16,
  draw: function() {
    ctx.lineWidth = this.width;
    ctx.setLineDash([this.width, this.width]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,-(this.width/2));
    ctx.lineTo(canvas.width/2, 480);
    ctx.stroke();
    ctx.closePath();
  }
}

var game = {
	init: function() {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		line.draw();
	},
	draw: function() {
		game.init();
		// console.log("Feld reset und Mittellinie gezeichnet.");

		ball.draw();
		paddlePlayer.draw();
		paddleComputer.draw();
		// console.log("Ball und Paddles gezeichnet.");

		game.display();
		// console.log("Computer, Player und Runden gezeichnet.");

		game.ball();
		// console.log("Ball bewegt.");
		console.log("Neuzeichnung.");

		if(player.score == 10 || computer.score == 10) {
			console.log("Ende des Levels.");
			game.endLevel();
			console.log("Level beendet.");
		} else {
			console.log("Spiel geht weiter.");
			raf = window.requestAnimationFrame(game.draw);
		}

		// console.log("Paddles bewegen.");
		game.controls();
	},
	display: function() {
		computer.draw();
		player.draw()
		rounds.draw(rounds.state);
	},
	ball: function () {
		ball.x += ball.vx;
		ball.y += ball.vy;
		if (ball.y + ball.vy > canvas.height-ball.size || ball.y + ball.vy < 0) {
			snd.side.play();
			ball.vy = -ball.vy;
		}
		if (ball.x + ball.vx > canvas.width-paddleWidth-ball.size) {
			if(paddlePlayer.pos - ball.size < ball.y && ball.y < paddlePlayer.pos + paddleHeight) {
				ball.vx *= 1.2;
				ball.vy *= 1.2;
				snd.paddle.play();
				ball.vx =- ball.vx;
			} else {
				snd.point.play();
				computer.score++;
				ball.reset();
			}
		} else if (ball.x + ball.vx < paddleWidth) {
			if(paddleComputer.pos - ball.size < ball.y && ball.y < paddleComputer.pos + paddleHeight) {
				ball.vx *= 1.2;
				ball.vy *= 1.2;
				snd.paddle.play();
				ball.vx =- ball.vx;
			} else {
				snd.point.play();
				player.score++;
				ball.reset();
			}
		}
	},
	endLevel: function () {
		this.init();

		player.goals += player.score;
		player.gegoals += computer.score;

		computer.goals += computer.score;
		computer.gegoals += player.score;

		if(player.score == 10) {
			console.log(player.name + " hat gewonnen.");
			msg(player.name + " hat gewonnen!");
			snd.win.play();
			player.won++;
			computer.lose++;
		} else {
			console.log("Computer hat gewonnen.");
			msg("Computer hat gewonnen!");
			snd.lose.play();
			player.lose++;
			computer.won++;
		}

		this.display();

		if (rounds.state == 2) {
			if (player.won > computer.won) {
				console.log("Ende des Spiels. " + player.name + " hat gewonnen!");
				msg("Ende des Spiels. " + player.name + " hat gewonnen!");
			} else {
				console.log("Ende des Spiels. Computer hat gewonnen!");
				msg("Ende des Spiels. Computer hat gewonnen!");
			}
			console.log("Ende des Spiels.");
			this.endGame();
		}

		console.log(rounds.state);
		rounds.state++;
		player.score = 0;
		computer.score = 0;
		console.log("Spielstand auf 0.");

		togglePause();
		document.getElementById("pause").classList.add("restart");
	},
	/**
	* Ends a game
	* @author silas229
	*/
	endGame: function() {
		if (!localStorage.getItem('increment')) {
			localStorage.setItem('increment', 0);
		}
		var values = {
			name: player.name,
			gewonnen: player.won,
			verloren: player.lose,
			tore: player.goals,
			gegentore: player.gegoals
		};
		console.log(values);
		console.log(JSON.stringify(values));
		localStorage.setItem('game'+localStorage.getItem('increment'), JSON.stringify(values));
		localStorage.setItem('increment', parseInt(localStorage.getItem('increment')) + 1);
	},
	controls: function () {
		if(bottomPressed && paddlePlayer.pos < canvas.height-paddleHeight) {
			paddlePlayer.pos += 7;
		} else if(topPressed && paddlePlayer.pos > 0) {
			paddlePlayer.pos -= 7;
		}
	}
}

// window.addEventListener("gamepadconnected", function(e) {
//   console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
//     e.gamepad.index, e.gamepad.id,
//     e.gamepad.buttons.length, e.gamepad.axes.length);
// });

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = true;
				console.log("Pfeil nach oben.");
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        bottomPressed = true;
				console.log("Pfeil nach unten.");
    }
}

function keyUpHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = false;
				console.log("Pfeil nach oben losgelassen.");
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        bottomPressed = false;
				console.log("Pfeil nach unten losgelassen.");
    }
}

var paddlePlayer = {
	pos: (canvas.height-paddleHeight)/2,
	draw: function () {
		ctx.beginPath();
		ctx.rect(canvas.width-paddleWidth, this.pos, paddleWidth, paddleHeight);
		ctx.fill();
		ctx.closePath();
	}
}

var paddleComputer = {
	pos: (canvas.height-paddleHeight)/2,
	draw: function () {
		ctx.beginPath();
    ctx.rect(0, this.pos, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
	}
}

var player = {
	score: 9,
	name: "Spieler",
	won: 0,
	lose: 0,
	goals: 0,
	gegoals: 0,
	draw: function () {
    ctx.fillText(this.score.toString(), canvas.width/4*3, 48);
		ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4*3, 100);
		ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4*3, 150);
	}
}

var computer = {
	score: 0,
	won: 0,
	lose: 0,
	goals: 0,
	gegoals: 0,
	draw: function () {
    ctx.fillText(this.score.toString(), canvas.width/4, 48);
		ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4, 100);
		ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4, 150);
	}
}

var rounds = {
	state: 0,
	round: [1,2,3],
	draw: function (nr) {
		ctx.fillText("Runde "+this.round[nr].toString(), canvas.width/2, 48);
	}
}

/*-------------------------------------------------*/

document.getElementById('nameInput').addEventListener('submit', function (event) {
	event.preventDefault();
	if (document.getElementById("spielername").value != '') {
		player.name = document.getElementById("spielername").value;
	}
	document.getElementById('name').innerHTML = player.name;
	document.getElementsByClassName('modal')[0].style.display = 'none';
	document.getElementById('pause').style.display = 'inline-block';
	window.requestAnimationFrame(game.draw);
}, false);

/**
 * Nachricht ausgeben
 * @author silas229
 * @param  {string} text [description]
 */
function msg(text) {
	document.getElementById("msg").innerHTML = text;
}
