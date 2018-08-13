class Track{
    constructor(){
        this.notes = [];
        this.div;
        this.keys = [];
        this.map = createArray(10,10);
        this.grid = 30;
        this.cv;
        this.notes = ['c', 'c#','d','d#','e','f','f#','g','g#','a','a#','b'];
        this.length = 20;
        this.height = 12;
    }
    //Might not be necessary in since tracks arent responsible for playback
    play (){
        if(!playing){ /*start playing*/} 
    }
    suspend(){
        if(playing){ /*stop playing*/ }
    }
    create(type){   //1 for audio track, 2 for vst 
        let l = this.length;
        let h = this.height;
        this.cv = document.createElement('canvas');
        this.cv.width = l*grid+(grid*2)
        this.cv.height = h*grid;
        let alt = document.createAttribute("alt");
        alt.value = 'piano roll';
        this.cv.setAttributeNode(alt);
        this.cv.ctx = this.cv.getContext('2d');
        this.cv.ctx.font = '18px Do Hyeon';
        document.body.appendChild(this.cv);
        if(type === 1){ //audio track
            //smart kid stuff here
        }
        else if(type === 2){    //virtual inst track UI
            var rect = this.cv.getBoundingClientRect();
            console.log(rect.top, rect.right, rect.bottom, rect.left);
            let self  = this;
            for(let i = 0; i < this.notes.length; i++){  
                let key, col;
                key = new Image();
                key.className = 'wk';
                if(this.notes[i].includes('#')){
                    //key.src = 'w_keyblack.png';
                    col = 'black';
                }
                else{
                    //key.src = 'w_key.png';
                    col = 'white';
                }
                this.keys.push(key);
                //key.onload = function(){    //originally an image for keys 
                    //self.cv.ctx.drawImage(key, 0, self.grid*i);
                    self.cv.ctx.fillStyle = col;
                    self.cv.ctx.fillRect(0, grid*i, l*5, grid);
                    self.cv.ctx.fillStyle = 'gray';
                    self.cv.ctx.fillText(self.notes[i], 2, grid*i+15, 50);
                    self.cv.ctx.strokeStyle = 'red';
                    self.cv.ctx.strokeRect(0, grid*i, l*5, grid);
                //}
            }
            //draw divider line between keys and roll
            this.cv.ctx.beginPath();
            this.cv.ctx.moveTo(100,0);
            this.cv.ctx.lineTo(100,self.grid*l*2);
            this.cv.ctx.stroke();
            //iterate through adding event listener for presses and assigning correct timing, length, etc...
            //  store coordinates of new note for further manipulation i.e. deletion, changing length or note, dragging :'(
            
            this.cv.addEventListener('click', function(event){
                let mx, my;
                console.log('check' +roundNum(event.clientX, grid) + ":" +roundNum(event.clientY, grid));
                mx = roundNum(event.clientX, grid) - rect.left; //right now tracks are stuck at 0 left offset
                my = roundNum(event.clientY,grid) - rect.top-10; //y position - boundingRec top offsest - 10 (for getting into the middle of the note)
                console.log('check offset:' +mx + ":" +my);
                //draw note (circle for now)
                self.cv.ctx.beginPath();
                self.cv.ctx.arc(mx,my,5,0,2*Math.PI);
                self.cv.ctx.strokeStyle = 'blue';
                self.cv.ctx.stroke();
                let sub = 90;
                let noteX = mx - sub;
                let noteLength = 500; //ms
                let noteBar = 1;
                let noteBeat = noteX/grid;
                if(noteBeat > 4){
                    noteBar += Math.floor(noteBeat/4);
                    noteBeat = noteBeat % 4 + 1;
                    if(noteBeat === 0){
                        noteBeat+=1;
                    }
                }
                let noteTS = new timeSig(noteBeat, noteBar);
                let note = new Note(noteLength, noteTS, 50);
                notes.push(note);
                console.log(note);
                console.log(noteBeat + " : " + noteBar) ;
            },false);
        }
        
        
    }
}