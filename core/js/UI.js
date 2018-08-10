var coords = [];    //drawn elements tracker
var canvas = document.getElementById("visualizer");
var ctx = canvas.getContext("2d");
ctx.strokeStyle="#FF0000";
var coordinate;
var timelineOffset = 100;
var timelineSpacing = 25;



function UI() {
  console.log("UI created!" );
  document.getElementById("tempo")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        controller.scheduler.setTempo(document.getElementById("tempo").value)
    }
  });
  this.drawTimeline = function(){
    let img = new Image();
    img.src = "Timeline.png";
    img.addEventListener('load', function(){
      //ctx.drawImage(img, 0,-75);
      ctx.fillText("Hello World",10,50);
    }, false);
    console.log(canvas);
    canvas.addEventListener('click',function(){
      var mouseX = event.clientX;
      var mouseY = event.clientY;
      console.log("timeline clicked: "+  mouseX +':' + mouseY);
      console.log("click rounded: "+  roundNum(mouseX, timelineSpacing) +':' + mouseY);
      ctx.beginPath();
      ctx.moveTo(roundNum(mouseX, timelineSpacing)-timelineOffset, 0);
      ctx.lineTo(roundNum(mouseX, timelineSpacing)-timelineOffset,50);
      ctx.stroke();
      let track = controller.mt.tracks[0];
      let trackCtx = track.cv.ctx;
      trackCtx.strokeStyle = "#FF0000";
      trackCtx.beginPath();
      trackCtx.moveTo(roundNum(mouseX, timelineSpacing), 0);
      trackCtx.lineTo(roundNum(mouseX, timelineSpacing), track.height*track.grid);
      trackCtx.stroke();
    }, false);
  }

  //helps with drawing functions 
  let t = 0; 
  this.tick = function(){
    t++;
  }
  
  this.draw = function(canvasId, n){
    n.placement.beat-=1; //offset beat placement to account for zero-case
    if(typeof canvasId != "string"){
      console.log("function draw(canvasId (string), coord (object)) not given a valid string id!");
    }
    else{
      if(n.placement.bar > 1){
        coordinate = new Coord(timelineSpacing*4*(n.placement.bar-1)+(n.placement.beat*timelineSpacing),20, 10,100);
      }
      else{
        coordinate = new Coord(n.placement.beat*timelineSpacing, 20, 10,100);
      }
      draw2("visualizer", coordinate, n);
    }
  }
  //display info in the infobar kind of like fl studio
  document.body.addEventListener('mouseover', function(event){
    let target = $(event.target);
    let elId = target.attr('alt');
    if(elId){
      let el = document.getElementById('infoDisplay');
      el.innerHTML = elId;
    }
  },false);
}

//rounds a number up or down depending on where it sits between the interval
function roundNum(num, interval){
  return Math.round(num/interval)*interval;
}


function draw2(canvasId, coord, note){
  let found = false;
  //ctx.fillstyle = "rgb('+ Randomrgb(note)+')";
  
  if(!found){   //doesnt find a matching element
    ctx.strokeRect(coord.x1, coord.y1, coord.x2, coord.y2);
    coords.push(coord);  
  }
  else{ //does find matching element, adjust drawing position
    while(coords.find(function(element){
      
      if(element.x1 === coord.x1 && element.x2 === coord.x2 && element.y1 === coord.y1 && element.y2 === coord.y2 ){
          found = true;
      }
    })){
      coord.y1 += coord.y2;
    }
    ctx.strokeRect(coord.x1, coord.y1, coord.x2, coord.y2);
    coords.push(coord);  
  }
}

function Coord(x1, y1, x2, y2){
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;
}

//helper function from https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//helper from https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }
  return arr;
}