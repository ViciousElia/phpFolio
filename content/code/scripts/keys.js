    var greenPoints = [];
    var bluePoints = [];
    var wavePoints = [];
    var fourierPoints = null;
    var grabbed = -1;
    var colours = false;

    var audioCtx = new AudioContext();
    var oscillatorEle = [];
    var gainEle = [];
    var waveEle = null;
    var typeEle = '';
    
    var dampEle = -1;
    var fadeEle = 2;
    var ringEle = 5;
    var volEle = 0.25;
    var hitEle = 0.6;
    
    var stepEle = null;
    var rootEle = 220;
    var keyCount = null;
    
    const topKeys = ['W','E','R','T','Y','U','I','O','P','-','-','-','-','-','-','-','-','-','-'];
    const bottomKeys = ['A','S','D','F','G','H','J','K','L','-','-','-','-','-','-','-','-','-','-'];

    function copyCanv(destClass,sourceId){
        let sourceCanv = document.getElementById(sourceId);
        for (let each of document.getElementsByClassName(destClass)) each.getContext("2d").drawImage(sourceCanv,0,0);
    }
    function DFT(points,splitIt=false){
        let fPoints = [[points[0],0]];
        for (let iter=0;iter<points.length;iter++){
            let rVal=points[0];
            let iVal=0;
            for (let jter=0;jter<points.length;jter++){
                rVal+=points[jter]*Math.cos(2*Math.PI*iter*jter/points.length);
                iVal-=points[jter]*Math.sin(2*Math.PI*iter*jter/points.length);
            }
            fPoints.push([rVal,iVal]);
        }
        if (splitIt) {
            let sPoints = [];
            let rPoints = [];
            let iPoints = [];
            for (let iter=0;iter<fPoints.length;iter++){
                rPoints.push(fPoints[iter][0]);
                iPoints.push(fPoints[iter][1]);
            }
            sPoints.push(rPoints);
            sPoints.push(iPoints);
            return sPoints;
        }
        else return fPoints;
    }
    function drawWaves(){
        canvas = document.getElementById("waveCanvas");
        ctx = canvas.getContext("2d");

        let gap = canvas.width/greenPoints.length;
        let unit = canvas.height*0.8/2;
        let rad = canvas.height/20;

        ctx.beginPath();
        ctx.moveTo(0,canvas.height/2-unit*wavePoints[0]);
        for (let iter=0;iter<wavePoints.length;iter++){
            ctx.lineTo((iter+1)*gap,canvas.height/2-unit*wavePoints[(iter+1)%wavePoints.length]);
        }
        ctx.stroke();
        for(let side of document.getElementsByClassName("sideCanvas")){
            side.getContext("2d").drawImage(canvas,0,0);
        }
    }
    function initWaves(){
        wavePoints = [];
        wavePoints.push((greenPoints[0]+bluePoints[greenPoints.length-1])/2);
        for (let iter=1;iter<greenPoints.length;iter++){
            wavePoints.push((greenPoints[iter]+bluePoints[iter-1])/2);
        }
        drawWaves();
        fourierPoints = DFT(wavePoints,true);
        waveEle = audioCtx.createPeriodicWave(fourierPoints[0],fourierPoints[1]);
    }
    function drawPoints(){
        let canvas = document.getElementById("dotsCanvas");
        let ctx = canvas.getContext("2d");
        let manvas = document.getElementById("middleCanvas");
        let mtx = manvas.getContext("2d");

        let gap = canvas.width/greenPoints.length;
        let unit = canvas.height*0.8/2;
        let rad = canvas.height/20;

        for (let iter=0;iter<greenPoints.length;iter++){
            ctx.fillStyle="#00b464";
            ctx.beginPath();
            if (iter==0) ctx.arc(iter*gap,canvas.height/2-unit*greenPoints[iter],rad,0,2*Math.PI);
            else ctx.arc(iter*gap,canvas.height/2-unit*greenPoints[iter],rad,-Math.PI/2,Math.PI/2);
            ctx.fill();
            ctx.fillStyle="#0064b4";
            ctx.beginPath();
            if(iter==greenPoints.length-1){
                ctx.arc((iter+1)*gap,canvas.height/2-unit*bluePoints[iter],rad,0,2*Math.PI);
            } else {
                ctx.arc((iter+1)*gap,canvas.height/2-unit*bluePoints[iter],rad,Math.PI/2,3*Math.PI/2);
            }
            ctx.fill();
            mtx.strokeStyle = "#808080";
            mtx.beginPath();
            mtx.moveTo(iter*gap,canvas.height/2-unit*greenPoints[iter]);
            mtx.lineTo((iter+1)*gap,canvas.height/2-unit*bluePoints[iter]);
            if (iter<greenPoints.length-1) mtx.lineTo((iter+1)*gap,canvas.height/2-unit*greenPoints[iter+1]);
            mtx.stroke();
        }
    }
    function initDoc(){
        greenPoints.push(0);greenPoints.push(0);greenPoints.push(0);greenPoints.push(0);
        bluePoints.push(0);bluePoints.push(1);bluePoints.push(-1);bluePoints.push(0);

        let canvas = document.getElementById("middleCanvas");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#c0c0c0";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        drawPoints();
        initWaves();
    }
    function clearCanv(which){
        let canvas = document.getElementById(which);
        let ctx = canvas.getContext("2d");
        if (which=="middleCanvas"){
            ctx.fillStyle = "#c0c0c0";
            ctx.fillRect(0,0,canvas.width,canvas.height);
        } else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    function noteOn(which=440,click=false){
        oscillatorEle[which] = audioCtx.createOscillator();
        if (typeEle==='') oscillatorEle[which].setPeriodicWave(waveEle);
        else oscillatorEle[which].type=typeEle;
        oscillatorEle[which].frequency.value = which;
        gainEle[which] = audioCtx.createGain();
        gainEle[which].gain.value = volEle;
        oscillatorEle[which].connect(gainEle[which]);
        gainEle[which].connect(audioCtx.destination);
        oscillatorEle[which].start(0);
        if (dampEle>-1) {
            gainEle[which].gain.exponentialRampToValueAtTime(hitEle, audioCtx.currentTime + .0001);
            gainEle[which].gain.exponentialRampToValueAtTime(dampEle, audioCtx.currentTime + ringEle);
        }
        if (click) { gainEle[which].gain.exponentialRampToValueAtTime(hitEle, audioCtx.currentTime + .0001);gainEle[which].gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 3);}
    }
    function noteOff(which=440){
        gainEle[which].gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + fadeEle);
        oscillatorEle[which].stop(audioCtx.currentTime + fadeEle);
    }
    function refreshAll(){
        clearCanv("middleCanvas");
        clearCanv("waveCanvas");
        clearCanv("dotsCanvas");
        for (let each of document.getElementsByClassName("sideCanvas")){
            let stx = each.getContext("2d");
            stx.clearRect(0,0,canvas.width,canvas.height);
        }
        drawPoints();
        initWaves();
    }
    function initPoints(){
        let newPoints = Number(document.getElementById("numPoints").value);
        if (newPoints<greenPoints.length+1){
            while (greenPoints.length+1>newPoints) {
                greenPoints.pop();
                bluePoints.pop();
            }
        } else {
            while (greenPoints.length+1<newPoints) {
                greenPoints.push(0);
                bluePoints.push(0);
            }
        }
        refreshAll();
    }
    function setWave(){
        for (let ele of document.getElementsByName('waveForm')){
            if (ele.checked) {
                if (ele.value=='custWave') typeEle='';
                else typeEle = ele.value;
                break;
            }
        }
        let dotCanv = document.getElementById("dotsCanvas");
        let pointCount = document.getElementById("numPoints");
        if (typeEle==='') {
            dotCanv.setAttribute("style","grid-area:1/2;z-index:3;width: 100%;");
            numPoints.removeAttribute("style");
            refreshAll();
        }
        else {
            dotCanv.setAttribute("style","display:none");
            numPoints.setAttribute("style","display:none");
            clearCanv("middleCanvas");
            clearCanv("waveCanvas");
            clearCanv("dotsCanvas");
            let canvas=document.getElementById("waveCanvas");
            let ctx=canvas.getContext("2d");

            ctx.beginPath();
            switch(typeEle){
                case 'sine':
                    ctx.moveTo(0,canvas.height/2);
                    for(let iter=0;iter<41;iter++) ctx.lineTo(iter*canvas.width/40,canvas.height/2-canvas.height*Math.sin(iter*Math.PI/20)/4); 
                    break;
                case 'square':
                    ctx.moveTo(0,canvas.height/4);
                    ctx.lineTo(canvas.width/2,canvas.height/4);
                    ctx.lineTo(canvas.width/2,3*canvas.height/4);
                    ctx.lineTo(canvas.width,3*canvas.height/4);
                    break;
                case 'triangle':
                    ctx.moveTo(0,canvas.height/2);
                    ctx.lineTo(canvas.width/4,canvas.height/4);
                    ctx.lineTo(3*canvas.width/4,3*canvas.height/4);
                    ctx.lineTo(canvas.width,canvas.height/2);
                    break;
                case 'sawtooth':
                    ctx.moveTo(0,canvas.height/2);
                    ctx.lineTo(canvas.width/2,canvas.height/4);
                    ctx.lineTo(canvas.width/2,3*canvas.height/4);
                    ctx.lineTo(canvas.width,canvas.height/2);
                    break;
                default:
                    break;
            }
            ctx.stroke();
        }
        for (let each of document.getElementsByClassName("sideCanvas")){
            let stx = each.getContext("2d");
            stx.clearRect(0,0,each.width,each.height);
        }
    }
    function setStyle(){
        for (let ele of document.getElementsByName('playStyle')){
            if (ele.checked) {
                if (ele.value=="sustain") {dampEle=-1;}
                if (ele.value=="damp") {dampEle=0.001;ringEle=10;}
                if (ele.value=="strike") {dampEle=0.00001;ringEle=5;}
                break;
            }
        }
    }
    function buildKeys(){
        keyCount=12;
        for (let ele of document.getElementsByName('noteCount')){
            if (ele.checked) {
                keyCount = Number(ele.value);
                break;
            }
        }
        let keyGroup = document.getElementById("keyGroup");
        let topRow = document.createElement("div");
        let bottomRow = document.createElement("div");
        while (keyGroup.children.length>0){
            keyGroup.children[0].remove();
        }
        stepEle = Math.pow(2,1/keyCount);
        let extra = 0;
        let keyWidth = "12.4%";
        let keyMax = "116px";
        if (keyCount%2)
        {
            keyWidth = ''+(195/(keyCount+3))+'%';
            keyMax = ''+Math.floor(1700/(keyCount+3)-1)+'px'
            extra=1;
        } else if (keyCount!=12){
            keyWidth = ''+(195/(keyCount+2))+'%';
            keyMax = ''+Math.floor(1700/(keyCount+2)-1)+'px'
            extra=0;
        }
        topRow.setAttribute("style","display:flex");
        bottomRow.setAttribute("style","display:flex");
        let topStep=0;
        let bottomStep=0;
        for (let iter=0;iter<=keyCount+extra;iter++){
            let nextKey = document.createElement("div");
            nextKey.setAttribute("onClick","noteOn("+(Math.pow(stepEle,iter)*rootEle)+",true)");
            if (iter==1) {
                nextKey.setAttribute("style","width:"+keyWidth+";max-width:"+keyMax+";height:100px;margin:0 1px;margin-left:calc("+keyWidth+" / 2);float:left;background-color:hsl("+(iter*360/keyCount+470/3)+"deg 100% 32.2%)");
            } else {
                nextKey.setAttribute("style","width:"+keyWidth+";max-width:"+keyMax+";height:100px;margin:0 1px;float:left;background-color:hsl("+(iter*360/keyCount+470/3)+"deg 100% 32.2%)");
            }
            if(keyCount==12){
                switch(iter){
                    case 1: case 4: case 6: case 9: case 11:
                        if (iter==1) nextKey.setAttribute("style","width:"+keyWidth+";max-width:"+keyMax+";height:100px;margin:0 1;float:left;margin-left:calc("+keyWidth+" / 2);background-color:hsl("+(iter*360/keyCount+470/3)+"deg 100% 32.2%)");
                        else nextKey.setAttribute("style","width:"+keyWidth+";max-width:"+keyMax+";height:100px;margin:0 1;float:left;background-color:hsl("+(iter*360/keyCount+470/3)+"deg 100% 32.2%)");
                        nextKey.innerHTML = '<p style="margin: calc(50px - 1em / 2) auto;text-align: center;">'+topKeys[topStep]+'</p>';
                        topStep++;
                        topRow.append(nextKey);
                        if(iter==1 || iter==6){
                            let filler = document.createElement("div");
                            filler.setAttribute("style","width:"+keyWidth+";max-width:"+keyMax+";height:100px;margin:0 1;float:left;background-color:rgba(0,0,0,0)");
                            topRow.append(filler);
                            topStep++;
                        }
                        break;
                    default:
                        nextKey.innerHTML = '<p style="margin: calc(50px - 1em / 2) auto;text-align: center;">'+bottomKeys[bottomStep]+'</p>';
                        bottomStep++;
                        bottomRow.append(nextKey);
                        break;
                }
            } else {
                if (iter%2) {
                    nextKey.innerHTML = '<p style="margin: calc(50px - 1em / 2) auto;text-align: center;">'+topKeys[topStep]+'</p>';
                    topStep++;
                    topRow.append(nextKey);
                } else {
                    nextKey.innerHTML = '<p style="margin: calc(50px - 1em / 2) auto;text-align: center;">'+bottomKeys[bottomStep]+'</p>';
                    bottomStep++;
                    bottomRow.append(nextKey);
                }
            }
//            keyGroup.append(nextKey);
        }
        keyGroup.append(topRow);
        keyGroup.append(bottomRow);
    }
    function killAudio(){
        audioCtx.close();
        audioCtx = new AudioContext();
    }
