function Note(length, timeSig, value){
    this.length = length/1000;
    this.placement = timeSig;
    this.value = Math.pow(2, ((value-69)/12)) * 440;
    console.log(this);
}