class Track{
    constructor(){
        this.notes = [];
        this.div;
        this.keys = [];
        this.map = createArray(10,10);
        this.grid = grid;
        this.cv;
        this.control;
        this.noteName = ['c', 'c#','d','d#','e','f','f#','g','g#','a','a#','b'];
        this.noteLength = 1000;
        this.length = 100;
        this.height = 12;
        this.trackOptions = ['remove note', 'copy note', 'testy mctesterson blah blah for another line what happens?'];
        this.trackOptionsButtons = [];
        this.trackOffset = grid * 10;
        this.onNote = false;
        this.offset = 0;
        this.contextMenuButtonHeight = 48 + 'px';
    }
    //Might not be necessary in since tracks arent responsible for playback
    play (){
        if(!playing){ /*start playing*/} 
    }
    suspend(){
        if(playing){ /*stop playing*/ }
    }
    create(type){   //1 for audio track, 2 for vst
        //table for canvas and control display
        let table = document.createElement('table');
        table.style.cellPadding = '0px';
        let tr = document.createElement('tr');
        
        
        //this.control creation and styling
        let tdcntrl = document.createElement('td');
        let cntrl = this.control;
        cntrl = document.createElement('div');
        cntrl.style.width   = this.trackOffset + 'px';
        cntrl.style.height  = this.h*grid;
        //cntrl.style.display = 'inline-block';
        tdcntrl.style.backgroundColor = 'green';
        tdcntrl.style.verticalAlign = 'top';
        //cntrl.style.position= 'relative';
        cntrl.innerHTML     = 'stuff here to fill space?'
            //cntrl content//
            let cntrlElements = [];
            let cntrlVolume = document.createElement('div');
            cntrlElements.push(cntrlVolume);
            cntrlVolume.style.display = 'inline-block';
            cntrlVolume.style.width = grid * 3 //grid total is 10 so 7 left
            
            let cntrlPlugins = document.createElement('div');
            cntrlElements.push(cntrlPlugins);
            cntrlPlugins.style.display = 'inline-block';



            for(let el in cntrlElements){
                cntrl.appendChild(cntrlElements[el]);
            }
            
            //this.cv creation and styling
        let tdcv = document.createElement('td');
        let l               = this.length;
        let h               = this.height;
        this.cv = document.createElement('canvas');
        this.cv.style.display = 'inline-block';
        this.cv.width       = l*grid
        this.cv.height      = h*grid;
        let alt             = document.createAttribute("alt");
        alt.value           = 'piano roll';
        this.cv.setAttributeNode(alt);
        this.cv.ctx = this.cv.getContext('2d');
        this.cv.ctx.font    = '18px Do Hyeon';
        //this.cv.style.position    = 'relative';
        //this.cv.style.left  = this.trackOffset + 'px';

        //append main elements here
        document.body.appendChild(table);
        table.appendChild(tr);
        table.appendChild(tdcntrl);
        tdcntrl.appendChild(cntrl);
        table.appendChild(tdcv);
        tdcv.appendChild(this.cv);

        if(type === 1){ //audio track
            //smart kid stuff here
        }
        else if(type === 2){    //virtual inst track UI
            let rect        = this.cv.getBoundingClientRect();
            let self        = this;
            console.log(rect.top, rect.right, rect.bottom, rect.left);
            for(let i = 0; i < this.noteName.length; i++){  
                let key, col;
                key         = new Image();
                key.className= 'wk';
                if(this.noteName[i].includes('#')){
                    //key.src = 'w_keyblack.png';
                    col     = 'black';
                }
                else{
                    //key.src = 'w_key.png';
                    col     = 'white';
                }
                this.keys.push(key);
                //key.onload = function(){    //originally an image for keys 
                    //self.cv.ctx.drawImage(key, 0, self.grid*i);
                self.cv.ctx.fillStyle   = col;
                self.cv.ctx.fillRect(self.offset, grid*i, grid*3, grid);
                self.cv.ctx.fillStyle   = 'gray';
                self.cv.ctx.fillText(self.noteName[i], this.offset+2, grid*i+15, 50);
                self.cv.ctx.strokeStyle = 'black';
                self.cv.ctx.strokeRect(self.offset, grid*i, l*50, grid);
                //}
                
            }
            //draw divider line between keys and roll
            this.cv.ctx.beginPath();
            this.cv.ctx.moveTo(self.offset+grid*3,0);
            this.cv.ctx.lineTo(self.offset+grid*3,self.grid*l*2);
            this.cv.ctx.stroke();
            //iterate through adding event lis tener for presses and assigning correct timing, length, etc...
            //  store coordinates of new note for further manipulation i.e. deletion, changing length or note, dragging :'(
            this.cv.addEventListener('click', function(event){
                let mx, my, boundX, boundY;
                boundX      = grid*3+self.offset + grid;   //X-bounds to keep notes in piano roll
                boundY      = 15;    //Y-bounds to keep notes in piano roll, aligned with note
                mx          = event.pageX;
                my          = event.pageY;
                //no left associative assignemnt operator calls BURN IN HELL JS
                mx          = mx - rect.left;
                mx          = roundNum(mx, grid); //right now tracks are stuck at 0 left offset
                my          = my - rect.top - 10; //10 just aligns the note better 
                my          = roundNum(my,grid) + 15;//y position - boundingRec top offsest - 10 (for getting into the middle of the note)
                //set bounds for drawing window
                if(mx < boundX){
                    mx      = boundX;
                }
                if(my < boundY){
                    my      = boundY;
                }
                // console.log('check offset:' +mx + ":" +my);
                //draw note (circle for now)
                // self.cv.ctx.beginPath();
                // self.cv.ctx.arc(mx,my,10,0,2*Math.PI);
                self.cv.ctx.fillStyle = 'red';
                // self.cv.ctx.fill();
                let s       = 27;
                self.cv.ctx.fillRect(mx-(s/2),my-(s/2),s,s);
                // console.log('mx:' + mx + ' |s/2:' + (s/2) + ' |my:' + my);
                let c       = new Coord(mx-(s/2), my-(s/2), mx+(s/2),my+(s/2));
                //calculate note placement from mx
                let sub     = 90;       //adjustments for now
                let noteX   = mx - sub - self.offset; //sub offset to account for adding offset to starting draw pos on canvas
                console.log('noteX: ' + noteX + ' | noteX/grid: ' + noteX/grid);
                let noteLength = self.noteLength; //ms, change later 
                let noteBar = 1;
                let noteBeat= noteX/grid;
                if(noteBeat > 4){ //past first bar
                    noteBar = Math.floor(noteBeat/4) + 1; //<--we start at 1 not zero
                    noteBeat= noteBeat%4;
                    if(noteBeat%4 === 0){
                        noteBeat = 4;
                        noteBar-=1; //past first bar so take away the one from earlier
                    }
                }
                let noteTS = new timeSig(noteBeat, noteBar);

                //calulate note number from my and canvas offset.top // +-30 so grid
                let noteNumber  = (my - 15)/grid;
                noteNumber      = 60-noteNumber;
                let note        = new Note(noteLength, noteTS, noteNumber, c);
                notes.push(note);
                self.onNote     = true;
                console.log('beat: ' +noteBeat + " | bar: " + noteBar) ;
            },false);
            this.cv.addEventListener('mousemove', function(ev){
                let mx, my;
                mx = event.pageX;
                my = event.pageY;
                //no left associative assignemnt operator calls BURN IN HELL JS
                mx = mx - rect.left;
                mx = roundNum(mx, grid); //right now tracks are stuck at 0 left offset
                my = my - rect.top - grid/2; //10 just aligns the note better 
                my = roundNum(my,grid) + 15;
                for(let i = 0; i < notes.length; i++){
                    //console.log('mx:' + mx + " |my:" + my + ' |x1:' + notes[0].coord.x1 + ' |y1:' + notes[0].coord.y1);
                    if((Math.abs(mx - notes[i].coord.x1) <= grid/2) && (Math.abs(my - notes[i].coord.y1) <= grid/2)){
                        this.style.cursor = 'e-resize';
                        self.onNote = true;
                        return;     //sorry OOP but otherwise logic is fookin annoying, early return to commit to onNote and not fire false for others
                    }
                    else{   //onNote false only if 
                        self.onNote = false;
                        this.style.cursor = 'default';
                    }
                }
            },false);

            //create context menu if over note (onNote is true) to extra note options, remove element if we click away
            this.cv.addEventListener('contextmenu', function(ev){
                ev.preventDefault();
                let cv = this;
                let ct;
                try{
                    ct = document.getElementById('noteOptions');
                    //if(Math.abs(ct.getBoundingClientRect.top-ev.pageY) <= grid && Math.abs(ct.getBoundingClientRect.left-ev.pageX) <= grid){
                        ct.parentNode.removeChild(ct);
                    //}
                }
                catch{
                    ct = null
                }
                if(self.onNote){
                    console.log('context menu');
                    let contextMenu = document.createElement('div');
                    contextMenu.id = 'noteOptions';
                    contextMenu.className = 'navbar';
                    contextMenu.classList.add('show');
                    //styling and positioning for contextMenu
                    contextMenu.style = 'position:absolute';
                    contextMenu.style.left = ev.pageX + 'px';
                    contextMenu.style.top = ev.pageY + 'px';
                    contextMenu.style.width = grid*5 + 'px';
                    contextMenu.style.height = self.contextMenuButtonHeight*self.trackOptions.length;
                    
                    //iterate through trackOptions (from constructor) adding names to them, append to contextMenu as child
                    for(let t in self.trackOptions){
                        let option = document.createElement('a');
                        option.id = 'noteOptions';
                        option.className = 'dropdown';
                        option.innerText = self.trackOptions[t];
                        
                        contextMenu.appendChild(option);
                        console.log(option.parentNode.style.width);
                        option.style.width = option.parentNode.style.width;
                        option.style.paddingLeft = '0px';
                        option.style.textAlign='center';
                        let s     = self.trackOptions[t];
                        let short = self.trackOptions[t].toLowerCase();
                        if(short === 'remove note'){
                            option.onclick = function(){
                                console.log(option.innerText);
                                let mousePos = trackMouse(self.cv);
                                //cv.fillRect(self)
                            }
                        }
                        else if(short === 'copy note'){
                            option.onclick = function(){
                                console.log("IT ALL WORKS!");
                            }
                        }
                    }

                    document.body.appendChild(contextMenu); //add contextMenu to end of html body 
                    
                    
                }
            },false);

        }
        
        
    }
}

function trackMouse(canvasElement){
    let rect = canvasElement.getBoundingClientRect();
    let mx, my;
    mx = event.pageX;
    my = event.pageY;
    //no left associative assignemnt operator calls BURN IN HELL JS
    mx = mx - rect.left;
    mx = roundNum(mx, grid); //right now tracks are stuck at 0 left offset
    my = my - rect.top - grid/2; //10 just aligns the note better 
    my = roundNum(my,grid) + 15;
    console.log('trackmouse returning mx: ' + mx + ' |my: ' + my);
    return {
      mx : mx,
      my : my 
    };
}