window.addEventListener("load", () => {
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext('2d');
	canvas.height = window.innerHeight;
	canvas.width  = window.innerWidth;
	
	var linesArr = [];
	
	let painting = false;
	
	function startPosition(e){
		console.log(e.button);
		if(e.button == 2){
			if(linesArr.length > 0)
				linesArr.pop();
		}else if(e.button == 0){
			painting = true;
			linesArr.push([]);
			addSteps(e);
		}
	}
	function endPosition(){
		painting = false;	
	}
	
	function addSteps(e){
		if(painting == false) return;
		linesArr[linesArr.length - 1].push({x: e.x, y: e.y});
	}
	
	
	function draw(e){
		//console.log("drawing");
		context.lineTo(e.x, e.y);
		context.strokeStyle = "black";
		context.stroke();
		context.moveTo(e.x, e.y);
	}
	
	canvas.addEventListener("mousedown", startPosition);
	canvas.addEventListener("mousemove", addSteps);
	canvas.addEventListener("mouseup", endPosition);
	
	
	function animate(){
		requestAnimationFrame(animate);
		context.clearRect(0, 0, innerWidth, innerHeight);
		
		for(var i = 0; i < linesArr.length; ++i){
			context.beginPath();
			for(var j = 0; j < linesArr[i].length; ++j){
				var e = {x: linesArr[i][j].x, y: linesArr[i][j].y};
				draw(e);
			}
		}
		
	}
	animate();
	
});

window.addEventListener("resize", () => {
	canvas.height = window.innerHeight;
	canvas.width  = window.innerWidth;
});

