//Initialize members
var ballSum = 36;
var ballsArr = []; //ball objects
var startButton , bottomBallColor;
var ballX , ballY , ballInterval , bottomMouseLineX = 250;
var audio = new Audio('sound/Ding.mp3');
var blackBallSound = new Audio('sound/blackBall.mp3');
var gameSpeed = 1; // 1 = fast , 100 = slow
var posY = 200, posX = 100; //position of bouncing ball
var bounce = false , changeXDirection = false; //bounce - check if ball is falling or flying and changeXDirection check left to right orientation.

//Initialize listeners and balls
window.onload = function(e){
	//Ball color will change randomicly in order to shoot different ball colors.
	/*bottomBallColor = ballColors[Math.floor(Math.random() * ballColors.length)];
	bottomBall.style.fill = bottomBallColor; //change bouncing ball color by tandom color*/
	var svg = document.getElementsByTagName('svg')[0];
	var jumpLine = 0;
	var restartLine = 0;
	var ballColor;
	for (i = 0; i < ballSum; i++) {
		if (Math.random() < 0.8)
			ballColor = "#fff";
		else
			ballColor = "#000";
		
		var ball = {id: i, x:20 + (restartLine)*40, y:20 + jumpLine*40 , color:ballColor};
		ballsArr.push(ball);

		var circle = document.createElementNS("http://www.w3.org/2000/svg","circle"); //create a circle
		circle.setAttributeNS(null,"id","ball"+i);
		circle.setAttributeNS(null,"cx",18 + (restartLine++)*40);
		circle.setAttributeNS(null,"cy",18 + jumpLine*40);
		circle.setAttributeNS(null,"r",18);
		circle.setAttributeNS(null,"stroke","#000");

		circle.setAttributeNS(null,"fill",ballColor);
		svg.appendChild(circle); //appending to SVG

		if ((i+1)%12 == 0 && i!=0){
			jumpLine++;
			restartLine = 0; 
			svg.append(document.createElement("BR")); //add new line to SVG
		}
	}
	//listeners for clicks and mouse moves
	start.addEventListener("click",moveBallInit );
	wrapper.addEventListener("mousemove", movebottomMouseLine);
	endGame.addEventListener('click', restartGame);
}

//change bottomMouseLineX dynamically by listner of mouse move.
function movebottomMouseLine(e) {
	var x = e.pageX - wrapper.offsetLeft; 
	if (x>=0 & x<=400) //check borders
		bottomMouseLine.style.left = x + "px";

	bottomMouseLineX = x;
}

//reset new game
function restartGame(){
	location.reload();
	endGame.style.visibility = 'hidden';
}

//start new game
function moveBallInit(){
	ballInterval = setInterval(moveBall,gameSpeed);
	start.style.visibility = 'hidden';
}

//check ball hit by interval on top balls and bottom line mouse pad.
function moveBall() {
	var bottomBallX = parseInt(bottomBall.style.cx);
	var bottomBallY = parseInt(bottomBall.style.cy);
	//BALL FALL - example: ball is : 310 on x axis , bottom line is 300 right corner. then it suppose to fall
	if ( bottomBallX > (bottomMouseLineX+110) && bottomBallY  >= 440 || (bottomBallX+20) < bottomMouseLineX && bottomBallY >= 440 ){
		for (var i=0; i<100; i++){
			bottomBallX = ++posX; 
			bottomBallY = ++posY; 
		}
		clearInterval(ballInterval);
		endGame.style.visibility = 'visible';
	}

	//check where the ball hits on the other balls by color and radius
	for (i = 0; i < ballsArr.length; i++) {
		var ballX = ballsArr[i].x;
		var ballY = ballsArr[i].y;

		//Circle-Circle Collision
		if(circlesCollisions(ballX,ballY,20,bottomBallX,bottomBallY,10) == true){
			var ballI = document.getElementById("ball"+i);
			//HIT!
			if (ballI  != undefined) {
				console.log(ballsArr[i]);
				ballI.parentNode.removeChild(ballI);
				ballsArr[i].x = -40;
				ballsArr[i].y = -40;
				var prevBallHit = null , nextBallHit = null , topBallHit  = null, bottomBallHit = null;
				//Black ball hit - explode round + shape ball
				if (ballsArr[i].color == "#000"){
					blackBallSound.play();
					if (document.getElementById("ball"+(i-1)) != undefined && ballsArr[i-1].id != undefined && i%12 != 0){
						prevBallHit = document.getElementById("ball"+(i-1));
						prevBallHit.parentNode.removeChild(prevBallHit);
						ballsArr[i-1].x = -40;
						ballsArr[i-1].y = -40;
					}
					if (document.getElementById("ball"+(i+1)) != undefined  && ballsArr[i+1].id != undefined &&  i%13 != 0){
						nextBallHit = document.getElementById("ball"+(i+1));
						nextBallHit.parentNode.removeChild(nextBallHit);
						ballsArr[i+1].x = -40;
						ballsArr[i+1].y = -40;
					}
					if (document.getElementById("ball"+(i-12)) != undefined && ballsArr[i-12].id != undefined  ){
						topBallHit = document.getElementById("ball"+(i-12));
						topBallHit.parentNode.removeChild(topBallHit);
						ballsArr[i-12].x = -40;
						ballsArr[i-12].y = -40;
					}
					if (document.getElementById("ball"+(i+12)) != undefined && ballsArr[i+12].id != undefined  ){
						bottomBallHit = document.getElementById("ball"+(i+12));
						bottomBallHit.parentNode.removeChild(bottomBallHit);
						ballsArr[i+12].x = -40;
						ballsArr[i+12].y = -40;
					}
				}
				else
				{
					audio.play();
				}
				/*bottomBallColor = ballColors[Math.floor(Math.random() * ballColors.length)];
				bottomBall.style.fill = bottomBallColor;*/
			}

			//if I hit a ball then go the opposit way
			if (bounce == false)
				bounce = true;
			else
				bounce = false;

			if(ballX > bottomBallX)
				changeXDirection = true;
			else
				changeXDirection = false;

		}
	}
	//change ball direction by bottomMouseLineX hit area
	var angle = 1;
	if (posY > 440){
		angle = Math.round(Math.abs((bottomMouseLineX+50) - posX) / 10);
		//check if ball got to the bottom line by Y axis
		if (changeXDirection == false){
			//ball come's from left to right
			if (posX < (bottomMouseLineX+50)){
				//ball hit on the left side of the bottomMouseLineX
				changeXDirection = true;
			} 
			else{
				//ball hit on the right side of the bottomMouseLineX
				changeXDirection = false;
			}
		}
		else{
			//ball come's from right to left side
			if (posX < (bottomMouseLineX+50)){
				//ball hit on the left side of the bottomMouseLineX
				changeXDirection = true;
			}
			else{
				//ball hit on the right side of the bottomMouseLineX
				changeXDirection = false;
			}
		}

		//change ball position when hits the bottom pad by angle
		if (posX < (bottomMouseLineX+10))
			posX = posX+angle * Math.random()*10;
		else if (posX < (bottomMouseLineX+25))
			posX = posX+angle * Math.random()*5;
		else if (posX < (bottomMouseLineX+50))
			posX = posX+angle * Math.random()*3;

		if (posX > (bottomMouseLineX+90))
			posX = posX-angle * Math.random()*10;
		else if (posX > (bottomMouseLineX+75))
			posX = posX-angle * Math.random()*5;
		else if (posX > (bottomMouseLineX+50))
			posX = posX-angle * Math.random()*3;
	}



	//Directions (changeXDirection FALSE = right +      /    bounce FALSE = down +)
	if (changeXDirection == false && bounce == false){
		bottomBall.style.cx = ++posX; 
		bottomBall.style.cy = ++posY; 
	}
	else if (changeXDirection == false && bounce == true){
		bottomBall.style.cx = ++posX; 
		bottomBall.style.cy = --posY;
	}
	else if (changeXDirection == true && bounce == false){
		bottomBall.style.cx = --posX; 
		bottomBall.style.cy = ++posY; 
	}
	else if (changeXDirection == true && bounce == true){
		bottomBall.style.cx = --posX; 
		bottomBall.style.cy = --posY; 
	}

	//Ball Border limits
	if (posX > 475)
		changeXDirection = true;
	if (posX < 20)
		changeXDirection = false;
	if (posY > 440)
		bounce = true;
	if (posY < 20)
		bounce = false;
}

//Returns true if the circles are touching, or false if they are not
function circlesCollisions(x1,y1,radius1,x2,y2,radius2){
	//compare the distance to combined radii
	var dx = x2 - x1;
	var dy = y2 - y1;
	var radii = radius1 + radius2;
	if ( ( dx * dx )  + ( dy * dy ) < radii * radii ) 
		return true;
	return false;
}
