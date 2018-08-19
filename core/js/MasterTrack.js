//controls playback of every single track
function MasterTrack() {
  console.log("MasterTrack created!");
  this.tracks = []; //tracks doesnt exist yet just prototyped i.e. cant push to it
  this.volume = 0; //value between 0 and 1
  this.fx = []; //allow effects to be saved as objects in an array 
  //should be calling tracks to then play notes so this.tracks.play()
  this.newTrack = function(){
    let t = new Track();
    t.create(2);
    this.tracks.push(t);
  }

  //if track's are resized they need to be re-drawn
  this.notifyResize = function(){
    for(track in this.tracks){
      //track.resize();
      console.log('track resized');
    }
  }
}