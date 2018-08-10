class Track{
    constructor(){
        this.notes = [];
        this.div;
        this.keys = [];
        this.map = createArray(10,10);
        this.grid = 50;
        this.cv;
        this.notes = ['c', 'c#','d','d#','e','f','f#','g','g#','a','a#','b','b#'];
        this.length = 20;
        this.height = 10;
    }
    
    //some sort of canvas to keep track of notes?
    
    //Might not be necessary in since tracks arent responsible for audio
    play (){
        if(!playing){ /*start playing*/} 
    }
    suspend(){
        if(playing){ /*stop playing*/ }
    }
    create(type){
        let l = this.length;
        let h = this.height;
        this.cv = document.createElement('canvas');
        this.cv.width = l*this.grid+(this.grid*2)
        this.cv.height = h*this.grid;
        this.cv.style =`
                    border:1px solid #000000;
        
                    `
        this.cv.alt = document.createAttribute("Virtual Instrument Track Piano Roll");
        this.cv.ctx = this.cv.getContext('2d');
        document.body.appendChild(this.cv);

        if(type === 1){ //audio track
            //smart kid stuff here
        }
        else if(type === 2){    //virtual inst track
            // console.log(this);
            // let self  = this;
            // this.notes = ['c', 'c#','d','d#','e','f','f#','g','g#','a','a#','b','b#']
            // for(let i = 0; i < this.notes.length; i++){  
            //     let key;
            //     key = document.createElement('img');
            //     key.individual = Math.floor(Math.random()*10);
            //     key.className = 'wk';
            //     if(this.notes[i].includes('#')){
            //         key.src = 'w_keyblack.png';
            //     }
            //     else{
            //         key.src = 'w_key.png';
            //     }
            //     key.key = this.notes[i];
            //     document.body.appendChild(key);
            // }
            let self  = this;
            for(let i = 0; i < this.notes.length; i++){  
                let key;
                key = new Image();
                key.className = 'wk';
                if(this.notes[i].includes('#')){
                    key.src = 'w_keyblack.png';
                }
                else{
                    key.src = 'w_key.png';
                }
                this.keys.push(key);
                key.onload = function(){
                    self.cv.ctx.drawImage(key, 0, self.grid*i);

                }
            }
            this.cv.ctx.beginPath();
            this.cv.ctx.moveTo(100,0);
            this.cv.ctx.lineTo(100,self.grid*l);
            this.cv.ctx.stroke();
        }
    }
}