let eventcanvas = document.getElementById("dotsCanvas");
initDoc();buildKeys();

eventcanvas.addEventListener("mousedown",(event) => {
    let canvRect = eventcanvas.getBoundingClientRect();
    let maxWidth = eventcanvas.width;
    let maxHeight = eventcanvas.height;
    let gap = maxWidth/greenPoints.length;
    let unit = maxHeight*0.8/2;
    let targX = maxWidth * event.offsetX / canvRect.width;
    let targY = maxHeight * event.offsetY / canvRect.height;

        targY = (maxHeight/2 - targY);
        targY = Math.max(-unit,Math.min(targY,unit))/unit;
        targY = Math.floor(targY*20)/20;

    let whichDot = Math.floor(targX/gap);
    let whichCol = (targX/gap - Math.floor(targX/gap))<0.5;
    if (whichCol){
        //green
        greenPoints[whichDot] = targY;
        colours = true;
        grabbed = whichDot;
    } else {
        //blue
        bluePoints[whichDot] = targY;
        colours = false;
        grabbed = whichDot;
    }

    refreshAll();
});

eventcanvas.addEventListener("mouseup", (event) => {
    grabbed=-1;
});

eventcanvas.addEventListener("mousemove", (event) => {
    if (grabbed>-1) {
        let canvRect = eventcanvas.getBoundingClientRect();
        let maxHeight = eventcanvas.height;
        let unit = maxHeight*0.8/2;
        let targY = maxHeight * event.offsetY / canvRect.height;

        targY = (maxHeight/2 - targY);
        targY = Math.max(-unit,Math.min(targY,unit))/unit;
        targY = Math.floor(targY*20)/20;

        if (colours) greenPoints[grabbed] = targY;
        else bluePoints[grabbed] = targY;

        refreshAll();
    }
});

document.addEventListener("keydown",(event) => {
    if (event.repeat) {}
    else switch(event.key){
        case 'a': case 'A':
            noteOn(rootEle);
            break;
        case 's': case 'S':
            noteOn(rootEle*Math.pow(stepEle,2));
            break;
        case 'd': case 'D':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,3));
            else noteOn(rootEle*Math.pow(stepEle,4));
            break;
        case 'f': case 'F':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,5));
            else noteOn(rootEle*Math.pow(stepEle,6));
            break;
        case 'g': case 'G':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,7));
            else noteOn(rootEle*Math.pow(stepEle,8));
            break;
        case 'h': case 'H':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,8));
            else noteOn(rootEle*Math.pow(stepEle,10));
            break;
        case 'j': case 'J':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,10));
            else noteOn(rootEle*Math.pow(stepEle,12));
            break;
        case 'k': case 'K':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,12));
            else noteOn(rootEle*Math.pow(stepEle,14));
            break;
        case 'l': case 'L':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,14));
            else noteOn(rootEle*Math.pow(stepEle,16));
            break;
        case 'w': case 'W':
            noteOn(rootEle*Math.pow(stepEle,1));
            break;
        case 'e': case 'E':
            if (keyCount==12) {}
            else noteOn(rootEle*Math.pow(stepEle,3));
            break;
        case 'r': case 'R':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,4));
            else noteOn(rootEle*Math.pow(stepEle,5));
            break;
        case 't': case 'T':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,6));
            else noteOn(rootEle*Math.pow(stepEle,7));
            break;
        case 'y': case 'Y':
            if (keyCount==12) {}
            else noteOn(rootEle*Math.pow(stepEle,9));
            break;
        case 'u': case 'U':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,9));
            else noteOn(rootEle*Math.pow(stepEle,11));
            break;
        case 'i': case 'I':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,11));
            else noteOn(rootEle*Math.pow(stepEle,13));
            break;
        case 'o': case 'O':
            if (keyCount==12) noteOn(rootEle*Math.pow(stepEle,13));
            else noteOn(rootEle*Math.pow(stepEle,15));
            break;
        case 'p': case 'P':
            if (keyCount==12) {}
            else noteOn(rootEle*Math.pow(stepEle,17));
            break;
    }
});
document.addEventListener("keyup",(event) => {
    switch(event.key){
        case 'a': case 'A':
            noteOff(rootEle);
            break;
        case 's': case 'S':
            noteOff(rootEle*Math.pow(stepEle,2));
            break;
        case 'd': case 'D':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,3));
            else noteOff(rootEle*Math.pow(stepEle,4));
            break;
        case 'f': case 'F':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,5));
            else noteOff(rootEle*Math.pow(stepEle,6));
            break;
        case 'g': case 'G':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,7));
            else noteOff(rootEle*Math.pow(stepEle,8));
            break;
        case 'h': case 'H':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,8));
            else noteOff(rootEle*Math.pow(stepEle,10));
            break;
        case 'j': case 'J':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,10));
            else noteOff(rootEle*Math.pow(stepEle,12));
            break;
        case 'k': case 'K':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,12));
            else noteOff(rootEle*Math.pow(stepEle,14));
            break;
        case 'l': case 'L':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,14));
            else noteOff(rootEle*Math.pow(stepEle,16));
            break;
        case 'w': case 'W':
            noteOff(rootEle*Math.pow(stepEle,1));
            break;
        case 'e': case 'E':
            if (keyCount==12) {}
            else noteOff(rootEle*Math.pow(stepEle,3));
            break;
        case 'r': case 'R':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,4));
            else noteOff(rootEle*Math.pow(stepEle,5));
            break;
        case 't': case 'T':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,6));
            else noteOff(rootEle*Math.pow(stepEle,7));
            break;
        case 'y': case 'Y':
            if (keyCount==12) {}
            else noteOff(rootEle*Math.pow(stepEle,9));
            break;
        case 'u': case 'U':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,9));
            else noteOff(rootEle*Math.pow(stepEle,11));
            break;
        case 'i': case 'I':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,11));
            else noteOff(rootEle*Math.pow(stepEle,13));
            break;
        case 'o': case 'O':
            if (keyCount==12) noteOff(rootEle*Math.pow(stepEle,13));
            else noteOff(rootEle*Math.pow(stepEle,15));
            break;
        case 'p': case 'P':
            if (keyCount==12) {}
            else noteOff(rootEle*Math.pow(stepEle,17));
            break;
    }
});
