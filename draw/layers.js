let event_canvas_full = new Event("canvas_full");
const layer_limit =  13;
const line_limit = 100;
function Canvas(id){
	this.linesArr = [];
	this.height   = 100;
	this.width    = 100;
	this.painting = false;
	this.lineWidth= 1;
	this.lineColor= "black";
	this.live     = false;
	this.canvas   = document.createElement("canvas");
	
	this.canvas.setAttribute("id", `canvas${id}`);
	document.body.appendChild(this.canvas);
	
	this.context  = this.canvas.getContext("2d");
	
	console.log(this.context);
	
	this.canvas.height = window.innerHeight;
	this.canvas.width  = window.innerWidth;
	
	window.addEventListener("resize", () => {
		this.canvas.height = window.innerHeight;
		this.canvas.width  = window.innerWidth;
	});

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
			this.context.moveTo(e.x, e.y);
			this.context.strokeStyle = this.lineColor;
			this.context.lineWidth = this.lineWidth;
			this.draw(e);
		}
	}

	this.endPosition = ()=>{
		this.painting = false;	
		this.context.beginPath();
		if(this.linesArr.length >= layer_limit){
			document.dispatchEvent(event_canvas_full);
		}
	}
	
	this.addSteps = (e)=>{
		this.mouseX = e.x;
		this.mouseY = e.y;
		if(this.painting == false) return;
		if(this.linesArr[this.linesArr.length - 1].coords.length >= line_limit){
			this.linesArr.push({
				lineColor : this.lineColor,
				lineWidth : this.lineWidth,
				coords:[]
			});
		}
		this.linesArr[this.linesArr.length - 1].coords.push({x: e.x, y: e.y});
		this.draw(e);
	}
	
	
	this.draw = (e)=>{
		this.context.lineTo(e.x, e.y);
		this.context.stroke();
		this.context.moveTo(e.x, e.y);
	}
	
	// let commands = function(e){
	// }
	
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
	
	layers.push(new Canvas(layers.length));
	// layers.push(new Canvas(layers.length));
	// layers.push(new Canvas(layers.length));
	// console.log(layers[0]);
	// layers[2].activate();
	
	document.addEventListener("canvas_full", (e) => {
		console.log("adding new canvas");
		layers[layers.length - 1].deactivate();
		layers.push(new Canvas(layers.length));
	}, false);
	
	window.addEventListener("keypress", (e) => {
		if(e.key == 'z'){
			if(layers.length > 1 && layers[layers.length - 1].linesArr.length === 0){
				layers[layers.length - 1].canvas.remove();
				layers.pop();
				layers[layers.length - 1].activate();
			}
			
			layers[layers.length - 1].undo();
			
		}
	});
});
