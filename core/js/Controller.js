//webaudio functions

//sets up and handles everything (a master)
function Controller() {
  let self = this;
  let playing = false;
  this.mt = new MasterTrack();
  this.pb = new Playback();
  this.ui = new UI();
  //controller.ui.drawTimeline();
  this.scheduler = new Scheduler();
  //scheduler helper functions 
  this.play = function(){self.scheduler.start();}
  this.pause = function(){self.scheduler.stop();}

  this.controls = new Controls();
}
var controller = new Controller();


