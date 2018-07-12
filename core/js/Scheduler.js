var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); // define audio context
var audioContext = new AudioContext();
var nextNotetime = audioContext.currentTime;
var beat = 1;
var bar = 0;

function timeSig(beat, bar) {
  this.beat = beat;
  this.bar = bar;
}

var ts = new timeSig(beat, bar);

function Scheduler() {
  while (nextNotetime < audioContext.currentTime + 0.1) {
    nextNotetime += 0.5;
    playSound(nextNotetime, ts);
  }
  window.setTimeout(Scheduler, 50.0);
}

function playSound(time, timeSig) {
  console.log(timeSig.beat + '/' + timeSig.bar);
  var osc = audioContext.createOscillator();
  osc.connect(audioContext.destination);
  if (timeSig.beat >= 4) {
    osc.frequency.value = 400;
    timeSig.bar++;
    timeSig.beat = 1;
  } else {
    osc.frequency.value = 200;
    timeSig.beat++;
  }
  osc.start(time);
  osc.stop(time + 0.1);
};