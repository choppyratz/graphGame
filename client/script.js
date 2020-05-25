let canv = document.getElementById('canv');
canv.width = 900;
canv.height = 900;

let ctx = canv.getContext('2d');

let cellXCount = 10;
let cellYCount = 10;
let cellWidth = canv.width / cellXCount;
let cellHeight = canv.height / cellYCount;

let radius = 40;

let gameMap = [];
let components = [];
let nearLine = [];
let id = 1;

let isClickedVertex = false;
$('#canv').on('click', function(e) {
	draw(gameMap);
	let mouseX = e.pageX - $('#canv').offset().left;
	let mouseY = e.pageY - $('#canv').offset().top;
	let indexX = Math.floor((mouseX) / cellWidth);
	let indexY = Math.floor((mouseY) / cellHeight);
	let circleX = mouseX - mouseX % cellWidth + cellWidth / 2;
	let circleY = mouseY - mouseY % cellHeight + cellHeight / 2;

	let currCell = gameMap.find(item => ((item.x == indexX) && (item.y == indexY)));
	if (currCell && !isClickedVertex) {
		currCell.ajacentArray.forEach(function(elem) {
			let dotCell = gameMap.find(item2 => (item2.id == elem));
			switch (dotCell.type) {
				case 1:
						let coordinates = getCircleCoordinates(cellWidth, cellHeight, dotCell.x, dotCell.y);
						ctx.strokeStyle = "green";
						let oldL = ctx.lineWidth;
						ctx.lineWidth = 5;
						ctx.beginPath();
						ctx.arc(coordinates[0], coordinates[1], radius + 6,0,2*Math.PI,true);
						ctx.stroke();
						isClickedVertex = true;
						ctx.lineWidth  = oldL;
						addVertexButton(ctx, dotCell, "attacker");
						addVertexButton(ctx, dotCell, "defender");
				break;
				case 2:
				break;
				case 3:
				break;
			}
		});
	}
});

function findComponentByCoordinates(componentArray, x, y) {
	componentArray.forEach(item => {
		if (isMouseInComponent(item, x, y)) {

		}
	});
}

function isMouseInComponent(component, x, y) {

}

function addVertexButton(context,vertexObj, role) {
	switch (role) {
		case "attacker":
		break;
		case "defender":
		break;
	}
	let obj = new VertexButton();
	context.beginPath();
}

function getCircleCoordinates(cellWidth, cellHeight, x, y) {
	let coordinateX = x * cellWidth;
	let coordinateY = y * cellHeight;
	return [coordinateX + cellWidth / 2, coordinateY + cellHeight / 2];
}

function drawCircle(context, x, y, radius, deffenders, attackers, circleType) {
	switch (circleType) {
		case 1:
			context.fillStyle = "red";
			context.beginPath();
			context.arc(x, y, radius,0,2*Math.PI,true);
			context.fill();
			context.font = "18px Arial";
			context.fillStyle = "black";
			context.fillText(attackers, x  - 5, y + 32);
		
			context.fillStyle = "blue";
			context.beginPath();
			context.arc(x, y, radius,0,Math.PI,true);
			context.fill();
			context.font = "18px Arial";
			context.fillStyle = "white";
			context.fillText(deffenders, x - 6, y - 20);
		
			context.fillStyle = "green";
			context.beginPath();
			context.arc(x, y, radius / 2.5,0,2*Math.PI,true);
			context.fill();
			context.font = "18px Arial";
			context.fillStyle = "black";
			context.fillText(attackers + deffenders, x - 6, y + 6);
		break;
		case 2:
			context.fillStyle = "red";
			context.beginPath();
			context.arc(x, y, radius,0,2*Math.PI,true);;
			context.fill();
		break;
		case 3:
			context.fillStyle = "black";
			context.beginPath();
			context.arc(x, y, radius,0,2*Math.PI,true);;
			context.fill();
		break;

	}
}

function drawLine() {

}

function update() {

}

setInterval(update, 1000 / 60);

let isLinesActive = false;
$('button').on('click', function() {
	isLinesActive = !isLinesActive;
});

let tempMap = [
	{
		id:1,
		x:2,
		y:2,
		ajacentArray: [2,3,4],
		deffenders: 1,
		attackers: 4,
		type: 1
	}, {
		id:2,
		x:5,
		y:2,
		ajacentArray: [1,3,4],
		deffenders: 3,
		attackers: 2,
		type: 1
	}, {
		id:3,
		x:5,
		y:5,
		ajacentArray: [1,2,4],
		deffenders: 4,
		attackers: 1,
		type: 3
	}, {
		id:4,
		x:2,
		y:5,
		ajacentArray: [1,2,3],
		deffenders: 5,
		attackers: 2,
		type: 1
}];

function draw(map) {
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.strokeStyle = "black";
	ctx.strokeWidth = 1;
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

			drawCircle(ctx, coordinatesSecond[0], coordinatesSecond[1], radius, item.deffenders, item.attackers, item.type);
			drawCircle(ctx, coordinatesFirst[0], coordinatesFirst[1], radius, obj.deffenders, obj.attackers, obj.type);
		}
		});
		drawCircle(ctx, coordinatesSecond[0], coordinatesSecond[1], radius, item.deffenders, item.attackers, item.type);
	});
	gameMap = map;
}

draw(tempMap);

class Cell {
	constructor(id, x , y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.ajacentArray = [];
	}
}

class VertexButton {
	constructor(id, vertexId, x, y) {
		this.id = id;
		this.vertexId = vertexId;
		this.x = x;
		this.y = y;
	}
}