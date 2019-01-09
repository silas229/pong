var sound = true;
soundicon = document.getElementById("soundicon");
function togglesound() {
	if (sound) {
		sound = false;
		soundicon.src = "sound-off.svg";
	} else {
		sound = true;
		soundicon.src = "sound-on.svg";
	}
}

var stopandgo = false;
pause = document.querySelector("#pause img");
function togglePause(){
	if(stopandgo){
		stopandgo = false;
		pause.src = "pause.svg";
		raf = window.requestAnimationFrame(draw);
	} else {
			stopandgo = true;
			pause.src = "play.svg";
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
var x = canvas.width/2;
var y =  canvas.height/2;
var level = 0;

var ball = {
	x: canvas.width/2,
	y: canvas.height/2,
  vx: 2,
  vy: 2,
  size: 16,
  //color: 'blue',
  draw: function() {
    ctx.beginPath();
    //ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.rect(this.x,this.y,this.size,this.size);
    ctx.closePath();
    //ctx.fillStyle = this.color;
    ctx.fill();
  },
	start: function () {
		this.x = x;
		this.y = y;
	}
};

var line = {
  width: 16,
  draw: function() {
    ctx.lineWidth = this.width;
    ctx.setLineDash([this.width, this.width]);
    ctx.beginPath();
    ctx.moveTo(x,-(this.width/2));
    ctx.lineTo(x, 480);
    ctx.stroke();
    ctx.closePath();
  }
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  line.draw();
  ball.draw();
	paddlePlayer.draw();
	paddleComputer.draw();
	//f.load().then(function() {
		scoreComputer.draw();
		scorePlayer.draw();
	//})
	rounds.draw(level);
  ball.x += ball.vx;
  ball.y += ball.vy;

  //if(ball.y + ball.vy > canvas.height-ballRadius || ball.y + ball.vy < ballRadius) {
  if (ball.y + ball.vy > canvas.height-ball.size || ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  //if(ball.x + ball.vx > canvas.width-ballRadius || ball.x + ball.vx < ballRadius) {
	if (ball.x + ball.vx > canvas.width-ball.size || (ball.x + ball.vx > canvas.width-paddleWidth && paddleY < ball.y < paddlePlayer.paddleY + paddleHeight)) {
		ball.vx = -ball.vx;
		scoreComputer.scoreC++;
		//ball.start();
	} else if (ball.x + ball.vx < 0) {
		ball.vx = -ball.vx;
		scorePlayer.scoreP++;
		//ball.start();
	}
/*
for (var i = 0; i < rounds.round.length; i++) {
	rounds.draw(i);
}
*/

	if(scorePlayer.scoreP == 10){
		alert("Player won.");
		scorePlayer.won++;
		scoreComputer.lose++;
		scorePlayer.goals += scorePlayer.scoreP;
		scorePlayer.gegoals += scoreComputer.scoreC;

		scoreComputer.goals += scoreComputer.scoreC;
		scoreComputer.gegoals += scorePlayer.scoreP;
		if (level == 0) {
			level++;
			scorePlayer.scoreP=0;
			scoreComputer.scoreC=0;
			ball.vx +=7;
			ball.vy +=4;
			ball.start();
		} else {
			alert("End Game. Player won.");
			scorePlayer.scoreP=0;
			scoreComputer.scoreC=0;
			endGame();
		}
	} else if (scoreComputer.scoreC == 10) {
		alert("Computer won.");
		scoreComputer.won++;
		scorePlayer.lose++;
		scoreComputer.goals += scoreComputer.scoreC;
		scoreComputer.gegoals += scorePlayer.scoreP;

		scorePlayer.goals += scorePlayer.scoreP;
		scorePlayer.gegoals += scoreComputer.scoreC;
		if (level == 0) {
			level++;
			scorePlayer.scoreP=0;
			scoreComputer.scoreC=0;
			ball.vx +=7;
			ball.vy +=4;
			ball.start();
		} else {
			alert("End Game. Computer won.");
			scorePlayer.scoreP=0;
			scoreComputer.scoreC=0;
			endGame();
		}
	}

	/*if(ball.x + ball.vx < ball.size) {
        ball.vx = -ball.vx;
    }
    else if(ball.x + ball.vx > canvas.width-ball.size) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            ball.vx = -ball.vx;
        }
        /*else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }*/


	if(bottomPressed && paddlePlayer.paddleY < canvas.height-paddleHeight) {
    paddlePlayer.paddleY += 7;
	} else if(topPressed && paddlePlayer.paddleY > 0) {
    	paddlePlayer.paddleY -= 7;
		}

  raf = window.requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


canvas.addEventListener('mouseover', function(e){
  raf = window.requestAnimationFrame(draw);
});


canvas.addEventListener("mouseout",function(e){
  window.cancelAnimationFrame(raf);
});


function keyDownHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        bottomPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        bottomPressed = false;
    }
}

ball.draw();

var paddlePlayer = {
	paddleY: (canvas.height-paddleHeight)/2,
	draw: function () {
		ctx.beginPath();
		ctx.rect(canvas.width-paddleWidth, this.paddleY, paddleWidth, paddleHeight);
		ctx.fill();
		ctx.closePath();
	}
}

var paddleComputer = {
	paddleC: (canvas.height-paddleHeight)/2,
	draw: function () {
		ctx.beginPath();
    ctx.rect(0, this.paddleC, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
	}
}

var scorePlayer = {
	scoreP: 0,
	won: 0,
	lose: 0,
	goals: 0,
	gegoals: 0,
	draw: function () {
    ctx.fillText(this.scoreP.toString(), canvas.width/4*3, 48);
		ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4*3, 100);
		ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4*3, 150);
	}
}

var scoreComputer = {
	scoreC: 9,
	won: 0,
	lose: 0,
	goals: 0,
	gegoals: 0,
	draw: function () {
    ctx.fillText(this.scoreC.toString(), canvas.width/4, 48);
		ctx.fillText(this.won.toString()+" : "+this.lose.toString(), canvas.width/4, 100);
		ctx.fillText(this.goals.toString()+" : "+this.gegoals.toString(), canvas.width/4, 150);
	}
}

var rounds = {
	round: [1,2],
	draw: function (nr) {
		ctx.fillText("Round "+this.round[nr].toString(), canvas.width/2, 48);
	}
}

/*-------------------------------------------------*/

document.getElementById('senden').addEventListener('click', function () {
	window.name = document.getElementById("spielername").value;
	if (window.name == '') {
		window.name = 'Spieler';
	}
	document.getElementById('name').innerHTML = window.name;
	document.getElementsByClassName('modal')[0].style.display = 'none';
	document.getElementById('pause').style.display = 'inline-block';
}, false);

function endGame() {
	if (!localStorage.getItem('increment')) {
		localStorage.setItem('increment', 0);
	}
	var values = {
		name: window.name,
		gewonnen: scorePlayer.won,
		verloren: scorePlayer.lose,
		tore: 17,
		gegentore: 12
	};
	console.log(values);
	console.log(JSON.stringify(values));
	localStorage.setItem('game'+localStorage.getItem('increment'), JSON.stringify(values));
	localStorage.setItem('increment', parseInt(localStorage.getItem('increment')) + 1);

	return true;
}
