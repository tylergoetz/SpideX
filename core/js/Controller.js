//webaudio functions

//sets up and handles UI, Playback controller and MasterTracks
function Controller() {
  this.mt = new MasterTrack();
  this.pb = new Playback();
  this.ui = new UI();
  this.scheduler = new Scheduler();
  this.controls = new Controls();
}
 var controller = new Controller();
// controller.mt.tracks.push("stuff");
 controller.scheduler.start();
// console.log(controller.mt);