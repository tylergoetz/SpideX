//IMPORTANT AUDIO CONTEXT
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

var beat = 1;
var bar = 1;
var play = document.getElementById("play"); //play button
play.onclick = function(){
  if(self.started){
    controller.pause();
  }
  else if(!self.started){
    controller.play();
  }
  console.log("Scheduler " && self.started === false ? "Stopped" : "Started");
}

var metronomeToggle = document.getElementById('metronomeToggle');
metronomeToggle.onclick = function(){
  if(metronomeOn){
    metronomeOn = false;
  }
  else{
    metronomeOn =  true;
  }
}
var metronomeOn = true;
var ts = new timeSig(beat, bar);    //global timesig 
var notes = [];                     //global notes, any notes pushed to here will be scheduled for playback!
var scheduledNotes = [];
              
////////class time signature  /////
function timeSig(beat, bar) {
  this.beat = beat;
  this.bar = bar;
}
/////////////////////////////////

function Scheduler() {
  let nextNotetime = audioCtx.currentTime;
  let self = this;
  let bpm = 0.5;  //global bpm, always set through Scheduler.setTempo(value) to ensue correct timing
  let timerID = null; 
  console.log("Scheduler created");
  this.started = false;
  //stop audio context clear's interval for lookahead function
  this.stop = function(){
    self.started = false;
    window.clearInterval(timerID);
    timerID = null;
    controller.ui.t = 0;
    audioCtx.suspend();
    
  }
  //allow dynamic tempo changes (not sure how to handle audio clips)
  this.setTempo = function(value){
    bpm = (1/(value/60));
  }
  //resumes audioContext, lookahead function, keeps time for metronome display
  this.start = function(){
    self.started = true;
    audioCtx.resume();
    if(timerID === null)
    timerID = window.setInterval(function(){
      //find notes for current and next beat||bar from array notes and schedule them in schedulednotes 
      for(var i = 0; i < notes.length; i++){
        if(scheduleNotes(new timeSig(notes[i].placement.beat, notes[i].placement.bar))&& !scheduledNotes.includes(notes[i])){
          scheduledNotes.push(notes[i]);
        }
      }
      while (nextNotetime < (audioCtx.currentTime + 0.1) && self.started) {
        //can set tempo here i.e. 0.5seconds per quater note = 120bpm 
        nextNotetime += bpm;
        keepTime(nextNotetime, ts);
        controller.ui.tick();
        for(var i = 0; i < scheduledNotes.length; i++){
          let played = playNote(nextNotetime, scheduledNotes[i]);
          if(scheduledNotes[i].beat === 1){
          }
        }
        playSound(nextNotetime);
      }
      console.log(scheduledNotes.length + ' | notes.length = ' + notes.length)
      scheduledNotes.length = 0;  //clear scheduled notes for next beat||bar search
    }, 100);
  }
}


//-------------------------------------HELPER FUNCTIONS----------------------------------------------------------------------------|

function scheduleNotes(timeSig){
  let dif = 1;
  return (Math.abs(ts.beat - timeSig.beat) <= dif && Math.abs(ts.bar - timeSig.bar) <= dif)
}


//SYNCS ELEMENT METRODISPLAY WITH GLOBAL TIMESIGNATURE TS
function keepTime(time, timeSig){
  document.getElementById("metroDisplay").innerText = timeSig.beat + '/' + timeSig.bar;
  if (timeSig.beat < 4) {
    timeSig.beat++;
  } else {
    timeSig.beat = 1;
    timeSig.bar++;
  }
}

//FUNCTIONS AS A PSEUDO METRONOME FOR NOW
function playSound(time) {
  if(metronomeOn){
    let osc = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    osc.connect(gainNode);
    gainNode.connect(compressor);
    if (ts.beat > 1) {
      osc.frequency.value = 200;
      
    } else {
      osc.frequency.value = 400;
    }
    osc.start(time);
    osc.stop(time + 0.1);
    delete osc, gainNode;
  };
}

//creates oscillator for scheduled note and play it, handles Note class only 
/*TODO:
 *  -create fx chain and vst style plugins to connect to make whatever note sound you want
 *
*/
function playNote(time, Note) {
  let notePlayed = false;
  let osc = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(compressor);
  gainNode.gain.value = 0.2;
  if (ts.bar === Note.placement.bar && ts.beat === Note.placement.beat) {
    console.log(Note);
    osc.frequency.value = Note.value;
    osc.start(time);
    gainNode.gain.setTargetAtTime(0, time + Note.length, 0.25);
    osc.stop(time + Note.length);
    delete osc, gainNode;
    notePlayed = true;
  } 
  return notePlayed;
};

function restartPlayback(){
  controller.pause();
  ts.beat = 1;  //set global ts back to 1:1 i.e. start of song
  ts.bar = 1;
}
