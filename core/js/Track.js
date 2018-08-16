class Track{
    constructor(){
        this.notes = [];
        this.div;
        this.keys = [];
        this.map = createArray(10,10);
        this.grid = 30;
        this.cv;
        this.noteName = ['c', 'c#','d','d#','e','f','f#','g','g#','a','a#','b'];
        this.length = 100;
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
        this.cv.width = l*grid
        this.cv.height = h*grid;
        let alt = document.createAttribute("alt");
        alt.value = 'piano roll';
        this.cv.setAttributeNode(alt);
        this.cv.ctx = this.cv.getContext('2d');
        this.cv.ctx.font = '18px Do Hyeon';
        document.body.appendChild(this.cv);
        this.cv.left = 100;
        if(type === 1){ //audio track
            //smart kid stuff here
        }
        else if(type === 2){    //virtual inst track UI
            var rect = this.cv.getBoundingClientRect();
            console.log(rect.top, rect.right, rect.bottom, rect.left);
            let self  = this;
            for(let i = 0; i < this.noteName.length; i++){  
                let key, col;
                key = new Image();
                key.className = 'wk';
                if(this.noteName[i].includes('#')){
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
                self.cv.ctx.fillRect(0, grid*i, grid*3, grid);
                self.cv.ctx.fillStyle = 'gray';
                self.cv.ctx.fillText(self.noteName[i], 2, grid*i+15, 50);
                self.cv.ctx.strokeStyle = 'black';
                self.cv.ctx.strokeRect(0, grid*i, l*50, grid);
                //}
            }
            //draw divider line between keys and roll
            this.cv.ctx.beginPath();
            this.cv.ctx.moveTo(grid*3,0);
            this.cv.ctx.lineTo(grid*3,self.grid*l*2);
            this.cv.ctx.stroke();
            //iterate through adding event lis tener for presses and assigning correct timing, length, etc...
            //  store coordinates of new note for further manipulation i.e. deletion, changing length or note, dragging :'(
            this.cv.addEventListener('click', function(event){
                let mx, my, boundX, boundY;
                boundX = 120;   //X-bounds to keep notes in piano roll
                boundY = 15;    //Y-bounds to keep notes in piano roll, aligned with note
                mx = event.pageX;
                my = event.pageY;
                //no left associative assignemnt operator calls BURN IN HELL JS
                mx = mx - rect.left;
                mx = roundNum(mx, grid); //right now tracks are stuck at 0 left offset
                my = my - rect.top - 10; //10 just aligns the note better 
                my = roundNum(my,grid) + 15;//y position - boundingRec top offsest - 10 (for getting into the middle of the note)
                //set bounds for drawing window
                if(mx < boundX){
                    mx = boundX;
                }
                if(my < boundY){
                    my = boundY;
                }
                console.log('check offset:' +mx + ":" +my);
                //draw note (circle for now)
                // self.cv.ctx.beginPath();
                // self.cv.ctx.arc(mx,my,10,0,2*Math.PI);
                self.cv.ctx.fillStyle = 'red';
                // self.cv.ctx.fill();
                let s = 27;
                self.cv.ctx.fillRect(mx-(s/2),my-(s/2),s,s);
                console.log('mx:' + mx + ' |s/2:' + (s/2) + ' |my:' + my);
                let c = new Coord(mx-(s/2), my-(s/2), mx+(s/2),my+(s/2));
                //calculate note placement from mx
                let sub = 90;       //adjustments for now
                let noteX = mx - sub;
                let noteLength = 500; //ms, change later 
                let noteBar = 1;
                let noteBeat = noteX/grid;
                if(noteBeat > 4){ //past first bar
                    noteBar = Math.floor(noteBeat/4) + 1; //<--we start at 1 not zero
                    noteBeat = noteBeat%4;
                    if(noteBeat%4 === 0){
                        noteBeat = 4;
                        noteBar-=1; //past first bar so take away the one from earlier
                    }
                }
                let noteTS = new timeSig(noteBeat, noteBar);

                //calulate note number from my and canvas offset.top // +-30 so grid
                let noteNumber = (my - 15)/grid;
                noteNumber = 60-noteNumber;
                let note = new Note(noteLength, noteTS, noteNumber, c);
                notes.push(note);
                console.log('beat: ' +noteBeat + " | bar: " + noteBar) ;
            },false);

            this.cv.addEventListener('mousemove', function(){
                let mx, my;
                let s = self;
                mx = event.pageX;
                my = event.pageY;
                //console.log('check' +roundNum(event.pageX, grid) + ":" +roundNum(event.pageY, grid));
                //no left associative assignemnt operator calls BURN IN HELL JS
                mx = mx - rect.left;
                mx = roundNum(mx, grid); //right now tracks are stuck at 0 left offset
                my = my - rect.top - 10; //10 just aligns the note better 
                my = roundNum(my,grid) + 15;

                //console.log(notes);

                for(let i = 0; i < notes.length; i++){
                    //console.log(self.notes[i]);
                    //console.log(mx - notes[i].coord.y1);
                    console.log('mx:' + mx + " |my:" + my + ' |x1:' + notes[0].coord.x1 + ' |y1:' + notes[0].coord.y1);
                    if((Math.abs(mx - notes[i].coord.x1) <= grid/2) && (Math.abs(my - notes[i].coord.y1) <= grid/2)){
                        console.log('note found!')
                        this.style.cursor = 'e-resize';

                    }
                    else if(this.style.cursor != 'auto'){
                        this.style.cursor = 'auto';

                    }
                }
                
                
            },false);

        }
        
        
    }
}