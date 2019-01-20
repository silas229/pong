"use strict";

//https://webpack.js.org/guides/asset-management/
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
//https://webpack.js.org/guides/csp/
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
//https://www.webmasterpro.de/coding/ajax.html

///////////////
// Variables //
///////////////

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

/////////////
// Objects //
/////////////

/**
* Spiellogik
* @type {Object}
*/
var game = {
	/**
	* Ball startet in eine zufaellige Richtung und ctx wird neu gezeichnet (draw aufgerufen)
	*/
	start: function () {
		ball.vx = ball.startDir();
		ball.vy = ball.startDir();

		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);

		raf = window.requestAnimationFrame(game.draw);
		console.log("Spiel gestartet");

	},
	/**
	* Canvas Inhalt wird geleert
	*/
	clear: function() {
		ctx.clearRect(0,0, canvas.width, canvas.height);
	},
	/**
	* Feld wird geleert und alle Elemete neu gezeichnet
	* Kontrolle, ob Ende des Levels erreicht
	*/
	draw: function() {
		game.clear();

		line.draw();

		ball.draw();
		player.paddle.draw();
		computer.paddle.draw();

		game.display();

		game.ball();

		if(player.score == 10 || computer.score == 10) {
			console.log("Ende des Levels");
			game.endLevel();
			msgP(computer.won + " : " + player.won);
			console.log("Level beendet");
		} else {
			// console.log("Spiel geht weiter");
			raf = window.requestAnimationFrame(game.draw);
		}

		// console.log("Paddles bewegen");
		game.move();
	},

	/**
	* Paddlebewegungen von Spieler und Computer
	*/
	move: function () {
		if(bottomPressed && player.paddle.pos < canvas.height - paddleHeight) {
			player.paddle.pos += player.paddle.speed;
		} else if(topPressed && player.paddle.pos > 0) {
			player.paddle.pos -= player.paddle.speed;
		}

		// // unten
		// if(ball.y > paddleHeight/2 - ball.size/2 - 1 && ball.y < canvas.height - paddleHeight/2 - ball.size/2 + 2) {
		// 	computer.paddle.pos = ball.y - paddleHeight/2 + ball.size/2;
		// } else {
  	// 	console.log("Paddle nicht bewegt");
  	// }
  	// // console.log("Ball "+ball.y + " Paddle "+(computer.paddle.pos + paddleHeight/2 - ball.size/2));

  	// In der Mitte neu berechnen
  	if (ball.x <= canvas.width/2 + Math.abs(ball.vx)/2 && ball.x >= canvas.width/2 - Math.abs(ball.vx)/2) {
  		console.log("Mitte");
  		computer.paddle.prediction.variant(game.rounds.diffM[game.rounds.state]);
			// computer.paddle.prediction.variant(10);
  	}

  	if (ball.y > paddleHeight/2 - ball.size/2 - 1 && ball.y < canvas.height - paddleHeight/2 - ball.size/2 + 2 && ball.vx < 0) {
  		if (computer.paddle.pos + paddleHeight/2 - ball.size/2 + computer.paddle.speed < computer.paddle.prediction.variance || computer.paddle.pos + paddleHeight/2 - ball.size/2 > computer.paddle.prediction.variance) {
  			if (computer.paddle.pos + paddleHeight/2 - ball.size/2 >= computer.paddle.prediction.variance) {
  				computer.paddle.pos -= computer.paddle.speed;
  			} else {
  				computer.paddle.pos += computer.paddle.speed;
  			}
  		}

  		if (computer.paddle.pos < 0) {
  			computer.paddle.pos = 0;
  		} else if (computer.paddle.pos + paddleHeight > canvas.height) {
  			computer.paddle.pos = canvas.height - paddleHeight;
  		}

  		ctx.fillStyle = "yellow";
  		ctx.fillRect(paddleWidth,(computer.paddle.prediction.variance-ball.size/2),ball.size,ball.size);
  		ctx.fillStyle = "green";
  		ctx.fillRect(paddleWidth,(computer.paddle.prediction.y-ball.size/2),ball.size,ball.size);
  		ctx.fillStyle = "white";
  	}
  },

	/**
	* Runde Nr. X wird in Canvas angezeigt
	* @type {Object}
	*/
	rounds: {
		state: 0,
		round: [1,2,3],
		diffP: [80,70,50],
		diffM: [12,9,5],
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
	},

	/**
	* Punktestand und Runden werden gezeichnet
	*/
	display: function() {
		computer.draw();
		player.draw()
		this.rounds.draw(this.rounds.state);
	},

	/**
	* Balllogik
	*/
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
			if(player.paddle.pos - ball.size < ball.y && ball.y < player.paddle.pos + paddleHeight) {
				ball.vx *= 1.2;
				ball.vy *= 1.2;
				player.paddle.speed *= 1.2;
				computer.paddle.speed *= 1.2;
				snd.paddle.play();
				ball.vx =- ball.vx;
				computer.paddle.prediction.predict();
				computer.paddle.prediction.variant(game.rounds.diffP[game.rounds.state]);
				// computer.paddle.prediction.variant(80);
				// Ball missed Player paddle
			} else {
				snd.point.play();
				computer.score++;
				ball.reset();
				player.paddle.reset();
				computer.paddle.reset();
			}
			// Computer paddle
		} else if (ball.x + ball.vx < paddleWidth) {
			// Ball hits Computer paddle
			if(computer.paddle.pos - ball.size < ball.y && ball.y < computer.paddle.pos + paddleHeight) {
				ball.vx *= 1.2;
				ball.vy *= 1.2;
				player.paddle.speed *= 1.2;
				computer.paddle.speed *= 1.2;
				snd.paddle.play();
				ball.vx =- ball.vx;
				// Ball missed Computer paddle
			} else {
				snd.point.play();
				player.score++;
				ball.reset();
				player.paddle.reset();
				computer.paddle.reset();
			}
		}
	},

	/**
	* Punkte, Tore, Gegentore, Gewinn, Verlust werden aktualisiert
	* Gewinner wird zu Ende des Spiels ermittelt
	* Runden werden hochgezaehlt, falls Spiel noch nicht vorbei
	*/
	endLevel: function () {
		this.clear();

		player.goals += player.score;
		player.gegoals += computer.score;

		computer.goals += computer.score;
		computer.gegoals += player.score;

		if(player.score >= 10) {
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

		player.paddle.draw();
		computer.paddle.draw();

		if (this.rounds.state == this.rounds.round.length - 1) {
			if (player.won > computer.won) {
				console.log("Ende des Spiels. " + player.name + " hat gewonnen!");
				msg("Ende des Spiels. " + player.name + " hat gewonnen!");
			} else {
				console.log("Ende des Spiels. Computer hat gewonnen!");
				msg("Ende des Spiels. Computer hat gewonnen!");
			}
			this.endGame();
		}

		console.log(this.rounds.state);
		this.rounds.state++;
		player.score = 0;
		computer.score = 0;
		console.log("Spielstand auf 0");

		pause.toggle();
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
	}
}

/**
 * Der Ball wird gezeichnet, die Richtung kann zu Beginn eines Ballwechsels
 * zufaellig bestimmt werden, der Ball kann in einem Bereich in der Mitte starten
 * @type {Object}
 */
var ball = {
  size: 16,
	x: canvas.width/2 - 8,
	y: canvas.height/2 - 8,
	// x: canvas.width - paddleWidth,
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
			this.vx = -2 * (game.rounds.state + 1);
			computer.paddle.prediction.predict();
			computer.paddle.prediction.variant(game.rounds.diffM[game.rounds.state]);
			// computer.paddle.prediction.variant(10);
		} else {
			this.vx = 2 * (game.rounds.state + 1);
		}
		if (this.vy > 0) {
			this.vy = 2 * (game.rounds.state + 1);
		} else {
			this.vy = -2 * (game.rounds.state + 1);
		}
	},
	startDir: function() {
  	if ((Math.floor(Math.random() * (Math.floor(1) - Math.ceil(0) + 1)) + 0) == 1){
			return 2;
		} else {
			computer.paddle.prediction.variant(game.rounds.diffM[game.rounds.state]);
			// computer.paddle.prediction.variant(10);
			computer.paddle.prediction.predict();
			return -2;
		}
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
	/**
	 * Punktestand zeichnen
	 */
	draw: function () {
    ctx.fillText(this.score.toString(), canvas.width/4*3, 48);
		// ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4*3, 100);
		// ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4*3, 150);
	},
	/**
	 * Paddle des Players auf der rechten Seite
	 * @type {Object}
	 */
	paddle: {
		pos: (canvas.height - paddleHeight)/2,
		speed: 7,
		/**
		 * Paddle zeichnen
		 */
		draw: function () {
			ctx.beginPath();
			ctx.rect(canvas.width-paddleWidth, this.pos, paddleWidth, paddleHeight);
			ctx.fill();
			ctx.closePath();
		},
		/**
		 * Paddle auf Startposition setzen und Geschwindigkeit an Runde anpassen
		 */
		reset: function () {
			this.pos = (canvas.height - paddleHeight)/2;
			this.speed = 7 * (game.rounds.state + 1);
		}
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
	/**
	 * Punktestand zeichnen
	 */
	draw: function () {
    ctx.fillText(this.score.toString(), canvas.width/4, 48);
		// ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4, 100);
		// ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4, 150);
	},
	/**
	 * Paddle des Computers auf der linken Seite
	 * @type {Object}
	 */
	paddle: {
		pos: (canvas.height-paddleHeight)/2,
		speed: 4,
		/**
		 * Paddle zeichnen
		 */
		draw: function () {
			ctx.beginPath();
			ctx.rect(0, this.pos, paddleWidth, paddleHeight);
			ctx.fill();
			ctx.closePath();
		},
		/**
		 * Paddle auf Startposition setzen
		 */
		reset: function () {
			this.pos = (canvas.height-paddleHeight)/2;
			this.speed = 4 * (game.rounds.state + 1);
		},
		prediction: {
			/**
			 * Predict ball position for computer
			 */
			predict: function () {
				this.x = ball.x;
				this.y = ball.y;
				this.vx = ball.vx;
				this.vy = ball.vy;
				while (this.x + this.vx >= paddleWidth && ball.vx < 0) {
					this.x += this.vx;
					this.y += this.vy;
					if (this.y + this.vy > canvas.height-ball.size || this.y + this.vy < 0) {
						this.vy = -this.vy;
					}
				}
			},
			/**
			 * Calculate variance
			 * @param  {int|double} multi
			 */
			variant: function (multi) {
				this.variance = this.y + this.rnd(-((game.rounds.state+1) * multi * Math.abs(ball.vx)), (game.rounds.state+1) * multi * Math.abs(ball.vx));
        // this.variance = this.y + this.rnd(-((multi * Math.abs(ball.vx)) / game.rounds.state+1), multi * Math.abs(ball.vx) / game.rounds.state+1);
        console.log(Math.abs(this.variance-this.y));
			},
			/**
			* Returns random value
			* @param  {int|double} min
			* @param  {int|double} max
			* @return {double}
			*/
			rnd: function (min, max) {
					return (Math.random() * (max - min)) + min;
			}
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
		this.start = new Audio("../sounds/start.ogg");
		this.point = new Audio("../sounds/point.ogg");
		this.side = new Audio("../sounds/side.ogg");
		this.paddle = new Audio("../sounds/paddle.ogg");
		this.win = new Audio("../sounds/win.ogg");
		this.lose = new Audio("../sounds/lose.ogg");
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

		if (!this.active) this.icon.src="../images/sound-off.svg";

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
			this.icon.src = "../images/sound-off.svg";
			console.log("Ton aus");
		} else {
			sessionStorage.setItem("sound", true);
			this.active = true;
			this.icon.src = "../images/sound-on.svg";
			console.log("Ton an");
		}
		this.update();
	}
}

var pause = {
  state: false,
  icon: document.querySelector("#pause img"),
  /**
   * Toggle zwischen Play und Pause
   */
  toggle: function () {
    if (game.rounds.state < game.rounds.round.length) {
  		if(this.state){
  			this.state = false;
  			this.icon.src = "../images/pause.svg";
  			console.log("%cFortgefahren", "color: green");
  			raf = window.requestAnimationFrame(game.draw);
  		} else {
  			this.state = true;
  			this.icon.src = "../images/play.svg";
  			console.log("%cPausiert", "color: red");
  			window.cancelAnimationFrame(raf);
  		}
  	} else {
  		this.icon.src = "../images/restart.svg";
  	}
  }
}


///////////////
// Functions //
///////////////

/**
 * Nachricht ausgeben
 * @param  {string} text Gewinner
 */
function msg(text) {
	document.getElementById("msg").innerHTML = text;
}

/**
 * Nachricht ausgeben
 * @param  {string} text Gewinner
 */
function msgP(text) {
	document.getElementById("msgPoints").innerHTML = text;
}

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
			pause.toggle();
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


////////////////////
// Event Listener //
////////////////////

/**
 * Sound button clicked
 */
document.getElementById("sound").addEventListener("click", function() {
  sounds.toggle();}
);

/**
 * Pause button clicked
 * @param  {Object} event
 */
document.getElementById("pause").addEventListener("click", function (event) {
  event.preventDefault;
  if (game.rounds.state < game.rounds.round.length) {
    this.classList.remove("restart");
		msg("&nbsp;");
    pause.toggle();
  } else {
    location.reload();
  }
});

/**
 * Aufgerufen durch die Bestaetigung der Namenseingabe
 * Name wird ausgelesen und gespeichert und abgebildet
 * Spiel startet
 * @param  {Object} event
 */
document.getElementById('nameInput').addEventListener('submit', function (event) {
	event.preventDefault();
	if (document.getElementById("spielername").value != '') {
		player.name = document.getElementById("spielername").value;
		sessionStorage.setItem("name", player.name);
	}
	document.getElementById('name').innerHTML = player.name;
	document.getElementsByClassName('modal')[0].style.display = 'none';
	document.getElementById("spielername").blur();
	document.getElementById('pause').style.display = 'inline-block';
	game.start();
	msgP(computer.won + " : " + player.won);
	snd.start.pause();
}, false);

document.getElementById("spielername").value = sessionStorage.getItem("name");

var snd = new sounds.load();

sounds.check();
sounds.update();

snd.start.play();
