function Randomrgb(note){
    let freq = note.value;
    let r,g,b;
    r = map(Math.random(), 0, 1, 0, 255);
    g = map(Math.random(), 0, 1, 0, 255);
    b = map(Math.random(), 0, 1, 0, 255);
    let rgb = [];
    rgb[0] = r;
    rgb[1] = b;
    rgb[2] = g
    console.log("rbg gen: " + rgb);
    
    return rgb;
}

