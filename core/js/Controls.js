var cntrl = false;

function Controls(){


document.addEventListener('keydown', (event) => {
    //event.preventDefault();
    const keyName = event.key;
    if(keyName === 'Control'){
        if(!cntrl){
            cntrl = true;
        }
    }
    switch(keyName){
        case 'g':

        break;
        case 'f':

        break;
        case 'h':

        break;
        case ' ':
            if(controller.playing){
                controller.pause();
                controller.playing = false;
            }
            else{
                controller.play();
                controller.playing = true;
            }
            if(cntrl){
                restartPlayback();
            }
        break;
        
        
        
    }
    
}, false);

document.addEventListener('keyup', (event)=>{
    const keyName = event.key;
    switch(keyName){
        case 'Control':
            if(cntrl){
                cntrl = false;
            }
           
        break;
    }
    
}, false);

}
