window.addEventListener("load", () => {
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext('2d');
	canvas.height = window.innerHeight;
	canvas.width  = window.innerWidth;
	
	var linesArr = [];
	
	let painting = false;
	let lineColor = "black";
	let lineWidth = 1;
	let mouseX = 0;
	let mouseY = 0;
	function startPosition(e){
		if(e.button == 0){
			painting = true;
			linesArr.push({
				lineColor,
				lineWidth,
				coords:[]
			});
			addSteps(e);
		}
	}
	function endPosition(){
		painting = false;	
	}
	
	function addSteps(e){
		mouseX = e.x;
		mouseY = e.y;
		if(painting == false) return;
		linesArr[linesArr.length - 1].coords.push({x: e.x, y: e.y});
	}
	
	
	function draw(e){
		//console.log("drawing");
		context.lineTo(e.x, e.y);
			context.stroke();
		context.moveTo(e.x, e.y);
	}
	
	function commands(e){
		//console.log(e);
		if(e.key == 'z'){
			linesArr.pop();
		}else if(e.key == '1'){
			lineWidth = 1;lineColor = "black";
		}else if(e.key == '2'){
			lineWidth = 3;lineColor = "black";
		}else if(e.key == '3'){
			lineWidth = 5;lineColor = "black";
		}else if(e.key == '4'){
			lineColor = "black";
		}else if(e.key == '5'){
			lineColor = "red";
		}else if(e.key == '6'){
			lineColor = "green";
		}else if(e.key == '7'){
			lineColor = "blue";
		}else if(e.key === '0'){
			lineColor = "white";
			lineWidth = 9;
		}
	}
	
	canvas.addEventListener("mousedown", startPosition);
	canvas.addEventListener("mousemove", addSteps);
	canvas.addEventListener("mouseup", endPosition);
	window.addEventListener("keypress", commands);
	//window.addEventListener("keyup", commands);
	
	
	function animate(){
		requestAnimationFrame(animate);
		context.clearRect(0, 0, innerWidth, innerHeight);
		
		for(var i = 0; i < linesArr.length; ++i){
			context.beginPath();
			context.strokeStyle = linesArr[i].lineColor;
			context.lineWidth = linesArr[i].lineWidth;
			for(var j = 0; j < linesArr[i].coords.length; ++j){
				var e = {
					x: linesArr[i].coords[j].x,
					y: linesArr[i].coords[j].y,
				};
				draw(e);
			}
		}
		context.beginPath();
		context.strokeStyle = lineColor;
		context.lineWidth = lineWidth;
		context.arc(mouseX, mouseY, 1, 0, Math.PI * 2, false);
		context.stroke();
	}
	animate();
	
});

window.addEventListener("resize", () => {
	canvas.height = window.innerHeight;
	canvas.width  = window.innerWidth;
});
