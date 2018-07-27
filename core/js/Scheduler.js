var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
var audioContext = new AudioContext();

//extras can delete later//////////////
var compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-10, audioCtx.currentTime);
compressor.knee.setValueAtTime(40, audioCtx.currentTime);
compressor.ratio.setValueAtTime(15, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
compressor.connect(audioContext.destination);
//////////////////////////////////////
var nextNotetime = audioContext.currentTime;
var beat = 1;
var bar = 0;
var timerID;
var metronomeToggle = document.getElementById("metronomeToggle");

//tests/////////////////////
var n = new Note(1000, new timeSig(1, 1), 65);
var n6 = new Note(1000, new timeSig(1, 1), 67);
var n2 = new Note(5000, new timeSig(1, 2), 63);
var n3 = new Note(5000, new timeSig(1, 2), 61);
var n4 = new Note(2500, new timeSig(1, 2), 58);
var n5 = new Note(1500, new timeSig(1, 2), 65);
var ts = new timeSig(beat, bar);

var notes = [];
notes.push(n);
notes.push(n2);
notes.push(n3);
notes.push(n4);
notes.push(n5);
notes.push(n6);
////////////////////////////
function timeSig(beat, bar) {
  this.beat = beat;
  this.bar = bar;
}


function Scheduler() {
  var self = this;
  var bpm = 0.5;
  console.log("Scheduler created!");
  this.started = false;
  this.stop = function(){
    console.log("test" + timerID);
    clearInterval(timerID);
  }
  this.setTempo = function(value){
    bpm = (1/(value/60));

  }
  this.start = function(){
    timerID = window.setInterval(function(){
      //console.log('in timeout');
      while (nextNotetime < audioContext.currentTime + 0.1 && self.started) {
        nextNotetime += bpm;        //can set tempo here i.e. 0.5seconds per quater note = 120bpm 
        keepTime(nextNotetime, ts);
        for(var i = 0; i < notes.length; i++){
          let played = playNote(nextNotetime, notes[i], ts);
          if(played){
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
      self.stop();
    }
    else if(!self.started){
      self.started = true;
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
  let osc = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5;
  osc.connect(gainNode);
  gainNode.connect(compressor);
  if (timeSig.beat < 4) {
    osc.frequency.value = 200;
    
  } else {
    osc.frequency.value = 400;
    
  }
  osc.start(time);
  osc.stop(time + 0.1);
};

function playNote(time, Note, timeSig) {
  let notePlayed = false;
  let osc = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  osc.connect(gainNode);
  gainNode.connect(compressor);
  gainNode.gain.value = 0.2;
  if (timeSig.bar === Note.placement.bar && timeSig.beat === Note.placement.beat) {
    console.log(Note.value + " played! for " + Note.length);
    osc.frequency.value = Note.value;
    osc.start(time);
    console.log(time + Note.length);
    gainNode.gain.setTargetAtTime(0, time + Note.length, 0.25);
    osc.stop(time + Note.length);
    notePlayed = true;
  } return notePlayed;
};



if (audioContext.state === 'suspended') {
  audioContext.resume();
};