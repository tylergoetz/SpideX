var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
var audioContext = new AudioContext();
var compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-10, audioCtx.currentTime);
compressor.knee.setValueAtTime(40, audioCtx.currentTime);
compressor.ratio.setValueAtTime(15, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
compressor.connect(audioContext.destination);
var nextNotetime = audioContext.currentTime;
var beat = 1;
var bar = 0;
var timerID;
var metronomeBtn = document.getElementById("metronome");

//tests
var n = new Note(500, new timeSig(1, 1), 65);
var n2 = new Note(500, new timeSig(1, 2), 63);
var n3 = new Note(500, new timeSig(1, 3), 61);
var n4 = new Note(500, new timeSig(1, 4), 58);
var n5 = new Note(500, new timeSig(1, 5), 65);
var ts = new timeSig(beat, bar);
/////



function timeSig(beat, bar) {
  this.beat = beat;
  this.bar = bar;
}



function Scheduler() {
    while (nextNotetime < audioContext.currentTime + 0.1) {
      nextNotetime += 0.5;        //can set tempo here 
      playSound(nextNotetime, ts);
      playNote(nextNotetime, n, ts);
      playNote(nextNotetime, n2, ts);
      playNote(nextNotetime, n3, ts);
      playNote(nextNotetime, n4, ts);
      playNote(nextNotetime, n5, ts);
    }
    timerID = window.setTimeout(Scheduler, 5.0);

  
}

function playSound(time, timeSig) {
  console.log(timeSig.beat + '/' + timeSig.bar);
  let osc = audioContext.createOscillator();
  osc.connect(compressor);
  if (timeSig.beat < 4) {
    osc.frequency.value = 200;
    timeSig.beat++;
  } else {
    osc.frequency.value = 400;
    timeSig.beat = 1;
    timeSig.bar++;

  }
  osc.start(time);
  osc.stop(time + 0.1);
};

function playNote(time, Note, timeSig) {
  let osc = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  osc.connect(gainNode);
  gainNode.connect(compressor);
  console.log("note length tracker ----- " + Note.length)
  if (timeSig.bar === Note.placement.bar && timeSig.beat === Note.placement.beat) {
    console.log(Note.value + " played! for " + Note.length);
    osc.frequency.value = Note.value;
    osc.start(time);
    console.log(time + Note.length);
    //gainNode.gain.setTargetAtTime(0, time + Note.length, 0.015)
    osc.stop(time + Note.length);
  }
};

metronomeBtn.addEventListener('click', function() {
  clearTimeout(timerID);
}, false);

if (audioContext.state === 'suspended') {
  audioContext.resume();
};