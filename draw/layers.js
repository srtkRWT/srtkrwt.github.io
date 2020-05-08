let event_canvas_full = new Event("canvas_full");

const layer_limit =  13;
const line_limit = 100;

const canvas_height = 4096;
const canvas_width = 2048;

var mouseX = 0;
var mouseY = 0;

function Canvas(id, lineColor, lineWidth){
	this.linesArr = [];
	this.painting = false;
	this.lineWidth= lineWidth;
	this.lineColor= lineColor;
	this.live     = false;
	this.canvas   = document.createElement("canvas");
	
	this.canvas.setAttribute("id", `canvas${id}`);
	document.body.appendChild(this.canvas);
	
	this.context  = this.canvas.getContext("2d");
	
	console.log(this.context);
	
	this.canvas.height = canvas_height;//window.innerHeight;
	this.canvas.width  = canvas_width;//window.innerWidth;
		
	this.startPosition = (e)=>{
		if(e.button == 0){
			this.painting = true;
			this.linesArr.push({
				lineColor : this.lineColor,
				lineWidth : this.lineWidth,
				coords:[]
			});
			this.addSteps(e);
			this.context.beginPath();
			this.context.moveTo(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
			this.context.strokeStyle = this.lineColor;
			this.context.lineWidth = this.lineWidth;
			this.draw({x: e.pageX - this.canvas.offsetLeft, y: e.pageY - this.canvas.offsetTop});
		}
	}

	this.endPosition = ()=>{
		this.painting = false;	
		this.context.beginPath();
		//TODO share the line just finished ...
		if(this.linesArr.length >= layer_limit){
			document.dispatchEvent(event_canvas_full);
		}
	}
	
	this.addSteps = (e)=>{
		mouseX = e.pageX - this.canvas.offsetLeft;
		mouseY = e.pageY - this.canvas.offsetTop;
		if(this.painting == false) return;
		let lastPoint = this.linesArr[this.linesArr.length - 1].coords[this.linesArr[this.linesArr.length - 1].coords.length - 1];
		if(this.linesArr[this.linesArr.length - 1].coords.length >= line_limit){
			//TODO share the line just finished ...
			this.linesArr.push({
				lineColor : this.lineColor,
				lineWidth : this.lineWidth,
				coords:[]
			});
			this.linesArr[this.linesArr.length - 1].coords.push(lastPoint);
		}
		this.linesArr[this.linesArr.length - 1].coords.push({x: mouseX, y: mouseY});
		this.draw({x: mouseX, y: mouseY});
	}
	
	
	this.draw = (e)=>{
		this.context.lineTo(e.x, e.y);
		this.context.stroke();
		this.context.moveTo(e.x, e.y);
	}
		
	this.undo = ()=>{
		this.linesArr.pop();
		this.reDraw();
	}
	
	this.reDraw = ()=>{
		this.context.clearRect(0, 0, innerWidth, innerHeight);
		for(var i = 0; i < this.linesArr.length; ++i){
			this.context.beginPath();
			this.context.strokeStyle = this.linesArr[i].lineColor;
			this.context.lineWidth   = this.linesArr[i].lineWidth;
			for(var j = 0; j < this.linesArr[i].coords.length; ++j){
				var e = {
					x: this.linesArr[i].coords[j].x,
					y: this.linesArr[i].coords[j].y,
				};
				this.draw(e);
			}
		}
		this.context.beginPath();		
	}
	
	this.activate = ()=>{
		console.log("starting");
		this.canvas.addEventListener("mousedown", this.startPosition);
		this.canvas.addEventListener("mousemove", this.addSteps);
		this.canvas.addEventListener("mouseup", this.endPosition);
	}
	this.activate();
	
	this.deactivate = ()=>{
		this.canvas.removeEventListener("mousedown", this.startPosition, false);
		this.canvas.removeEventListener("mousemove", this.addSteps, false);
		this.canvas.removeEventListener("mouseup", this.endPosition, false);
	}
	
}

window.addEventListener("load", () =>{	
	let layers = [];
	
	layers.push(new Canvas(layers.length, "black", 1));
	
	document.addEventListener("canvas_full", (e) => {
		console.log("adding new canvas");
		layers[layers.length - 1].deactivate();
		layers.push(new Canvas(
			layers.length,
			layers[layers.length - 1].lineColor,
			layers[layers.length - 1].lineWidth
		));
	}, false);
	
	window.addEventListener("keypress", (e) => {
		if(e.key == 'z'){
			if(layers.length > 1 && layers[layers.length - 1].linesArr.length === 0){
				layers[layers.length - 1].canvas.remove();
				layers.pop();
				layers[layers.length - 1].activate();
			}
			
			layers[layers.length - 1].undo();
			
		}else if(e.key == '1'){
			layers[layers.length - 1].lineWidth = 1;
			if(layers[layers.length - 1].lineColor == "white")
				layers[layers.length - 1].lineColor = "black";
		}else if(e.key == '2'){
			layers[layers.length - 1].lineWidth = 3;
			if(layers[layers.length - 1].lineColor == "white")
				layers[layers.length - 1].lineColor = "black";
		}else if(e.key == '3'){
			layers[layers.length - 1].lineWidth = 5;
			if(layers[layers.length - 1].lineColor == "white")
				layers[layers.length - 1].lineColor = "black";
		}else if(e.key == '4'){
			layers[layers.length - 1].lineColor = "black";
		}else if(e.key == '5'){
			layers[layers.length - 1].lineColor = "red";
		}else if(e.key == '6'){
			layers[layers.length - 1].lineColor = "green";
		}else if(e.key == '7'){
			layers[layers.length - 1].lineColor = "blue";
		}else if(e.key === '0'){
			layers[layers.length - 1].lineColor = "white";
			layers[layers.length - 1].lineWidth = 9;
		}
	});
});

