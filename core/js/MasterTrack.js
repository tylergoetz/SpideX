//influences and controls playback of every single track
function MasterTrack() {
  console.log("MasterTrack created!");
  this.tracks = []; //tracks doesnt exist yet just prototyped i.e. cant push to it
  this.volume = 0; //value between 0 and 1
  this.fx = []; //allow effects to be saved as objects in an array 
}