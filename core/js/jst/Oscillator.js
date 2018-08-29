class Oscillator{
    constructor(parent){
        this.type;
        this.filters;
        this.ui = null;
        this.output;
        this.canvas;
        this.canvasW = 200;
        this.canvasH = 200;
        this.parent = parent;
    }
    create(){

    }
    drawUI(){
        let self = this;
        if(this.ui === null){
            
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
                self.ui = null;
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

            //place div where mouse lands (click and drag effect)
            document.addEventListener('mouseup', function(ev){
                console.log('mouseup');
                if(moving){
                    moving = false;
                    let px, py, dh, dw;
                    px = ev.pageX;
                    py = ev.pageY;
                    dh = $(document).height();
                    dw = $(document).width()
                    if(px > dw){
                        px = dw-self.ui.style.width; //minus size of div from width of page so it stays in view;
                    }
                    if(px < 0){
                        px = self.ui.style.left;
                    }
                    if(py < 0){
                        py = 0;
                    }
                    if(py > dh){
                        py = dh-self.ui.style.height; //minus size of div from height side of page so it stays in view
                    }
                    self.ui.style.left = px +'px';
                    self.ui.style.top = py+'px';;
                }
            }, false);
            document.body.appendChild(ui);
            ui.style.left = window.pageXOffset + 'px';
            //ui.style.top = self.parent.style.left +'px';
            console.log(self.parent);
            
        }
        else{
            this.ui.style.left = event.pageX + self.canvasW + 'px';
            this.ui.style.top = event.pageY +'px'; 
        }
    }
}