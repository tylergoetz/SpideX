function UI() {
  console.log("UI created!" );
  this.cv = document.getElementById("visualizer");
  
  
  
  /*
  this.draw = function(canvasId, coord, note){
    console.log(coord.x1);
    if(typeof canvasId != "string"){
      console.log("function draw(canvasId (string), coord (object)) not given a valid string id!");
    }
    else{
      draw2("visualizer", coord, note);
    }
  }
  */
}


/*
var coords = [];    //drawn elements tracker
var canvas = document.getElementById("visualizer");
var ctx = canvas.getContext("2d");

function draw2(canvasId, coord, note){
  ctx.fillstyle = 'rgb('+ Randomrgb(note)+')';
  for(var i = 0; i < coords.length; i++){
    ctx.clearRect(coords[i].x1, coords[i].y1, coords[i].x2, coords[i].y2);
    coords[i].x1 += 10;
    ctx.fillRect(coords[i].x1, coords[i].y1, coords[i].x2, coords[i].y2);
  }
    if(!found){   //doesnt find a matching element
    ctx.fillRect(coord.x1, coord.y1, coord.x2, coord.y2);
    coords.push(coord);  
  }
  else{ //does find matching element, adjust drawing position
    while(coords.find(function(element){
      let found = false;
      if(element.x1 === coord.x1 && element.x2 === coord.x2 && element.y1 === coord.y1 && element.y2 === coord.y2 ){
          found = true;
        }
      return found; 
    })){
      coord.y1 += coord.y2;
    }
    ctx.fillRect(coord.x1, coord.y1, coord.x2, coord.y2);
    coords.push(coord);  
  }
  
}

*/

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