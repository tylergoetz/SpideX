class Oscillator{
    constructor(){
        this.type;
        this.filters;
        this.ui;
        this.output;
        this.canvas;
        this.canvasW = 200;
        this.canvasH = 200;
        //this.drawUI();
    }
    create(){

    }
    drawUI(){
        let self = this;
        let canvasW = this.canvasW;
        let canvasH = this.canvasH;

        
        let ui = document.createElement('div');
        this.ui = ui;
        ui.style.width = canvasW;
        ui.style.height = canvasH;
        ui.style.userSelect = 'none';
        ui.style.zIndex = '2';
        ui.style.border = 'solid';
        ui.style.borderColor = 'red';
    
        let table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        let tr = document.createElement('tr');
        
        let mover = document.createElement('th');
        mover.style.height = canvasH/10;
        mover.style.backgroundColor = '#111';
        mover.innerText = 'click and drag here to move';
        mover.style.borderBottom = 'solid';
        mover.style.borderColor = 'red';
        mover.style.padding = '0px';

        let close = document.createElement('th');
        close.style.height = canvasH/10;
        close.style.backgroundColor = '#111';
        close.style.color = 'red';
        close.innerText = 'X';
        //close.style.borderLeft = 'solid';
        close.style.borderBottom = 'solid';
        close.style.borderColor = 'red';
        close.style.padding = '0px';
        close.onclick = function(){
            document.body.removeChild(ui);
        }

        table.appendChild(tr);
        tr.appendChild(mover);
        tr.appendChild(close);

        canvas = document.createElement('canvas');
        canvas.style.width = canvasW;
        canvas.style.height = canvasH;
        canvas.style.display = 'block';


        //ui.appendChild(mover);
        ui.appendChild(table);
        ui.appendChild(canvas);
        ui.style.position = 'absolute';


        let moving = false;
        mover.onmousedown = function(ev){
            moving = true;
            console.log('entering moving');
        }
        document.addEventListener('mouseup', function(ev){
            console.log('mouseup');
            if(moving){
                moving = false;
                self.ui.style.left = ev.pageX + 'px';
                self.ui.style.top = ev.pageY + 'px';
            }
        }, false);
        document.body.appendChild(ui);


        
    }
}