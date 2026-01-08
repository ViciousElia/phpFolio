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

arrayShuffle = function(array){
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(localRand() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
};

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
        this.exitCount = lowWeightExpo(Number(document.getElementById("maxExits").value),phiPlus);
        this.blocks = [];
        this.exits = [];
        this.init();
    }
    init(){
        for(let iter=0;iter<this.width;iter++) this.blocks.push([]);
        for (let iter=0;iter<this.exitCount;iter++){
            let newX,newY;
            newX = Math.floor(localRand()*this.width);
            if (newX===0 || newX+1==this.width){
                newY = Math.floor(localRand()*(this.height-2)+1);
            } else if (Math.floor(localRand()*2)>0) newY=this.height-1;
            else newY=0;
            if (iter==1){
                if (Math.abs(this.exits[0].x-newX)+Math.abs(this.exits[0].y-newY)<4) {
                    if(Math.abs(this.exits[0].y-newX)+Math.abs(this.exits[0].x-newY)>=4) {
                        this.exits.push({"x":newY,"y":newX});
                    } else {
                        this.exits.push({"x":(this.width-1)-this.exits[0].x,"y":newY});
                    }
                } else this.exits.push({"x":newX,"y":newY});
            } else this.exits.push({"x":newX,"y":newY});
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
        this.dig(this.exits[0].x,this.exits[0].y,this.exits[this.exits.length-1].x,this.exits[this.exits.length-1].y);
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
        if(this.blocks[posiX][posiY]!==undefined) return ((posiX==targX)&&(posiY==targY));
        let up,down,left,right;
        if(posiX>0){
            if(this.blocks[posiX-1][posiY]!==undefined) left = this.blocks[posiX-1][posiY].exits.right;
        } else if(posiX+1<this.width){
            if(this.blocks[posiX+1][posiY]!==undefined) right = this.blocks[posiX+1][posiY].exits.left;
        }
        if(posiY>0){
            if(this.blocks[posiX][posiY-1]!==undefined) up = this.blocks[posiX][posiY-1].exits.down;
        } else if(posiY+1<this.height){
            if(this.blocks[posiX][posiY+1]!==undefined) down = this.blocks[posiX][posiY+1].exits.up;
        }
        if (left===undefined) left=sizeFlags+1;
        if (right===undefined) right=sizeFlags+1;
        if (up===undefined) up=sizeFlags+1;
        if (down===undefined) up=sizeFlags+1;
        this.blocks[posiX][posiY] = new Block(up,down,left,right,posiX,posiY);

        let order = ['u','d','l','r'];
        arrayShuffle(order);
        if ((targX>posiX)&&(this.blocks[posiX][posiY].exits.right!==0)) {right=true;left=false;}
        else if ((targX<posiX)&&(this.blocks[posiX][posiY].exits.left!==0)) {right=false;left=true;}
        else {right=false;left=false;}
        if ((targY>posiY)&&(this.blocks[posiX][posiY].exits.down!==0)) {down=true;up=false;}
        else if ((targY<posiY)&&(this.blocks[posiX][posiY].exits.up!==0)) {down=false;up=true;}
        else {up=false;down=false;}
        if (right) [order[0],order[order.indexOf('r')]]=[order[order.indexOf('r')],order[0]];
        if (left) [order[0],order[order.indexOf('l')]]=[order[order.indexOf('l')],order[0]];
        if (up&&(!left || !right)) [order[0],order[order.indexOf('u')]]=[order[order.indexOf('u')],order[0]];
        else if (up) [order[1],order[order.indexOf('u')]]=[order[order.indexOf('u')],order[1]];
        if (down&&(!left || !right)) [order[0],order[order.indexOf('d')]]=[order[order.indexOf('d')],order[0]];
        else if (down) [order[1],order[order.indexOf('d')]]=[order[order.indexOf('d')],order[1]];
        if ((left||right)&&(up||down)) if (localRand()<0.5) [order[0],order[1]] = [order[1],order[0]];
        if (localRand()<0.5) [order[2],order[3]] = [order[3],order[2]];

        let targFlag = false;
        for(let iter=0;iter<order.length;iter++){
            switch(order[iter]){
                case 'u':
                    if (this.blocks[posiX][posiY].exits.up>sizeFlags){
                        if (iter<2) this.blocks[posiX][posiY].exits.up = lowWeightExpo(sizeFlags,phiPlus);
                        else this.blocks[posiX][posiY].exits.up = lowWeightExpo(sizeFlags,phiPlus)-1;
                    }
                    if (posiY>0) if (this.dig(posiX,posiY-1,targX,targY,free)) targFlag = true;
                    break;
                case 'd':
                    if (this.blocks[posiX][posiY].exits.down>sizeFlags){
                        if (iter<2) this.blocks[posiX][posiY].exits.down = lowWeightExpo(sizeFlags,phiPlus);
                        else this.blocks[posiX][posiY].exits.down = lowWeightExpo(sizeFlags,phiPlus)-1;
                    }
                    if (posiY+1<this.height) if (this.dig(posiX,posiY+1,targX,targY,free)) targFlag = true;
                    break;
                case 'l':
                    if (this.blocks[posiX][posiY].exits.left>sizeFlags){
                        if (iter<2) this.blocks[posiX][posiY].exits.left = lowWeightExpo(sizeFlags,phiPlus);
                        else this.blocks[posiX][posiY].exits.left = lowWeightExpo(sizeFlags,phiPlus)-1;
                    }
                    if (posiX>0) if (this.dig(posiX-1,posiY,targX,targY,free)) targFlag = true;
                    break;
                case 'r':
                    if (this.blocks[posiX][posiY].exits.right>sizeFlags){
                        if (iter<2) this.blocks[posiX][posiY].exits.right = lowWeightExpo(sizeFlags,phiPlus);
                        else this.blocks[posiX][posiY].exits.right = lowWeightExpo(sizeFlags,phiPlus)-1;
                    }
                    if (posiX+1<this.width) if (this.dig(posiX+1,posiY,targX,targY,free)) targFlag = true;
                    break;
                default:
                    break;
            }
            if (targFlag) break;
        }
        return targFlag;
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
