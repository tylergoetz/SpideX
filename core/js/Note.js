function Note(length, timeSig, value, coord){
    this.length = length/1000;                          //notes come in ms when dealing with scheduler and accounting for precision
    this.placement = timeSig;                           //timeSig(beat,bar) i.e. 1/4
    this.value = Math.pow(2, ((value-69)/12)) * 440;    //note frequency in hertz
    //console.log(this);

    this.coord = coord;  //placment on UI for eventlistener triggers
}