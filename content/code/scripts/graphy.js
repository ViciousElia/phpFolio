var graphTable;
var raf;
var canvas = document.getElementById("graphCanvas");
var ctx = null;
var freeze = -1;
function buildGraph() {
    if (canvas===null) canvas = document.getElementById("graphCanvas");
    graphTable = [];
    let gSize = Number(document.getElementById("graphSize").value);
    let gString = document.getElementById("graphString").value.split(',');
    let centre = canvas.width/2;
    let radius = canvas.width/4;
    for (let iter=0;iter<gSize;iter++){
        var thisEdges = [];
        for (let edge of gString){
            if (edge==='') continue;
            let spliter = edge.split('-');
            if (Number(spliter[0])>gSize || Number(spliter[1])>gSize) continue;
            if (Number(spliter[0])==Number(spliter[1])) continue;
            if (Number(spliter[0])==(iter+1)) thisEdges.push(Number(spliter[1])-1);
            else if (Number(spliter[1])==(iter+1)) thisEdges.push(Number(spliter[0])-1);
        }
        const thisEle = {
            xPos     : centre + (radius*Math.cos(2*iter*Math.PI/gSize)),
            yPos     : centre + (radius*Math.sin(2*iter*Math.PI/gSize)),
            xVel     : radius*Math.cos(2*iter*Math.PI/gSize)*.0625,
            yVel     : radius*Math.sin(2*iter*Math.PI/gSize)*.0625,
            edgeList : thisEdges,
        }
        graphTable.push(thisEle);
    }
}
function drawGraph() {
    if (canvas===null) canvas = document.getElementById("graphCanvas");
    if (ctx===null) ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "#808080";
    ctx.fillStyle = "#00b464";
    for (let iter=0;iter<graphTable.length;iter++){
        let vertex = graphTable[iter];
        if (vertex['edgeList'].length<1) continue;
        for (let edge of vertex['edgeList']){
            if (edge >= graphTable.length) continue;
            ctx.beginPath();
            ctx.moveTo(vertex['xPos'],vertex['yPos']);
            ctx.lineTo(graphTable[edge]['xPos'],graphTable[edge]['yPos']);
            ctx.stroke();
        }
    }
    for (let vertex of graphTable){
        ctx.beginPath();
        ctx.arc(vertex['xPos'],vertex['yPos'],10,0,2*Math.PI);
        ctx.fill();
    }
}
function updateGraph(){
    if (canvas==null) canvas = document.getElementById("graphCanvas");
    const centre = canvas.width/2;
    for (let iter=0;iter<graphTable.length;iter++){
        if (freeze==iter) continue;
        vertex = graphTable[iter]
        let xForce = (1/100)*(centre-vertex['xPos']);
        let yForce = (1/100)*(centre-vertex['yPos']);
        
        for (let jter=0;jter<graphTable.length;jter++){
            if (iter==jter) continue;
            let oldX = graphTable[iter]['xPos'];
            let oldY = graphTable[iter]['yPos'];
            let newX = graphTable[jter]['xPos'];
            let newY = graphTable[jter]['yPos'];
            let rad = Math.pow(Math.pow(newX-oldX,2)+Math.pow(newY-oldY,2),0.5);
            let dist = 160-rad;
            let ang = Math.atan2(newY-oldY,newX-oldX);
            if (rad<1) rad=1;

            if (vertex['edgeList'].includes(jter)){
                xForce -= 0.05*dist*Math.cos(ang);
                yForce -= 0.05*dist*Math.sin(ang);
            } else {
                xForce -= 50000*Math.cos(ang)/(rad*rad);
                yForce -= 50000*Math.sin(ang)/(rad*rad);
            }
        }
        
        vertex['xPos'] += vertex['xVel']+xForce/2;
        vertex['yPos'] += vertex['yVel']+yForce/2;
        vertex['xVel'] = (vertex['xVel']+xForce)*0.75;
        vertex['yVel'] = (vertex['yVel']+yForce)*0.75;

        if (vertex['xPos']<0) vertex['xPos']=0;
        if (vertex['yPos']<0) vertex['yPos']=0;
        if (vertex['xPos']>canvas.width-1) vertex['xPos']=canvas.width-1;
        if (vertex['yPos']>canvas.width-1) vertex['yPos']=canvas.width-1;
    }
}
function cycle(){
    updateGraph();
    drawGraph();
    raf = window.requestAnimationFrame(cycle);
}
function animateGraph(run=true){
    if (run) cycle();
    else window.cancelAnimationFrame(raf);
}
function specialGraph(which){
    let newString = '';
    let gSize = Number(document.getElementById('graphSize').value);
    switch(which){
        case 'empty':
            break;
        case 'path':
            for (let iter=0;iter<gSize-1;iter++) newString += ''+(iter+1)+'-'+(iter+2)+',';
            newString = newString.slice(0,-1);
            break;
        case 'tree':
            let maxN = Math.ceil(0.5*(Math.sqrt(4*gSize-3)-1));
            let maxL = Math.floor((gSize-2)/maxN);
            for (let lter=0;lter<=maxL;lter++){
                for (let kter=1;kter<=maxN;kter++){
                    let cellNum = lter*maxN+1+kter;
                    if (cellNum>gSize) continue;
                    newString += ''+(lter+1)+'-'+cellNum+',';
                }
            }
            newString = newString.slice(0,-1);
            break;
        case 'binary':
            for (let iter=2;iter<=gSize;iter++) {
                let target = Math.floor(iter/2);
                newString += ''+(iter)+'-'+target+',';
            }
            newString = newString.slice(0,-1);
            break;
        case 'cycle':
            for (let iter=0;iter<gSize-1;iter++) newString += ''+(iter+1)+'-'+(iter+2)+',';
            newString += '1-'+gSize;
            break;
        case 'square':
            for (let iter=1;iter<gSize+1;iter++){
                if (iter%4===0) newString += ''+(iter-3)+'-'+(iter)+',';
                else if (iter+1<=gSize) newString += ''+(iter)+'-'+(iter+1)+',';
            }
            newString = newString.slice(0,-1);
            break;
        case 'complete':
            for (let iter=0;iter<gSize-1;iter++) {
                for (let jter=iter+1;jter<gSize;jter++) {
                    newString += ''+(iter+1)+'-'+(jter+1)+',';
                }
            }
            newString = newString.slice(0,-1);
            break;
        case 'random':
            for (let iter=0;iter<gSize-1;iter++) {
                for (let jter=iter+1;jter<gSize;jter++) {
                    if (Math.random()>0.7) newString += ''+(iter+1)+'-'+(jter+1)+',';
                }
            }
            newString = newString.slice(0,-1);
            break;
        default:
            break;
    }
    document.getElementById('graphString').value = newString;
    buildGraph();
    drawGraph();
}
