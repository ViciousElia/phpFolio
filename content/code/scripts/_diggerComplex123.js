var localRand;
const posiFlags = 0xffff0000;
const sizeFlags = 0x0000ffff;
const maxSize   = 0x000000ff;
const phiPlus   = (1+Math.sqrt(5))/2;
const lowWeightMax = 32;
var newRoom;

function objComp(first,second){
    for (let property in first){
        if (second.hasOwnProperty(property)){
            if (first[property]!=second[property]) return false;
        } else return false;
    }
    return true;
}

function initRand(){
    if (typeof rand === "function") localRand = rand;
    else localRand = Math.random;
}

function lowWeightExpo(maximum,base=2){
    let locMax = maximum;
    if (base>1.5) locMax = Math.min(lowWeightMax,maximum);
    let maxTarg = Math.pow(base,locMax-1);
    let randInt = Math.ceil(localRand()*maxTarg);
    randInt = Math.ceil(Math.log2(randInt)/Math.log2(base));
    return Math.max(1,(locMax-randInt));
}

class Room {
    constructor(width=10,height=10) {
        this.width = Math.min(Math.max(width,3),255);
        this.height = Math.min(Math.max(height,3),255);
//        this.exitCount = lowWeightExpo(Math.min(2*(this.width+this.height),32),phiPlus);
        this.exitCount = lowWeightExpo(Number(document.getElementById("maxExits").value),phiPlus);
        this.blocks = [];
        this.exits = [];
        this.init();
    }
    init(){
        for (let iter=0;iter<this.width;iter++) this.blocks.push([]);
        for (let iter=0;iter<this.exitCount;iter++){
            let newX = Math.floor(localRand()*this.width);
            let newY;
            if (newX===0 || newX+1==this.width){
                newY = Math.floor(localRand()*(this.height-2)+1);
            } else if (Math.floor(localRand()*2)>0) newY=this.height-1;
            else newY=0;
            this.exits.push({"x":newX,"y":newY});
            let flag = false;
            for (let jter=0;jter<this.exits.length-1;jter++){
                if (objComp(this.exits[iter],this.exits[jter])) flag=true;
            }
            if (flag) {this.exits.pop();iter--;}
        }
        if (this.exits.length>1){
            this.exits.sortOn("y"); // sort on verticals
            this.exits.sortOn("x"); // sort on horizontals so that verticals are grouped by the horizontal index
        }
// @TODO: Build exits
        for(let iter=0;iter<this.exits.length;iter++) {
            let locX=this.exits[iter].x;
            let locY=this.exits[iter].y;
            let up,down,left,right;
            if (this.blocks[locX][locY-1]!==undefined){
                up=this.blocks[locX][locY-1].exits.down;
            } else {
                if (locY!==0) up = lowWeightExpo(sizeFlags,phiPlus)-1;
                else up = lowWeightExpo(sizeFlags,phiPlus);
                if (up!==0){
                    let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                    up |= size;
                }
            }
            if (this.blocks[locX][locY+1]!==undefined){
                down=this.blocks[locX][locY+1].exits.up;
            } else {
                if (locY+1!=this.height) down = lowWeightExpo(sizeFlags,phiPlus)-1;
                else down = lowWeightExpo(sizeFlags,phiPlus);
                if (down!==0){
                    let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                    down |= size;
                }
            }
            if (locX!==0) {
                if (this.blocks[locX-1][locY]!==undefined){
                    left = this.blocks[locX-1][locY].exits.right;
                } else{
                    if (locX!==0) left = lowWeightExpo(sizeFlags,phiPlus)-1;
                    else left = lowWeightExpo(sizeFlags,phiPlus);
                    if (left!==0){
                        let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                        left |= size;
                    }
                }
            }
            if (locX+1!=this.width) {
                if (this.blocks[locX+1][locY]!==undefined){
                    right = this.blocks[locX-1][locY].exits.left;
                } else {
                    if (locX+1!=this.width) right = lowWeightExpo(sizeFlags,phiPlus)-1;
                    else right = lowWeightExpo(sizeFlags,phiPlus);
                    if (right!==0){
                        let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                        right |= size;
                    }
                }
            }
            if (locX===0){
                if ((up===0)||(down===0)) { // force right
                    right = lowWeightExpo(sizeFlags,phiPlus);
                    let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                    right |= size;
                } 
            }
            if (locX+1==this.width){
                if ((up===0)||(down===0)) { // force left
                    left = lowWeightExpo(sizeFlags,phiPlus);
                    let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                    left |= size;
                }
            }
            if (locY===0){
                if ((left===0)||(right===0)) { // force down
                    down = lowWeightExpo(sizeFlags,phiPlus);
                    let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                    down |= size;
                }
            }
            if (locY+1==this.height){
                if ((left===0)||(right===0)) { // force up
                    up = lowWeightExpo(sizeFlags,phiPlus);
                    let size = lowWeightExpo(sizeFlags,phiPlus)<<16;
                    up |= size;
                }
            }
            this.blocks[this.exits[iter].x][this.exits[iter].y] = new Block(up,down,left,right,this.exits[iter].x,this.exits[iter].y);
        }
// @TODO: Dig
        for(let iter=0;iter<this.exits.length;iter++){
            if(iter+1==this.exits.length) {
                this.dig(this.exits[iter].x,this.exits[iter].y,this.exits[0].x,this.exits[0].y,true);
            } else {
                this.dig(this.exits[iter].x,this.exits[iter].y,this.exits[iter+1].x,this.exits[iter+1].y);
            }
        }
    }
    draw(){
        let canvas = document.getElementById("imageCanvas");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#404040";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let blockH = canvas.height/this.height;
        let blockW = canvas.width/this.width;
        for (let iter=0;iter<this.width;iter++){
            if (this.blocks[iter].length===0) continue;
            for(let jter=0;jter<this.height;jter++){
                if (this.blocks[iter][jter]!==undefined) this.blocks[iter][jter].draw(ctx,blockW,blockH);
            }
        }
    }
    dig(posiX,posiY,targX,targY,free=false){
        if (!this.blocks[posiX][posiY].set){
// @TODO: Check cardinals for values.
// @TODO: Check cardinal neighbours for values.
// @TODO: Dig to unset positions with viable exits
            this.blocks[posiX][posiY].set = true;
        } else {
// @TODO: Dig to unset positions with viable exits
        }
        
// @TODO: manage the case of free roaming
        if (free){
            let dirX = (targX-posiX);
            let dirY = (targY-posiY);
            let up,down,left,right;
            let XorY = Math.floor(localRand()*(1+Math.abs(dirX)+Math.abs(dirY)))>dirX; // Pick which axis to travel. Weighted for distance.
            if (XorY) { // Travel in the Y axis
                dirY /= Math.abs(dirY); // Normalise Y.
                if (dirY>0) {
                    down = lowWeightExpo(sizeFlags,phiPlus);
                }
                else {
                    up = lowWeightExpo(sizeFlags,phiPlus);
                }
            } else { // Travel in the X axis
                dirX /= Math.abs(dirX); // Normalise X.
                if (dirX>0) {
                    right = lowWeightExpo(sizeFlags,phiPlus);
                }
                else {
                    left = lowWeightExpo(sizeFlags,phiPlus);
                }
            }
        }
    }
};

class Block {
    constructor(up=1,down=1,left=1,right=1,x=0,y=0) {
        this.exits = {"up":up,"down":down,"left":left,"right":right};
        this.shape = 0;
        this.size = 0;
        this.set = false;
        this.position = {"x":x,"y":y};
    }
    init(){
    }
    draw(ctx,blockH=20,blockW=20){
//start debug section
        if ((this.exits.up===0)&&(this.exits.down===0)&&(this.exits.left===0)&&(this.exits.right===0)) ctx.fillStyle = "#000000";
        else ctx.fillStyle = "#00b464";
        ctx.fillRect(this.position.x*blockW,this.position.y*blockH,blockW,blockH);
        ctx.strokeStyle="#000000";
        ctx.beginPath();
        ctx.moveTo((this.position.x+0.5)*blockW,(this.position.y+0.5)*blockH);
        if (this.exits.up){
            ctx.lineTo((this.position.x+0.5)*blockW,(this.position.y+0)*blockH);
            ctx.moveTo((this.position.x+0.5)*blockW,(this.position.y+0.5)*blockH);
        }
        if (this.exits.down){
            ctx.lineTo((this.position.x+0.5)*blockW,(this.position.y+1)*blockH);
            ctx.moveTo((this.position.x+0.5)*blockW,(this.position.y+0.5)*blockH);
        }
        if (this.exits.left){
            ctx.lineTo((this.position.x+0)*blockW,(this.position.y+0.5)*blockH);
            ctx.moveTo((this.position.x+0.5)*blockW,(this.position.y+0.5)*blockH);
        }
        if (this.exits.right){
            ctx.lineTo((this.position.x+1)*blockW,(this.position.y+0.5)*blockH);
        }
        ctx.stroke();
//end debug section
    }
}

function reset(){
    delete newRoom;
    newRoom = new Room(Number(document.getElementById("cellWidth").value),Number(document.getElementById("cellHeight").value));
    newRoom.draw();
}

initRand();
document.getElementById("cellWidth").value = 10;
document.getElementById("cellHeight").value = 10;
initGrid();
newRoom = new Room(Number(document.getElementById("cellWidth").value),Number(document.getElementById("cellHeight").value));
newRoom.draw();
