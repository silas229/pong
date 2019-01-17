"use strict";


/**
 * In Sound wird geladen und ueberprueft, ob er zu Beginn an oder aus ist.
 * Der Ton kann an und aus gestellt werden.
 * Das Icon aendert sich entsprechend.
 * @type {Object}
 */
var sounds = {
	icon: document.querySelector("#sound img"),
	// active: sessionStorage.getItem("sound"),
	/**
	 * Sounds werden intialisiert und geladen
	 * @return {Audio} gibt die Audio zurueck
	 */
	load: function () {
		this.start = new Audio("sounds/start.ogg");
		this.point = new Audio("sounds/point.ogg");
		this.side = new Audio("sounds/side.ogg");
		this.paddle = new Audio("sounds/paddle.ogg");
		this.win = new Audio("sounds/win.ogg");
		this.lose = new Audio("sounds/lose.ogg");
		return this;
	},
	/**
	 * active - aktiven Status des Tones ueberpruefen
	 * an = true; aus = false
	 */
	check: function () {
		if (sessionStorage.getItem("sound") === null) {
			sessionStorage.setItem("sound", true);
		}
		this.active = (sessionStorage.getItem("sound") === "true");
		console.log("Sound: " + this.active);

		if (!this.active) this.icon.src="images/sound-off.svg";

	},
	/**
	 * Sound wird geupdatet. Er wird gemutet oder mute wird aufgehoben.
	 */
	update: function () {

		snd.start.muted = !this.active;
		snd.point.muted = !this.active;
		snd.side.muted = !this.active;
		snd.paddle.muted = !this.active;
		snd.win.muted = !this.active;
		snd.lose.muted = !this.active;
	},
	/**
	 * Toggle sound
	 */
	toggle: function () {
		if (this.active) {
			sessionStorage.setItem("sound", false);
			this.active = false;
			this.icon.src = "images/sound-off.svg";
			console.log("Ton aus");
		} else {
			sessionStorage.setItem("sound", true);
			this.active = true;
			this.icon.src = "images/sound-on.svg";
			console.log("Ton an");
		}
		this.update();
	}
}

var snd = new sounds.load();

sounds.check();
sounds.update();

snd.start.play();

document.getElementById("spielername").value = sessionStorage.getItem("name");

document.getElementById("pause").addEventListener("click", function (event) {
	event.preventDefault;
	if (rounds.state < rounds.round.length) {
		this.classList.remove("restart");
		msg("&nbsp;");
		togglePause();
	} else {
		location.reload();
	}
});
document.getElementById("sound").addEventListener("click", function() {sounds.toggle();});

var stopandgo = false;
var pause = document.querySelector("#pause img");
/**
 * Toggle zwischen play und pause
 */
function togglePause(){
	if (rounds.state < rounds.round.length) {
		if(stopandgo){
			stopandgo = false;
			pause.src = "images/pause.svg";
			console.log("%cFortgefahren", "color: green");
			raf = window.requestAnimationFrame(game.draw);
		} else {
			stopandgo = true;
			pause.src = "images/play.svg";
			console.log("%cPausiert", "color: red");
			window.cancelAnimationFrame(raf);
		}
	} else {
		pause.src = "images/restart.svg";
		console.log("Neugestartet");
	}
}

//////////
// Game //
//////////

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.textAlign = "center";
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.font = "50px Bit5x3";
var raf;
var paddleHeight = 80;
var paddleWidth = 16;
var topPressed = false;
var bottomPressed = false;

/**
 * Der Ball wird gezeichnet, die Richtung kann zu Beginn eines Ballwechsels
 * zufaellig bestimmt werden, der Ball kann in einem Bereich in der Mitte starten
 * @type {Object}
 */
var ball = {
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
		this.y = canvas.height/2 - 8 + (Math.floor(Math.random() * (Math.floor(80) + Math.ceil(80))) - 80);
		this.toggleDir();
		console.log("Ball in der Mitte");
	},
	toggleDir: function() {
		if (this.vx > 0) {
			this.vx = -2 * (rounds.state + 1);
		} else {
			this.vx = 2 * (rounds.state + 1);
		}
		if (this.vy > 0) {
			this.vy = 2 * (rounds.state + 1);
		} else {
			this.vy = -2 * (rounds.state + 1);
		}
	},
	startDir: function() {
  	if ((Math.floor(Math.random() * (Math.floor(1) - Math.ceil(0) + 1)) + 0) == 1){
			return 2;
		} else {
			return -2;
		}
	}
}

/**
 * Mittellinie
 * @type {Object}
 */
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

/**
 * Spiellogik
 * @type {Object}
 */
var game = {
	//Ball startet in eine zufaellige Richtung und ctx wird neu gezeichnet (draw aufgerufen)
	start: function () {
		ball.vx = ball.startDir();
		ball.vy = ball.startDir();

		raf = window.requestAnimationFrame(game.draw);
		console.log("Spiel gestartet");

	},
	//Canvas Inhalt wird geleert
	clear: function() {
		ctx.clearRect(0,0, canvas.width, canvas.height);
	},
	//Feld wird geleert und alle Elemete neu gezeichnet
	//Kontrolle, ob Ende des Levels erreicht
	draw: function() {
		game.clear();
		// console.log("Canvas Reset");

		line.draw();
		// console.log("Mittellinie gezeichnet");

		ball.draw();
		paddlePlayer.draw();
		paddleComputer.draw();
		// console.log("Ball und Paddles gezeichnet");

		game.display();
		// console.log("Computer, Player und Runden gezeichnet");

		game.ball();
		// console.log("Ball bewegt");
		// console.log("Neuzeichnung");

		if(player.score == 10 || computer.score == 10) {
			console.log("Ende des Levels");
			game.endLevel();
			console.log("Level beendet");
		} else {
			// console.log("Spiel geht weiter");
			raf = window.requestAnimationFrame(game.draw);
		}

		// console.log("Paddles bewegen");
		game.move();
	},
	//Punktestand und Runden werden gezeichnet
	display: function() {
		computer.draw();
		player.draw()
		rounds.draw(rounds.state);
	},
	//Balllogik
	ball: function () {
		// Move ball
		ball.x += ball.vx;
		ball.y += ball.vy;

		// Bump on the side
		if (ball.y + ball.vy > canvas.height-ball.size || ball.y + ball.vy < 0) {
			snd.side.play();
			ball.vy = -ball.vy;
		}

		// Player paddle
		if (ball.x + ball.vx > canvas.width-paddleWidth-ball.size) {
			// Ball hits Player paddle
			if(paddlePlayer.pos - ball.size < ball.y && ball.y < paddlePlayer.pos + paddleHeight) {
				ball.vx *= 1.2;
				ball.vy *= 1.2;
				paddlePlayer.speed *= 1.2;
				snd.paddle.play();
				ball.vx =- ball.vx;
			// Ball missed Player paddle
			} else {
				snd.point.play();
				computer.score++;
				ball.reset();
				paddlePlayer.reset();
				paddleComputer.reset();
			}
		// Computer paddle
		} else if (ball.x + ball.vx < paddleWidth) {
			// Ball hits Computer paddle
			if(paddleComputer.pos - ball.size < ball.y && ball.y < paddleComputer.pos + paddleHeight) {
				ball.vx *= 1.2;
				ball.vy *= 1.2;
				// paddlePlayer.speed *= 1.2;
				paddleComputer.speed *= 1.2;
				snd.paddle.play();
				ball.vx =- ball.vx;
			// Ball missed Computer paddle
			} else {
				snd.point.play();
				player.score++;
				ball.reset();
				paddlePlayer.reset();
				paddleComputer.reset();
			}
		}
	},
	/**
	 * Punkte, Tore, Gegentore, Gewinn, Verlust werden aktualisiert
	 * Gewinner wird zu Ende des Spiels ermittelt
	 * Runden werden hochgezählt, falls Spiel noch nicht vorbei
	 */
	endLevel: function () {
		this.clear();

		player.goals += player.score;
		player.gegoals += computer.score;

		computer.goals += computer.score;
		computer.gegoals += player.score;

		if(player.score == 10) {
			console.log("%c" + player.name + " hat gewonnen", "color: green");
			msg(player.name + " hat gewonnen!");
			snd.win.play();
			player.won++;
			computer.lose++;
		} else {
			console.log("%cComputer hat gewonnen", "color: red");
			msg("Computer hat gewonnen!");
			snd.lose.play();
			player.lose++;
			computer.won++;
		}

		this.display();

		if (rounds.state == rounds.round.length - 1) {
			if (player.won > computer.won) {
				console.log("Ende des Spiels. " + player.name + " hat gewonnen!");
				msg("Ende des Spiels. " + player.name + " hat gewonnen!");
			} else {
				console.log("Ende des Spiels. Computer hat gewonnen!");
				msg("Ende des Spiels. Computer hat gewonnen!");
			}
			this.endGame();
		}

		console.log(rounds.state);
		rounds.state++;
		player.score = 0;
		computer.score = 0;
		console.log("Spielstand auf 0");

		togglePause();
		document.getElementById("pause").classList.add("restart");
	},
	/**
	* Spiel wird beendet
	* Werte werden in localStorage gespeichert
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
	//Paddlebewegungen von Spieler und Computer
	move: function () {
		if(bottomPressed && paddlePlayer.pos < canvas.height - paddleHeight) {
			paddlePlayer.pos += paddlePlayer.speed;
		} else if(topPressed && paddlePlayer.pos > 0) {
			paddlePlayer.pos -= paddlePlayer.speed;
		}

		// // unten
		// if(ball.y > paddleHeight/2 - ball.size/2 - 1 && ball.y < canvas.height - paddleHeight/2 - ball.size/2 + 2) {
		// 	paddleComputer.pos = ball.y - paddleHeight/2 + ball.size/2;
		// } else {
		// 	console.log("Paddle nicht bewegt");
		// }
		// // console.log("Ball "+ball.y + " Paddle "+(paddleComputer.pos + paddleHeight/2 - ball.size/2));

/**
 * Computer automatically adjusts position based on ball position, with a calculated margin of error
 * https://gist.github.com/ruffrey/1e242222aebbcd102a53
 */
		if (ball.y > paddleHeight/2 - ball.size/2 - 1 && ball.y < canvas.height - paddleHeight/2 - ball.size/2 + 2 && ball.vx < 0) {
			// difference between ball.y and paddle y
			var diff = -((paddleComputer.pos + (paddleHeight/2)) - ball.y);
			if(diff < 0 && diff < -4){
				diff = -5;
			} else if (diff > 0 && diff > 4) {
				diff = 5;
			}
			paddleComputer.pos += diff;
			if (paddleComputer.pos < 0) {
				paddleComputer.pos = 0;
			} else if (paddleComputer.pos + paddleHeight > 480) {
				paddleComputer.pos = 480 - paddleHeight;
			}
		}
	}
}

// window.addEventListener("gamepadconnected", function(e) {
//   console.log("Gamepad connected at index %d: %s. %d buttons, %d axes",
//     e.gamepad.index, e.gamepad.id,
//     e.gamepad.buttons.length, e.gamepad.axes.length);
// });

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/**
 * Aktion, wenn Taste gedrueckt
 * @param  {event} e event
 */
function keyDownHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        bottomPressed = true;
    } else if (e.code == "Space") {
			togglePause();
		}
}

/**
 * Aktion, wenn Taste losgelassen
 * @param  {event} e event
 */
function keyUpHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = false;
				console.log("Pfeiltaste Oben losgelassen");
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        bottomPressed = false;
				console.log("Pfeiltaste Unten losgelassen");
    }
}

/**
 * Paddle des Players auf der rechten Seite
 * @type {Object}
 */
var paddlePlayer = {
	pos: (canvas.height - paddleHeight)/2,
	speed: 7,
	//Paddle zeichnen
	draw: function () {
		ctx.beginPath();
		ctx.rect(canvas.width-paddleWidth, this.pos, paddleWidth, paddleHeight);
		ctx.fill();
		ctx.closePath();
	},
	//Paddle auf Startposition setzen und Geschwindigkeit an Runde anpassen
	reset: function () {
		this.pos = (canvas.height - paddleHeight)/2;
		this.speed = 7 * (rounds.state + 1);
	}
}

/**
 * Paddle des Computers auf der linken Seite
 * @type {Object}
 */
var paddleComputer = {
	pos: (canvas.height-paddleHeight)/2,
	speed: 7,
	//Paddle zeichnen
	draw: function () {
		ctx.beginPath();
    ctx.rect(0, this.pos, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
	},
	//Paddle auf Startposition setzen
	reset: function () {
		this.pos = (canvas.height-paddleHeight)/2;
		this.speed = 7 * (rounds.state + 1);
	}
}

/**
 * Zeichnen des Punktestandes
 * Eigenschaften: Punktestand, Name, gewonnene und verlorene Spiele, Tore und Gegentore
 * @type {Object}
 */
var player = {
	score: 0,
	name: "Spieler",
	won: 0,
	lose: 0,
	goals: 0,
	gegoals: 0,
	//Punktestand zeichnen
	draw: function () {
    ctx.fillText(this.score.toString(), canvas.width/4*3, 48);
		ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4*3, 100);
		ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4*3, 150);
	}
}

/**
 * Zeichnen des Punktestandes
 * Eigenschaften: Punktestand, gewonnene und verlorene Spiele, Tore und Gegentore
 * @type {Object}
 */
var computer = {
	score: 0,
	won: 0,
	lose: 0,
	goals: 0,
	gegoals: 0,
	//Punktestand zeichnen
	draw: function () {
    ctx.fillText(this.score.toString(), canvas.width/4, 48);
		ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4, 100);
		ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4, 150);
	}
}

/**
 * Runde Nr. X wird in Canvas angezeigt
 * @type {Object}
 */
var rounds = {
	state: 0,
	round: [1,2,3],
	/**
	 * Bildet aktuelle Runde ab
	 * @param  {int} nr state
	 */
	draw: function (nr) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = "4";
		ctx.strokeText("Runde "+this.round[nr].toString(), canvas.width/2, 48);
		ctx.strokeStyle = "white";
		ctx.fillText("Runde "+this.round[nr].toString(), canvas.width/2, 48);
	}
}

/**
 * Aufgerufen durch die Bestaetigung der Namenseingabe
 * Name wird ausgelesen und gespeichert und abgebildet
 * Spiel startet
 * @param  {object} event
 */
document.getElementById('nameInput').addEventListener('submit', function (event) {
	event.preventDefault();
	if (document.getElementById("spielername").value != '') {
		player.name = document.getElementById("spielername").value;
		sessionStorage.setItem("name", player.name);
	}
	document.getElementById('name').innerHTML = player.name;
	document.getElementsByClassName('modal')[0].style.display = 'none';
	document.getElementById('pause').style.display = 'inline-block';
	game.start();
	snd.start.pause();
}, false);

/**
 * Nachricht ausgeben
 * @param  {string} text Gewinner
 */
function msg(text) {
	document.getElementById("msg").innerHTML = text;
}
