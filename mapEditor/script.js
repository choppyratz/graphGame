let canv = document.getElementById('canv');
canv.width = 900;
canv.height = 900;

let ctx = canv.getContext('2d');

let cellXCount = 10;
let cellYCount = 10;
let cellWidth = canv.width / cellXCount;
let cellHeight = canv.height / cellYCount;

let radius = 40;

for (let i = 1 ; i <= 10; i++) {
	ctx.beginPath();
	ctx.moveTo(i * cellWidth, 0);
	ctx.lineTo(i * cellWidth, canv.height);
	ctx.stroke(); 
}

for (let i = 1 ; i <= 10; i++) {
	ctx.beginPath();
	ctx.moveTo(0, i * cellHeight);
	ctx.lineTo(canv.width, i * cellHeight);
	ctx.stroke(); 
}

let gameMap = [];
let nearLine = [];
let id = 1;
$('#canv').on('click', function(e) {
	let mouseX = e.pageX - $('#canv').offset().left;
	let mouseY = e.pageY - $('#canv').offset().top;
	let indexX = Math.floor((mouseX) / cellWidth);
	let indexY = Math.floor((mouseY) / cellHeight);
	let circleX = mouseX - mouseX % cellWidth + cellWidth / 2;
	let circleY = mouseY - mouseY % cellHeight + cellHeight / 2;
	console.log(indexX , indexY);
	if (!isLinesActive) {
		ctx.beginPath();
		ctx.arc(circleX, circleY, radius,0,Math.PI*2,true);
		ctx.fill();
		// 
		let cellObj = new Cell(id, indexX, indexY, "black");
		//
		gameMap.push(cellObj);
		id++;
	}else {
		let currCell = gameMap.find(item => ((item.x == indexX) && (item.y == indexY)));
		nearLine.push(currCell);
		if (nearLine.length == 2) {
		ctx.beginPath();
		let coordinatesFirst  = getCircleCoordinates(cellWidth, cellHeight, nearLine[0].x, nearLine[0].y);
		let coordinatesSecond = getCircleCoordinates(cellWidth, cellHeight, nearLine[1].x, nearLine[1].y);
		ctx.moveTo(coordinatesFirst[0], coordinatesFirst[1]);
		ctx.lineTo(coordinatesSecond[0], coordinatesSecond[1]);
		nearLine[0].ajacentArray.push(nearLine[1].id);
		nearLine[1].ajacentArray.push(nearLine[0].id);
		ctx.stroke();
		nearLine = [];
		}
	}
	console.log(gameMap);
});

function getCircleCoordinates(cellWidth, cellHeight, x, y) {
	let coordinateX = x * cellWidth;
	let coordinateY = y * cellHeight;
	return [coordinateX + cellWidth / 2, coordinateY + cellHeight / 2];
}

function drawCircle(context, x, y, radius, deffenders, attackers) {
	context.fillStyle = "red";
	context.beginPath();
	context.arc(x, y, radius,0,2*Math.PI,true);;
	context.fill();
	context.font = "18px Arial";
	context.fillStyle = "black";
	context.fillText(attackers, x  - 5, y + 32);

	context.fillStyle = "blue";
	context.beginPath();
	context.arc(x, y, radius,0,Math.PI,true);;
	context.fill();
	context.font = "18px Arial";
	context.fillStyle = "white";
	context.fillText(deffenders, x - 6, y - 20);

	context.fillStyle = "green";
	context.beginPath();
	context.arc(x, y, radius / 2.5,0,2*Math.PI,true);;
	context.fill();
	context.font = "18px Arial";
	context.fillStyle = "black";
	context.fillText(attackers + deffenders, x - 6, y + 6);
}

function drawLine() {

}

let isLinesActive = false;
$('button').on('click', function() {
	isLinesActive = !isLinesActive;
});

let tempMap = [
	{
		id:1,
		x:2,
		y:2,
		circleX:150,
		circleY:150,
		ajacentArray: [2,3,4],
		color: "black",
		deffenders: 1,
		attackers: 4
	}, {
		id:2,
		x:5,
		y:2,
		circleX:330,
		circleY:150,
		ajacentArray: [1,3,4],
		color: "red",
		deffenders: 3,
		attackers: 2
	}, {
		id:3,
		x:5,
		y:5,
		circleX:330,
		circleY:330,
		ajacentArray: [1,2,4],
		color: "blue",
		deffenders: 4,
		attackers: 1
	}, {
		id:4,
		x:2,
		y:5,
		circleX:150,
		circleY:330,
		ajacentArray: [1,2,3],
		color: "red",
		deffenders: 5,
		attackers: 0
}];

function draw(map) {
	map.forEach(item => {
		let coordinatesSecond = getCircleCoordinates(cellWidth, cellHeight, item.x, item.y);
		item.ajacentArray.forEach(item2 => {
		console.log(item2);
		let obj = map.find(item3 => item3.id == item2);
		if (obj) {
			let coordinatesFirst = getCircleCoordinates(cellWidth, cellHeight, obj.x, obj.y);

			ctx.beginPath();
			ctx.moveTo(coordinatesSecond[0], coordinatesSecond[1]);
			ctx.lineTo(coordinatesFirst[0], coordinatesFirst[1]);
			ctx.stroke();

			drawCircle(ctx, coordinatesSecond[0], coordinatesSecond[1], radius, item.deffenders, item.attackers);
			drawCircle(ctx, coordinatesFirst[0], coordinatesFirst[1], radius, obj.deffenders, obj.attackers);
		}
		});
		drawCircle(ctx, coordinatesSecond[0], coordinatesSecond[1], radius, item.deffenders, item.attackers);
	});
	gameMap = map;
}

draw(tempMap);

class Cell {
	constructor(id, x , y, color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.ajacentArray = [];
		this.color = color;
	}
}