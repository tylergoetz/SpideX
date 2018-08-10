//webaudio functions

//sets up and handles UI, Playback, and MasterTracks
function Controller() {
  this.mt = new MasterTrack();
  this.pb = new Playback();
  this.ui = new UI();
  this.scheduler = new Scheduler();
  this.controls = new Controls();
}
 var controller = new Controller();
// controller.mt.tracks.push("stuff");
 controller.ui.drawTimeline();
// console.log(controller.mt);
//dynamic event allocation, cuz im lazy :'( ( 0 ) ) <----me eating doughnut

/*
$('.wk').on('click', function(){
  console.log("clicked" + this.key);
});
*/