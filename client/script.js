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
let nearLine = [];
let id = 1;

let parentId;
let parentCellCount;
let tempCountArr = [];
let isClickedVertex = false;
$('#canv').on('click', function(e) {
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
			let coordinates = getCircleCoordinates(cellWidth, cellHeight, dotCell.x, dotCell.y);

			if (currCell.type == 1) {
				isClickedVertex = true;
				dotCell.isChecked = true;
				parentId = currCell.id; 
				parentCellCount = currCell.count;
			}
		});
	}else {
		if (currCell.isChecked) {
			let tempCell = tempCountArr.find(item => (item.id == currCell.id));
			if (parentCellCount > 0) {
				if (tempCell) {
					if (tempCell.type == 2) {
						tempCell.futureAddingCount--;
					}else {
						tempCell.futureAddingCount++;
					}
				}else {
					if (currCell.type == 2) {
						tempCountArr.push({id:currCell.id, futureAddingCount: -1, type: currCell.type});
					}else {
						tempCountArr.push({id:currCell.id, futureAddingCount: 1, type: currCell.type});
					}
				}
				parentCellCount--;
			}
			console.log(tempCountArr);
			//isClickedVertex = false;
		}
	}
});

$('#accept').on('click', function() {
	gameMap.forEach(function(elem) {
		if (elem.id == parentId) {
			elem.count = parentCellCount;
			if (parentCellCount == 0) {
				elem.type = 3;
			}
		}
		let tempCell = tempCountArr.find(item => (item.id == elem.id));
		if (tempCell) {
			elem.count += tempCell.futureAddingCount;
			if ((elem.type == 3) && (elem.count > 0)) {
				elem.type = 1;
				//continue;
			}
			if ((elem.type == 2) && (elem.count < 0)) {
				elem.type = 1;
				elem.count = -elem.count;
			}

			if ((elem.type == 2) && (elem.count == 0)) {
				elem.type = 3;
			}
		}
	});

	tempCountArr = [];
	parentCellCount = 0;
	parentId = -1;
	isClickedVertex = false;

});

$('#cancel').on('click', function() {
	isClickedVertex = false;
});

function getCircleCoordinates(cellWidth, cellHeight, x, y) {
	let coordinateX = x * cellWidth;
	let coordinateY = y * cellHeight;
	return [coordinateX + cellWidth / 2, coordinateY + cellHeight / 2];
}

function drawCircle(context, x, y, radius, count, circleType, isChecked) {
	switch (circleType) {
		case 1:
			context.fillStyle = "green";
			context.beginPath();
			context.arc(x, y, radius,0,2*Math.PI,true);
			context.fill();
			context.font = "18px Arial";
			context.fillStyle = "black";
			context.fillText(count , x - 6, y + 6);
		break;
		case 2:
			context.fillStyle = "red";
			context.beginPath();
			context.arc(x, y, radius,0,2*Math.PI,true);
			context.fill();
			context.font = "18px Arial";
			context.fillStyle = "black";
			context.fillText(count, x - 6, y + 6);
		break;
		case 3: 
			context.fillStyle = "black";
			context.beginPath();
			context.arc(x, y, radius,0,2*Math.PI,true);
			context.fill();
			context.font = "18px Arial";
			context.fillStyle = "black";
			context.fillText(count, x - 6, y + 6);
		break;
	}
	if (isChecked && isClickedVertex) {
		ctx.strokeStyle = "green";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(x, y, radius + 6,0,2*Math.PI,true);
		ctx.stroke();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
	}
}

setInterval(function(){draw(gameMap);}, 1000/60)

let isLinesActive = false;
$('button').on('click', function() {
	isLinesActive = !isLinesActive;
});

let tempMap = [
	{
	   id:1,
	   x:1,
	   y:2,
	   ajacentArray:[
		  2,
		  5,
		  4
	   ],
	   type: 2,
	   count: 7,
	   isChecked: false
	},
	{
	   id:2,
	   x:5,
	   y:2,
	   ajacentArray:[
		  3,
		  1
	   ],
	   type: 1,
	   count: 7,
	   isChecked: false
	},
	{
	   id:3,
	   x:8,
	   y:2,
	   ajacentArray:[
		  7,
		  2,
		  4
	   ],
	   type: 1,
	   count: 7,
	   isChecked: false
	},
	{
	   id:4,
	   x:3,
	   y:4,
	   ajacentArray:[
		  1,
		  5,
		  8,
		  6,
		  7,
		  3
	   ],
	   type: 1,
	   count: 10,
	   isChecked: false
	},
	{
	   id:5,
	   x:1,
	   y:6,
	   ajacentArray:[
		  1,
		  4
	   ],
	   type: 1,
	   count: 7,
	   isChecked: false
	},
	{
	   id:6,
	   x:5,
	   y:6,
	   ajacentArray:[
		  9,
		  7,
		  4
	   ],
	   type: 1,
	   count: 7,
	   isChecked: false
	},
	{
	   id:7,
	   x:8,
	   y:5,
	   ajacentArray:[
		  6,
		  3,
		  4
	   ],
	   type: 3,
	   count: 0,
	   isChecked: false
	},
	{
	   id:8,
	   x:3,
	   y:8,
	   ajacentArray:[
		  9,
		  4
	   ],
	   type: 3,
	   count: 0,
	   isChecked: false
	},
	{
	   id:9,
	   x:7,
	   y:8,
	   ajacentArray:[
		  8,
		  6
	   ],
	   type: 2,
	   count: 7,
	   isChecked: false
	}
 ];

function draw(map) {
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.strokeStyle = "black";
	ctx.strokeWidth = 1;
	map.forEach(item => {
		let coordinatesSecond = getCircleCoordinates(cellWidth, cellHeight, item.x, item.y);
		item.ajacentArray.forEach(item2 => {
		let obj = map.find(item3 => item3.id == item2);
		if (obj) {
			let coordinatesFirst = getCircleCoordinates(cellWidth, cellHeight, obj.x, obj.y);

			ctx.beginPath();
			ctx.moveTo(coordinatesSecond[0], coordinatesSecond[1]);
			ctx.lineTo(coordinatesFirst[0], coordinatesFirst[1]);
			ctx.stroke();

			drawCircle(ctx, coordinatesSecond[0], coordinatesSecond[1], radius, item.count, item.type, item.isChecked);
			drawCircle(ctx, coordinatesFirst[0], coordinatesFirst[1], radius, obj.count, obj.type, obj.isChecked);
		}
		});
		drawCircle(ctx, coordinatesSecond[0], coordinatesSecond[1], radius, item.count, item.typem, item.isChecked);
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
		this.isChecked = false;
	}
}
