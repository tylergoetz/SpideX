var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
audioCtx.suspend();
//extras can delete later//////////////
var compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-10, audioCtx.currentTime);
compressor.knee.setValueAtTime(40, audioCtx.currentTime);
compressor.ratio.setValueAtTime(15, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
compressor.connect(audioCtx.destination);
//////////////////////////////////////
var nextNotetime = audioCtx.currentTime;
var beat = 1;
var bar = 1;
var timerID;
var metronomeToggle = document.getElementById("metronomeToggle");

//tests/////////////////////
// var n = new Note(1000, new timeSig(2, 1), 65);
// var n6 = new Note(1000, new timeSig(2, 1), 67);
// var n2 = new Note(5000, new timeSig(1, 3), 63);
// var n3 = new Note(6000, new timeSig(2, 4), 60);
// var n4 = new Note(2500, new timeSig(3, 1), 58);
// var n5 = new Note(1500, new timeSig(1, 2), 65);
// var n6 = new Note(1500, new timeSig(3, 4), 45);
var ts = new timeSig(beat, bar);

var notes = [];
// notes.push(n);
// notes.push(n2);
// notes.push(n3);
// notes.push(n4);
// notes.push(n5);
// notes.push(n6);

////////GLOBAL BEAT BAR /////
function timeSig(beat, bar) {
  this.beat = beat;
  this.bar = bar;
}


function Scheduler() {
  let self = this;
  let bpm = 0.5;
  console.log("Scheduler created");
  this.started = false;
  this.stop = function(){
    window.clearInterval(timerID);
  }
  this.setTempo = function(value){
    bpm = (1/(value/60));
  }
  this.start = function(){
    timerID = window.setInterval(function(){
      while (nextNotetime < (audioCtx.currentTime + 0.1) && self.started) {
        //can set tempo here i.e. 0.5seconds per quater note = 120bpm 
        nextNotetime += bpm;
        keepTime(nextNotetime, ts);
        controller.ui.tick();
        for(var i = 0; i < notes.length; i++){
          
          let played = playNote(nextNotetime, notes[i], ts);
          if(played){
            console.log('FROM SCHEDULER' + notes[i].placement.bar + ':' + notes[i].placement.beat);
            controller.ui.draw("visualizer", notes[i]);
            notes.splice(i, 1);
          }
        }
        playSound(nextNotetime, ts);
      }
    }, 50.0);
  }
  metronomeToggle.addEventListener('click', function() {
    if(self.started){
      self.started = false;
      audioCtx.suspend();
      self.stop();
    }
    else if(!self.started){
      self.started = true;
      audioCtx.resume();
      self.start();
    }
    console.log("Scheduler " && self.started === false ? "Stopped" : "Started");
  }, false);
}


function keepTime(time, timeSig){
  //console.log(timeSig.beat + '/' + timeSig.bar);
  document.getElementById("metroDisplay").innerText = timeSig.beat + '/' + timeSig.bar;
  if (timeSig.beat < 4) {
    timeSig.beat++;
  } else {
    timeSig.beat = 1;
    timeSig.bar++;
  }
}


function playSound(time, timeSig) {
  let osc = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.5;
  osc.connect(gainNode);
  gainNode.connect(compressor);
  if (timeSig.beat > 1) {
    osc.frequency.value = 200;
    
  } else {
    osc.frequency.value = 400;
  }
  osc.start(time);
  osc.stop(time + 0.1);
};

function playNote(time, Note, timeSig) {
  let notePlayed = false;
  let osc = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(compressor);
  gainNode.gain.value = 0.2;
  //console.log('note played!' + Note.placement.bar + ':' + Note.placement.beat);
  if (timeSig.bar === Note.placement.bar && timeSig.beat === Note.placement.beat) {
    //console.log('note played!' + Note.placement.bar + ':' + Note.placement.beat);
    osc.frequency.value = Note.value;
    osc.start(time);
    gainNode.gain.setTargetAtTime(0, time + Note.length, 0.25);
    osc.stop(time + Note.length);
    notePlayed = true;
  } 
  return notePlayed;
};
