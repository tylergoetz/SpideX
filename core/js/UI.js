var coords = [];    //drawn elements tracker
var canvas = document.getElementById("visualizer");
var ctx = canvas.getContext("2d");
ctx.strokeStyle="#FF0000";
var coordinate;
var timelineOffset = 100;
var grid = 30;
var length = 20;
var height = 24;


function UI() {
  console.log("UI created!" );
  document.getElementById("tempo").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        controller.scheduler.setTempo(document.getElementById("tempo").value)
    }
  });
  
  this.drawTimeline = function(){
    canvas.style.left = grid*3 +'px'; //set timeline position
    
    let c = 1;
    let d = 1;
    let x = 0;
    while(x < canvas.getBoundingClientRect().right){
      ctx.fillText(d + "." + c, x, 10, 500)
      x+=grid;
      c+=1;
      if(c > 4){
        c = 1;
        d +=1;
      }
    }
    //draw position in timeline and subsequent tracks
    canvas.addEventListener('click',function(){
      let mx = roundNum(event.pageX, grid);
      ctx.beginPath();
      ctx.moveTo(mx-timelineOffset, 0);
      ctx.lineTo(mx-timelineOffset,50);
      ctx.stroke();
      for(let i = 0; i < controller.mt.tracks.length; i++){
        let track = controller.mt.tracks[i];
        let trackCtx = track.cv.ctx;
        trackCtx.strokeStyle = "#FF0000";
        trackCtx.beginPath();
        trackCtx.moveTo(mx, 0);
        trackCtx.lineTo(mx, track.height*track.grid);
        trackCtx.stroke();
      }
      //set ts to timeline position
      
    }, false);
  }
  this.drawTimeline();  //either i'm stupid or JS is but this seemed like the only way handle constructor calls (maybe es6 class constructors?)
  
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
        coordinate = new Coord(grid*4*(n.placement.bar-1)+(n.placement.beat*grid),20, 10,100);
      }
      else{
        coordinate = new Coord((n.placement.beat)*grid, 20, 10,100);
      }
      draw2("visualizer", coordinate, n);
    }
  }
  //display info in the infobar kind of like fl studio
  //PERFORMANCE ISSUES FIND WORKAROUND  

  // document.body.addEventListener('mouseover', function(event){
  //   let target = $(event.target);
  //   let elId = target.attr('alt');
  //   let el = document.getElementById('infoDisplay');
  //   if(elId){
  //     el.innerHTML = elId;
  //   }
  //   else{
  //     el.innerHTML = "---";
  //   }
  // },false);
}

//rounds a number up or down depending on where it sits between the interval
function roundNum(num, interval){
  return Math.round(num/interval)*interval;
}


function draw2(canvasId, coord, note){
  let found = false;
  //ctx.fillstyle = "rgb('+ Randomrgb(note)+')";
  
  if(!found){   //doesnt find a matching element
    ctx.strokeRect(coord.x1-10, coord.y1, coord.x2-10, coord.y2);
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
//class coordinate, helps maintain easy viewability of clickable sections in the canvas, specifically notes the user creates
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

//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_dropdown_navbar_click
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}
function dropFileDown() {
  document.getElementById("fileDropdown").classList.toggle("show");
}
// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
}
if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById("fileDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
}
}



