function fraction(num, den){
    this.num = num;
    this.den = den;
    this.reciprocate = function(){
        let temp = num;
        num = den;
        den = temp;
    }
}