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
var metronomeToggle = document.getElementById("play");

var ts = new timeSig(beat, bar);    //global timesig 
var notes = [];                     //global notes, any notes pushed to here will be scheduled for playback!

////////class time signature  /////
function timeSig(beat, bar) {
  this.beat = beat;
  this.bar = bar;
}
/////////////////////////////////

function Scheduler() {
  let self = this;
  let bpm = 0.5;  //global bpm, always set through Scheduler.setTempo(value) to ensue correct timing
  console.log("Scheduler created");
  this.started = false;
  //stop audio context clear's interval for lookahead function
  this.stop = function(){
    self.started = false;
    audioCtx.suspend();
    window.clearInterval(timerID);
  }
  //allow dynamic tempo changes (not sure how to handle audio clips)
  this.setTempo = function(value){
    bpm = (1/(value/60));
  }
  //resumes audioContext, lookahead function, keepstime for metronome display
  this.start = function(){
    self.started = true;
    audioCtx.resume();
    timerID = window.setInterval(function(){
      while (nextNotetime < (audioCtx.currentTime + 0.1) && self.started) {
        //can set tempo here i.e. 0.5seconds per quater note = 120bpm 
        nextNotetime += bpm;
        keepTime(nextNotetime, ts);
        controller.ui.tick();
        for(var i = 0; i < notes.length; i++){
          
          let played = playNote(nextNotetime, notes[i], ts);
          if(played){
            controller.ui.draw("visualizer", notes[i]);
            //notes.splice(i, 1); if we splice notes then we cant playback from beginning 
          }
        }
        playSound(nextNotetime, ts);
      }
    }, 50.0);
  }
  //event listener for play/pause through metronome toggle
  metronomeToggle.addEventListener('click', function() {
    if(self.started){
      
      self.stop();
    }
    else if(!self.started){
      
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

//creates oscillator for scheduled note and play it, handles Note class only 
function playNote(time, Note, timeSig) {
  let notePlayed = false;
  let osc = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(compressor);
  gainNode.gain.value = 0.2;
  if (timeSig.bar === Note.placement.bar && timeSig.beat === Note.placement.beat) {
    osc.frequency.value = Note.value;
    osc.start(time);
    gainNode.gain.setTargetAtTime(0, time + Note.length, 0.25);
    osc.stop(time + Note.length);
    notePlayed = true;
  } 
  return notePlayed;
};

function restartPlayback(){
  ts.beat = 1;
  ts.bar = 1;
}