function hashSeed(str){
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}
function seedRand(a,b,c,d){
    return function() {
        a |= 0; b |= 0; c |= 0; d |= 0; 
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}
var rand;

function dispGrid(){
    let grids = document.getElementById("showGrid");
    if (grids.checked) document.getElementById("gridCanvas").setAttribute("style","padding: 20px;border: 1px solid #808080;width:100%;margin:0 -20px;z-index:2;grid-area:1/1");
    else document.getElementById("gridCanvas").setAttribute("style","display:none");
}
function drawGrid(wide,tall){
    let ganvas = document.getElementById("gridCanvas");
    let gtx = ganvas.getContext("2d");
    gtx.clearRect(0,0,Number(ganvas.width),Number(ganvas.height));
    gtx.lineWidth=1;
    gtx.strokeStyle="#808080";
    for (let iter = 0;iter*wide<Number(ganvas.width);iter++){
        gtx.beginPath();
        gtx.moveTo(iter*wide,0);
        gtx.lineTo(iter*wide,Number(ganvas.height));
        gtx.stroke();
        gtx.beginPath();
        gtx.moveTo(0,iter*tall);
        gtx.lineTo(Number(ganvas.width),iter*tall);
        gtx.stroke();
    }
}
function newSeed(){
    document.getElementById("seedNum").value = Math.floor(Math.random()*4294967295);
}

class Room{
    constructor(newX=0,newY=0,newNat=true){
        this.x=newX;
        this.y=newY;
        this.exits=-1;
        this.space=255;
        this.shape=255;
        this.nat=newNat;
    }
    draw(ctx,globalW=33,globalH=33){
        //deal with exits
        let up    = (this.exits>>12) & 15;
        let down  = (this.exits>>8)  & 15;
        let left  = (this.exits>>4)  & 15;
        let right = (this.exits>>0)  & 15;
        let doorsClockwise = [[],[],[]]; // x,y,side
        let centre;
        let width;
        if ((up&12)!=0){
            doorsClockwise[2].push('u');
            doorsClockwise[2].push('u');
            doorsClockwise[1].push(0.1);
            doorsClockwise[1].push(0.1);
            switch (up&3){
                case 1:
                    centre = 0.3;
                    break;
                case 2:
                    centre = 0.7;
                    break;
                default:
                    centre = 0.5;
            }
            width = (up&12)>>2;
            if (width==3){
                doorsClockwise[0].push(0.1);
                doorsClockwise[0].push(0.9);
            } else {
                width /= 10.0;
                doorsClockwise[0].push(centre-width);
                doorsClockwise[0].push(centre+width);
            }
        }
        if ((right&12)!=0){
            doorsClockwise[2].push('r');
            doorsClockwise[2].push('r');
            doorsClockwise[0].push(0.9);
            doorsClockwise[0].push(0.9);
            switch (right&3){
                case 1:
                    centre = 0.3;
                    break;
                case 2:
                    centre = 0.7;
                    break;
                default:
                    centre = 0.5;
            }
            width = (right&12)>>2;
            if (width==3){
                doorsClockwise[1].push(0.1);
                doorsClockwise[1].push(0.9);
            } else {
                width /= 10.0;
                doorsClockwise[1].push(centre-width);
                doorsClockwise[1].push(centre+width);
            }
        }
        if ((down&12)!=0){
            doorsClockwise[2].push('d');
            doorsClockwise[2].push('d');
            doorsClockwise[1].push(0.9);
            doorsClockwise[1].push(0.9);
            switch (down&3){
                case 1:
                    centre = 0.3;
                    break;
                case 2:
                    centre = 0.7;
                    break;
                default:
                    centre = 0.5;
            }
            width = (down&12)>>2;
            if (width==3){
                doorsClockwise[0].push(0.9);
                doorsClockwise[0].push(0.1);
            } else {
                width /= 10.0;
                doorsClockwise[0].push(centre+width);
                doorsClockwise[0].push(centre-width);
            }
        }
        if ((left&12)!=0){
            doorsClockwise[2].push('l');
            doorsClockwise[2].push('l');
            doorsClockwise[0].push(0.1);
            doorsClockwise[0].push(0.1);
            switch (left&3){
                case 1:
                    centre = 0.3;
                    break;
                case 2:
                    centre = 0.7;
                    break;
                default:
                    centre = 0.5;
            }
            width = (left&12)>>2;
            if (width==3){
                doorsClockwise[1].push(0.9);
                doorsClockwise[1].push(0.1);
            } else {
                width /= 10.0;
                doorsClockwise[1].push(centre+width);
                doorsClockwise[1].push(centre-width);
            }
        }

        if (!this.nat){
            let spaceLength = 0.1 + 0.7*this.shape/256; // ideal room size in one direction
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            if (doorsClockwise[0].length==2){
                if (doorsClockwise[2][0]=='u') {
                    ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,(0.1+spaceLength)*globalH);
                }
                if (doorsClockwise[2][0]=='d') {
                    ctx.fillRect((this.x+doorsClockwise[0][1])*globalW,(this.y+0.9-spaceLength)*globalH,(doorsClockwise[0][0]-doorsClockwise[0][1])*globalW,(0.1+spaceLength)*globalH);
                }
                if (doorsClockwise[2][0]=='l') {
                    ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][1])*globalH,(0.1+spaceLength)*globalW,(doorsClockwise[1][0]-doorsClockwise[1][1])*globalH);
                }
                if (doorsClockwise[2][0]=='r') {
                    ctx.fillRect((this.x+0.9-spaceLength)*globalW,(this.y+doorsClockwise[1][0])*globalH,(0.1+spaceLength)*globalW,(doorsClockwise[1][1]-doorsClockwise[1][0])*globalH);
                }
            } else if (doorsClockwise[2][0]=='d') { // LD Corner
                ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][3])*globalH,doorsClockwise[0][0]*globalW,(doorsClockwise[1][2]-doorsClockwise[1][3])*globalH);
                ctx.fillRect((this.x+doorsClockwise[0][1])*globalW,(this.y+doorsClockwise[1][3])*globalH,(doorsClockwise[0][0]-doorsClockwise[0][1])*globalW,(1-doorsClockwise[1][3])*globalH);
                let up;
                let left;
                if (doorsClockwise[1][3]+spaceLength>0.9) up = 0.9-spaceLength;
                else up = doorsClockwise[1][3];
                if (doorsClockwise[0][0]-spaceLength<0.1) left = 0.1;
                else left = doorsClockwise[0][0]-spaceLength;
                ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
            } else if (doorsClockwise[2][0]=='r') {
                if (doorsClockwise[2][2]=='l') { // RL Hallway
                    ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][3])*globalH,(0.55)*globalW,(doorsClockwise[1][2]-doorsClockwise[1][3])*globalH);
                    ctx.fillRect((this.x+0.45)*globalW,(this.y+doorsClockwise[1][0])*globalH,(0.55)*globalW,(doorsClockwise[1][1]-doorsClockwise[1][0])*globalH);
                    spaceLength = Math.min(Math.max(doorsClockwise[1][0]-doorsClockwise[1][2]+0.1,doorsClockwise[1][3]-doorsClockwise[1][1]+0.1,spaceLength),0.8);
                    let up = Math.max(0.1,((doorsClockwise[1][0]+doorsClockwise[1][1]+doorsClockwise[1][2]+doorsClockwise[1][3])/4) - (spaceLength/2));
                    if (up+spaceLength>0.9) up = 0.9-spaceLength;
                    let left = 0.5 - (spaceLength/2);
                    ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                }
                else if (doorsClockwise[2].length>4) { // RDL Intersection
                    let mid = (doorsClockwise[0][2]+doorsClockwise[0][3])/2;
                    ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][5])*globalH,(mid)*globalW,(doorsClockwise[1][4]-doorsClockwise[1][5])*globalH);
                    ctx.fillRect((this.x+mid)*globalW,(this.y+doorsClockwise[1][0])*globalH,(1-mid)*globalW,(doorsClockwise[1][1]-doorsClockwise[1][0])*globalH);
                    ctx.fillRect((this.x+doorsClockwise[0][3])*globalW,(this.y+doorsClockwise[1][0])*globalH,(doorsClockwise[0][2]-doorsClockwise[0][3])*globalW,(1-doorsClockwise[1][0])*globalH);
                    spaceLength = Math.min(Math.max(doorsClockwise[1][0]-doorsClockwise[1][4]+0.1,doorsClockwise[1][5]-doorsClockwise[1][1]+0.1,spaceLength),0.8);
                    let up = Math.max(0.1,((doorsClockwise[1][0]+doorsClockwise[1][1]+doorsClockwise[1][4]+doorsClockwise[1][5])/4) - (spaceLength/2));
                    if (up+spaceLength>0.9) up = 0.9-spaceLength;
                    let left = Math.max(mid-spaceLength/2,0.1);
                    if (left+spaceLength>0.9) left = 0.9-spaceLength;
                    ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                } else { // RD Corner
                    ctx.fillRect((this.x+doorsClockwise[0][3])*globalW,(this.y+doorsClockwise[1][0])*globalH,(1-doorsClockwise[0][3])*globalW,(doorsClockwise[1][1]-doorsClockwise[1][0])*globalH);
                    ctx.fillRect((this.x+doorsClockwise[0][3])*globalW,(this.y+doorsClockwise[1][0])*globalH,(doorsClockwise[0][2]-doorsClockwise[0][3])*globalW,(1-doorsClockwise[1][0])*globalH);
                    let up;
                    let left;
                    if (doorsClockwise[1][0]+spaceLength>0.9) up = 0.9-spaceLength;
                    else up = doorsClockwise[1][0];
                    if (doorsClockwise[0][3]+spaceLength>0.9) left = 0.9-spaceLength;
                    else left = doorsClockwise[0][3];
                    ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                }
            } else {
                if (doorsClockwise[0].length>6){ // URDL Cross room
                    ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,(0.55)*globalH);
                    ctx.fillRect((this.x+doorsClockwise[0][5])*globalW,(this.y+0.45)*globalH,(doorsClockwise[0][4]-doorsClockwise[0][5])*globalW,(0.55)*globalH);
                    ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][7])*globalH,0.55*globalW,(doorsClockwise[1][6]-doorsClockwise[1][7])*globalH);
                    ctx.fillRect((this.x+0.45)*globalW,(this.y+doorsClockwise[1][2])*globalH,0.55*globalW,(doorsClockwise[1][3]-doorsClockwise[1][2])*globalH);
                    let up = Math.min(doorsClockwise[1][2],doorsClockwise[1][7]);
                    let down = Math.max(doorsClockwise[1][3],doorsClockwise[1][6]);
                    let left = Math.min(doorsClockwise[0][0],doorsClockwise[0][5]);
                    let right = Math.max(doorsClockwise[0][4],doorsClockwise[0][1]);
                    ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,(right-left)*globalW,(down-up)*globalH)
                } else if (doorsClockwise[2][2]=='l') { //UL Corner
                    ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,(doorsClockwise[1][2])*globalH);
                    ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][3])*globalH,(doorsClockwise[0][1])*globalW,(doorsClockwise[1][2]-doorsClockwise[1][3])*globalH);
                    let up;
                    let left;
                    if (doorsClockwise[1][2]-spaceLength<0.1) up = 0.1;
                    else up = doorsClockwise[1][2]-spaceLength;
                    if (doorsClockwise[0][1]-spaceLength<0.1) left = 0.1;
                    else left = doorsClockwise[0][1]-spaceLength;
                    ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                } else if (doorsClockwise[2][2]=='d') {
                    if (doorsClockwise[0].length>4){ // UDL Intersection
                        let mid = (doorsClockwise[1][4]+doorsClockwise[1][5])/2;
                        ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][5])*globalH,doorsClockwise[0][1]*globalW,(doorsClockwise[1][4]-doorsClockwise[1][5])*globalH);
                        ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,mid*globalH);
                        ctx.fillRect((this.x+doorsClockwise[0][3])*globalW,(this.y+mid)*globalH,(doorsClockwise[0][2]-doorsClockwise[0][3])*globalW,(1-mid)*globalH);
                        spaceLength = Math.min(Math.max(doorsClockwise[0][0]-doorsClockwise[0][2]+0.1,doorsClockwise[0][3]-doorsClockwise[0][1]+0.1,spaceLength),0.8);
                        let up = Math.max(mid-spaceLength/2,0.1);
                        if (up+spaceLength>0.9) up = 0.9-spaceLength;
                        let left = Math.max(0.1,((doorsClockwise[0][0]+doorsClockwise[0][1]+doorsClockwise[0][2]+doorsClockwise[0][3])/4) - (spaceLength/2));
                        if (left+spaceLength>0.9) left = 0.9-spaceLength;
                        ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                    } else { // UD Hallway
                        ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,0.55*globalH);
                        ctx.fillRect((this.x+doorsClockwise[0][3])*globalW,(this.y+0.45)*globalH,(doorsClockwise[0][2]-doorsClockwise[0][3])*globalW,0.55*globalH);
                        spaceLength = Math.min(Math.max(doorsClockwise[0][0]-doorsClockwise[0][3]+0.1,doorsClockwise[0][2]-doorsClockwise[0][1]+0.1,spaceLength),0.8);
                        let up = 0.5-spaceLength/2;
                        let left = Math.max(0.1,(doorsClockwise[0][0]+doorsClockwise[0][1]+doorsClockwise[0][2]+doorsClockwise[0][3])/4-spaceLength/2);
                        if (up+spaceLength>0.9) up = 0.9-spaceLength;
                        if (left+spaceLength>0.9) left = 0.9-spaceLength;
                        ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                    }
                } else { // only R remains in [2][2]
                    if (doorsClockwise[0].length==4){ // UR Corner
                        ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,(doorsClockwise[1][3])*globalH);
                        ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+doorsClockwise[1][2])*globalH,(1-doorsClockwise[0][0])*globalW,(doorsClockwise[1][3]-doorsClockwise[1][2])*globalH);
                        let up;
                        let left;
                        if (doorsClockwise[1][3]-spaceLength<0.1) up = 0.1;
                        else up = doorsClockwise[1][3]-spaceLength;
                        if (doorsClockwise[0][0]+spaceLength>0.9) left = 0.9-spaceLength;
                        else left = doorsClockwise[0][0];
                        ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                    } else if (doorsClockwise[2][4]=='d') { // URD Intersection
                        let mid = (doorsClockwise[1][3]+doorsClockwise[1][2])/2;
                        ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,mid*globalH);
                        ctx.fillRect((this.x+doorsClockwise[0][5])*globalW,(this.y+mid)*globalH,(doorsClockwise[0][4]-doorsClockwise[0][5])*globalW,(1-mid)*globalH);
                        ctx.fillRect((this.x+doorsClockwise[0][5])*globalW,(this.y+doorsClockwise[1][2])*globalH,(1-doorsClockwise[0][5])*globalW,(doorsClockwise[1][3]-doorsClockwise[1][2])*globalH);
                        spaceLength = Math.min(Math.max(doorsClockwise[0][0]-doorsClockwise[0][4]+0.1,doorsClockwise[0][5]-doorsClockwise[0][1]+0.1,spaceLength),0.8);
                        let up = Math.max(mid-spaceLength/2,0.1);
                        let left = Math.max(0.1,((doorsClockwise[0][0]+doorsClockwise[0][1]+doorsClockwise[0][4]+doorsClockwise[0][5])/4) - (spaceLength/2));
                        if (up+spaceLength>0.9) up = 0.9-spaceLength;
                        if (left+spaceLength>0.9) left = 0.9-spaceLength;
                        ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                    } else { // URL Intersection
                        let mid = (doorsClockwise[0][0]+doorsClockwise[0][1])/2;
                        ctx.fillRect((this.x+doorsClockwise[0][0])*globalW,(this.y+0)*globalH,(doorsClockwise[0][1]-doorsClockwise[0][0])*globalW,doorsClockwise[1][4]*globalH);
                        ctx.fillRect((this.x+mid)*globalW,(this.y+doorsClockwise[1][2])*globalH,(1-mid)*globalW,(doorsClockwise[1][3]-doorsClockwise[1][2])*globalH);
                        ctx.fillRect((this.x+0)*globalW,(this.y+doorsClockwise[1][5])*globalH,mid*globalW,(doorsClockwise[1][4]-doorsClockwise[1][5])*globalH);
                        spaceLength = Math.min(Math.max(doorsClockwise[1][4]-doorsClockwise[1][5]+0.1,doorsClockwise[1][3]-doorsClockwise[1][2]+0.1,spaceLength),0.8);
                        let left = Math.max(mid-spaceLength/2,0.1);
                        let up = Math.max(0.1,((doorsClockwise[1][4]+doorsClockwise[1][5]+doorsClockwise[1][2]+doorsClockwise[1][3])/4) - (spaceLength/2));
                        if (left+spaceLength>0.9) left = 0.9-spaceLength;
                        if (up+spaceLength>0.9) up = 0.9-spaceLength;
                        ctx.fillRect((this.x+left)*globalW,(this.y+up)*globalH,spaceLength*globalW,spaceLength*globalH);
                    }
                }
            }
            ctx.stroke();
            return;
        }

        let radius = (1.25+Math.cos((this.shape*Math.PI)/256.0))/5.0;
        if (doorsClockwise[0].length==2) {
                let startX,startY;
                let endX,endY;
                switch(doorsClockwise[2][1]){
                    case 'u':
                        endX=doorsClockwise[0][0];
                        endY=0;
                        startX=doorsClockwise[0][1];
                        startY=0;
                        break;
                    case 'd':
                        endX=doorsClockwise[0][0];
                        endY=1;
                        startX=doorsClockwise[0][1];
                        startY=1;
                        break;
                    case 'l':
                        endX=0;
                        endY=doorsClockwise[1][0];
                        startX=0;
                        startY=doorsClockwise[1][1];
                        break;
                    default:
                        endX=1;
                        endY=doorsClockwise[1][0];
                        startX=1;
                        startY=doorsClockwise[1][1];
                        break;
                }
                ctx.beginPath();
                ctx.moveTo((this.x+startX)*globalW,(this.y+startY)*globalH);
                ctx.lineTo((this.x+doorsClockwise[0][1])*globalW,(this.y+doorsClockwise[1][1])*globalH);
                this.bulb(ctx,doorsClockwise[0][1],doorsClockwise[1][1],doorsClockwise[0][0],doorsClockwise[1][0],globalW,globalH);
                ctx.lineTo((this.x+doorsClockwise[0][0])*globalW,(this.y+doorsClockwise[1][0])*globalH);
                ctx.lineTo((this.x+endX)*globalW,(this.y+endY)*globalH);
                ctx.stroke();
                
        } else {
            for (let iter=1;iter<doorsClockwise[0].length;iter+=2){
                let targ = (iter+1) % doorsClockwise[0].length;
                let startX,startY;
                let endX,endY;
                switch(doorsClockwise[2][iter]){
                    case 'u':
                        startX=doorsClockwise[0][iter];
                        startY=0;
                        break;
                    case 'd':
                        startX=doorsClockwise[0][iter];
                        startY=1;
                        break;
                    case 'l':
                        startX=0;
                        startY=doorsClockwise[1][iter];
                        break;
                    default:
                        startX=1;
                        startY=doorsClockwise[1][iter];
                        break;
                }
                switch(doorsClockwise[2][targ]){
                    case 'u':
                        endX=doorsClockwise[0][targ];
                        endY=0;
                        break;
                    case 'd':
                        endX=doorsClockwise[0][targ];
                        endY=1;
                        break;
                    case 'l':
                        endX=0;
                        endY=doorsClockwise[1][targ];
                        break;
                    default:
                        endX=1;
                        endY=doorsClockwise[1][targ];
                        break;
                }
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                ctx.moveTo((this.x+startX)*globalW,(this.y+startY)*globalH);
                ctx.lineTo((this.x+doorsClockwise[0][iter])*globalW,(this.y+doorsClockwise[1][iter])*globalH);
                this.line(ctx,doorsClockwise[0][iter],doorsClockwise[1][iter],doorsClockwise[0][targ],doorsClockwise[1][targ],globalW,globalH);
                ctx.lineTo((this.x+doorsClockwise[0][targ])*globalW,(this.y+doorsClockwise[1][targ])*globalH);
                ctx.lineTo((this.x+endX)*globalW,(this.y+endY)*globalH);
                ctx.stroke();
            }
        }
    }
    bulb(ctx,startX,startY,endX,endY,spaceX,spaceY){
        let centreX = (1+startX+endX)/4;
        let centreY = (1+startY+endY)/4;

        let startAngle = Math.atan2(startY-centreY,startX-centreX);
        let endAngle = Math.atan2(endY-centreY,endX-centreX);
        if (endAngle < 2*Math.PI) endAngle += (2*Math.PI);

        let gap = endAngle-startAngle;
        if (gap>2*Math.PI) gap -= (2*Math.PI);

        let startDelta = Math.sqrt(Math.pow(centreX-startX,2)+Math.pow(centreY-startY,2));
        let endDelta = Math.sqrt(Math.pow(centreX-endX,2)+Math.pow(centreY-endY,2));
        let midDelta = Math.min(Math.max(0.05,this.shape/512),0.45);
        let dip = [];
        for (let iter=0;iter<129;iter++){
            if (iter<64) dip.push(startDelta+2*(midDelta-startDelta)*(iter/128));
            else if (iter==64) dip.push(midDelta);
            else dip.push(midDelta+2*(endDelta-midDelta)*((iter/128) - 0.5));
        }

        let quickMidpoint = [];
        for(let iter=0;iter<129;iter++){
            quickMidpoint.push(1);
        }
        let curHeight = 0.75;
        let curWidth  = 64;
        while (curWidth>=1){
            for (let pos = curWidth;pos<128;pos+=curWidth){
                if (Math.abs(quickMidpoint[pos]-1)<0.005) quickMidpoint[pos] = ((rand()-0.5)*2)*curHeight+(quickMidpoint[pos-curWidth]+quickMidpoint[pos+curWidth])/2;
            }
            curHeight /= 2.0;
            curWidth  /= 2.0;
        }
        let scale = Math.max.apply(null,quickMidpoint)/1.25;
        for (let iter=0;iter<129;iter++) quickMidpoint[iter]/=scale;
        for(let iter=1;iter<128;iter++){
            let newX = centreX+dip[iter]*Math.cos(startAngle+iter*gap/128)*quickMidpoint[iter];
            let newY = centreY+dip[iter]*Math.sin(startAngle+iter*gap/128)*quickMidpoint[iter];
            newX = Math.max(0.1,Math.min(0.9,newX));
            newY = Math.max(0.1,Math.min(0.9,newY));
            ctx.lineTo((this.x+newX)*spaceX,(this.y+newY)*spaceY);
        }
    }
    line(ctx,startX,startY,endX,endY,spaceX,spaceY){
        if ((Math.abs(startX-endX)<0.005)&&(Math.abs(startY-endY)<0.005)) return;
        let centreX = (1+startX+endX)/4;
        let centreY = (1+startY+endY)/4;

        let startAngle = Math.atan2(startY-centreY,startX-centreX);
        let endAngle = Math.atan2(endY-centreY,endX-centreX);
        if (endAngle < 2*Math.PI) endAngle += (2*Math.PI);

        let gap = endAngle-startAngle;
        if (gap>2*Math.PI) gap -= (2*Math.PI);

        let startDelta = Math.sqrt(Math.pow(centreX-startX,2)+Math.pow(centreY-startY,2));
        let endDelta = Math.sqrt(Math.pow(centreX-endX,2)+Math.pow(centreY-endY,2));

        let quickMidpoint = [];
        for(let iter=0;iter<129;iter++){
            quickMidpoint.push(1);
        }
        let curHeight = 0.75;
        let curWidth  = 64;
        while (curWidth>=1){
            for (let pos = curWidth;pos<128;pos+=curWidth){
                if (Math.abs(quickMidpoint[pos]-1)<0.005) quickMidpoint[pos] = ((rand()-0.5)*2)*curHeight+(quickMidpoint[pos-curWidth]+quickMidpoint[pos+curWidth])/2;
            }
            curHeight /= 2.0;
            curWidth  /= 2.0;
        }
        let scale = Math.max.apply(null,quickMidpoint)/1.25;
        for (let iter=0;iter<129;iter++) quickMidpoint[iter]/=scale;
        let dip = [];
        for (let iter=0;iter<129;iter++) dip.push(startDelta+(endDelta-startDelta)*(iter/128));
        for(let iter=1;iter<128;iter++){
            let newX = centreX+dip[iter]*Math.cos(startAngle+iter*gap/128)*quickMidpoint[iter];
            let newY = centreY+dip[iter]*Math.sin(startAngle+iter*gap/128)*quickMidpoint[iter];
            newX = Math.max(0.1,Math.min(0.9,newX));
            newY = Math.max(0.1,Math.min(0.9,newY));
            ctx.lineTo((this.x+newX)*spaceX,(this.y+newY)*spaceY);
        }
    }
};

class Floor{
    constructor(theCanvas,size=20){
        this.rooms  = [];
        this.maxW   = size;
        this.maxH   = size;
        this.canvas = document.getElementById(theCanvas);
        this.ctx    = this.canvas.getContext("2d");
        this.roomW  = Number(this.canvas.width)/size;
        this.roomH  = Number(this.canvas.height)/size;
        this.nat    = Boolean(document.getElementById("natSelect").checked);
//        this.sparse = Boolean(document.getElementById("spaSelect").checked);
        this.sparse = Boolean(document.querySelector('input[name="digSelect"]:checked').value == "sparse");
    }
    draw(){
        if (this.nat)this.ctx.fillStyle = "#ffffff";
        else this.ctx.fillStyle = "#000000";

        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        for (let iter=0;iter<this.maxH;iter++){
            for (let jter=0;jter<this.maxW;jter++){
                this.rooms[iter][jter].draw(this.ctx,this.roomW,this.roomH);
            }
        }
    }
    randInit(){
        for(let iter=0;iter<this.maxH;iter++){
            this.rooms.push([]);
            for (let jter=0;jter<this.maxW;jter++){
                this.rooms[iter].push(new Room(jter,iter));
                let newExits = (rand()*65535)|0;
                if (jter===0) newExits &= 0b0000111111111111;
                if (jter+1==this.maxH) newExits &= 0b1111000011111111;
                if (iter===0) newExits &= 0b1111111100001111;
                if (iter+1==this.maxW) newExits &= 0b1111111111110000;
                this.rooms[iter][jter].exits=newExits;
                this.rooms[iter][jter].space=(rand()*255)|0;
                this.rooms[iter][jter].shape=(rand()*255)|0;
            }
        }
    }
    init(){
        var inSeed = document.getElementById("seedNum").value;
        var hash = hashSeed(inSeed.toString());
        rand = seedRand(hash[0],hash[1],hash[2],hash[3]);
        this.rooms=[];
        for(let iter=0;iter<this.maxH;iter++){
            this.rooms.push([]);
            for (let jter=0;jter<this.maxW;jter++){
                this.rooms[iter].push(new Room(jter,iter,this.nat));
            }
        }
        let midX = Math.floor(this.maxW/2);
        let midY = Math.floor(this.maxH/2);
        this.rooms[midY][midX].exits=(rand()*65535)|0;
//        this.rooms[midY][midX].space=(rand()*255)|0;
        this.rooms[midY][midX].shape=(rand()*255)|0;
        if (this.sparse) this.digSpa(midX,midY,true);
        else this.dig(midX,midY,true);
        this.draw();
        drawGrid(this.roomW,this.roomH);
    }
    dig(xPos,yPos,ding=false){
        if (this.rooms[yPos][xPos].exits>-1 && !ding) return;
        if (!ding){
            let myExits = 0;
            if(yPos+1<this.maxH) {
                if (this.rooms[yPos+1][xPos].exits>-1) myExits |= ((this.rooms[yPos+1][xPos].exits & 0b1111000000000000)>>4);
                else myExits |= ((rand()*16)<<8);
            } else myExits &= 0b1111000011111111;
            if(yPos>0){
                if (this.rooms[yPos-1][xPos].exits>-1) myExits |= ((this.rooms[yPos-1][xPos].exits & 0b0000111100000000)<<4);
                else myExits |= ((rand()*16)<<12);
            } else myExits &= 0b0000111111111111;
            if(xPos+1<this.maxW) {
                if (this.rooms[yPos][xPos+1].exits>-1) myExits |= ((this.rooms[yPos][xPos+1].exits & 0b0000000011110000)>>4);
                else myExits |= ((rand()*16)<<0);
            } else myExits &= 0b1111111111110000;
            if(xPos>0) {
                if (this.rooms[yPos][xPos-1].exits>-1) myExits |= ((this.rooms[yPos][xPos-1].exits & 0b0000000000001111)<<4);
                else myExits |= ((rand()*16)<<4);
            } else myExits &= 0b1111111100001111;
            this.rooms[yPos][xPos].exits=myExits;
            this.rooms[yPos][xPos].shape=(rand()*255)|0;
        }
        if (Boolean(document.querySelector('input[name="digSelect"]:checked').value == "connect")){
            if(this.rooms[yPos][xPos].exits & 0xb000) this.dig(xPos,yPos-1);
            if(this.rooms[yPos][xPos].exits & 0x0b00) this.dig(xPos,yPos+1);
            if(this.rooms[yPos][xPos].exits & 0x00b0) this.dig(xPos-1,yPos);
            if(this.rooms[yPos][xPos].exits & 0x000b) this.dig(xPos+1,yPos);
        } else {
            if(yPos>0) this.dig(xPos,yPos-1);
            if(yPos+1<this.maxH) this.dig(xPos,yPos+1);
            if(xPos>0) this.dig(xPos-1,yPos);
            if(xPos+1<this.maxW) this.dig(xPos+1,yPos);
        }
    }
    digSpa(xPos,yPos,ding=false){
        if (this.rooms[yPos][xPos].exits>-1 && !ding) return;
        if (!ding){
            let myExits = 0;
            let allowE = true;
            let forceE = false;
            let allowW = true;
            let forceW = false;
            let allowN = true;
            let forceN = false;
            let allowS = true;
            let forceS = false;
            let nExits;
            // clear some exits?

            if(yPos+1<this.maxH) {
                nExits = this.rooms[yPos+1][xPos].exits;
                if (nExits>-1){
                    if ((nExits&0b1100000000000000)===0) {
                        if (nExits&0b0000000011000000) allowW = allowW && (rand()>0.95);
                        if (nExits&0b0000000000001100) allowE = allowE && (rand()>0.95);
                    } else forceS = true;
                    myExits |= ((nExits & 0b1111000000000000)>>4);
                }
                else {
                    if (rand()>0.25) myExits |= ((rand()*16)<<8);
                    else myExits &= 0b1111000011111111;
                }
            } else myExits &= 0b1111000011111111;
            if(yPos>0){
                nExits = this.rooms[yPos-1][xPos].exits;
                if (nExits>-1) {
                    if ((nExits&0b0000110000000000)===0) {
                        if (nExits&0b0000000011000000) allowW = allowW && (rand()>0.95);
                        if (nExits&0b0000000000001100) allowE = allowE && (rand()>0.95);
                    } else forceN = true;
                    myExits |= ((nExits & 0b0000111100000000)<<4);
                }
                else {
                    if (rand()>0.25) myExits |= ((rand()*16)<<12);
                    else myExits &= 0b0000111111111111;
                }
            } else myExits &= 0b0000111111111111;
            if(xPos+1<this.maxW) {
                nExits = this.rooms[yPos][xPos+1].exits;
                if (nExits>-1) {
                    if ((nExits&0b0000000011000000)===0) {
                        if (nExits&0b0000110000000000) allowS = allowS && (rand()>0.95);
                        if (nExits&0b1100000000000000) allowN = allowN && (rand()>0.95);
                    } else forceE = true;
                    myExits |= ((nExits & 0b0000000011110000)>>4);
                }
                else {
                    if (rand()>0.25) myExits |= ((rand()*16)<<0);
                    else myExits &= 0b1111111111110000;
                }
            } else myExits &= 0b1111111111110000;
            if(xPos>0) {
                nExits = this.rooms[yPos][xPos-1].exits;
                if (nExits>-1) {
                    if ((0b0000000000001100)===0) {
                        if (nExits&0b0000110000000000) allowS = allowS && (rand()>0.95);
                        if (nExits&0b1100000000000000) allowN = allowN && (rand()>0.95);
                    } else forceW = true;
                    myExits |= ((nExits & 0b0000000000001111)<<4);
                }
                else {
                    if (rand()>0.25) myExits |= ((rand()*16)<<4);
                    else myExits &= 0b1111111100001111;
                }
            } else myExits &= 0b1111111100001111;
            if (!allowN && !forceN) myExits &= 0b0000111111111111;
            if (!allowS && !forceS) myExits &= 0b1111000011111111;
            if (!allowW && !forceW) myExits &= 0b1111111100001111;
            if (!allowE && !forceE) myExits &= 0b1111111111110000;
            this.rooms[yPos][xPos].exits=myExits;
            this.rooms[yPos][xPos].shape=(rand()*255)|0;

            this.rooms[yPos][xPos].exits=myExits;
            this.rooms[yPos][xPos].shape=(rand()*255)|0;
        }
        if(yPos>0) this.digSpa(xPos,yPos-1);
        if(yPos+1<this.maxH) this.digSpa(xPos,yPos+1);
        if(xPos>0) this.digSpa(xPos-1,yPos);
        if(xPos+1<this.maxW) this.digSpa(xPos+1,yPos);
    }
};

function restart(){
    delete floor;
    floor = new Floor("myCanvas",Number(document.getElementById("cellWidth").value));
    floor.init();
}
