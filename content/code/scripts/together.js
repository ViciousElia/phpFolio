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
    function dispGrid(){
        let grids = document.getElementById("showGrid");
        if (grids.checked) document.getElementById("gridCanvas").setAttribute("style","padding: 20px;border: 1px solid #808080;width:100%;margin:0 -20px;z-index:2;grid-area:1/1");
        else document.getElementById("gridCanvas").setAttribute("style","display:none");
    }
    function drawGrid(newX,newY){
        let ganvas = document.getElementById("gridCanvas");
        let squareWidth = (((ganvas.width-21)/20)+1) | 0;
        let gWidth = ganvas.width+squareWidth-1;
        let gtx = ganvas.getContext("2d");
        gtx.lineWidth=1;
        gtx.strokeStyle="#808080";
        for (let iter = 0;iter<21;iter++){
            gtx.beginPath();
            gtx.moveTo(iter*squareWidth-newX,0-newY);
            gtx.lineTo(iter*squareWidth-newX,gWidth-newY);
            gtx.lineTo((1+iter)*squareWidth-newX,gWidth-newY);
            gtx.lineTo((1+iter)*squareWidth-newX,0-newY);
            gtx.closePath();
            gtx.stroke();
            gtx.beginPath();
            gtx.moveTo(0-newX,iter*squareWidth-newY);
            gtx.lineTo(gWidth-newX,iter*squareWidth-newY);
            gtx.lineTo(gWidth-newX,(1+iter)*squareWidth-newY);
            gtx.lineTo(0-newX,(1+iter)*squareWidth-newY);
            gtx.closePath();
            gtx.stroke();
        }
    }
    function init(){
        let canvas = document.getElementById("imageCanvas");
        let squareWidth = (((canvas.width-21)/20)+1) | 0;
        let ctx = canvas.getContext("2d");
        document.getElementById("xgridPos").setAttribute("max",squareWidth-1);
        document.getElementById("xgridSlide").setAttribute("max",squareWidth-1);
        document.getElementById("ygridPos").setAttribute("max",squareWidth-1);
        document.getElementById("ygridSlide").setAttribute("max",squareWidth-1);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#5a3218";
        ctx.fillRect(0, 0, 10, canvas.height);
        ctx.fillRect(0, 0, canvas.width, 10);
        ctx.fillRect(canvas.width-10, 0, 10, canvas.height);
        ctx.fillRect(0, canvas.height-10, 7*canvas.width/20, 10);
        ctx.fillRect(13*canvas.width/20, canvas.height-10, 7*canvas.width/20, 10);
        drawGrid(0,0);
    }
    function newCanv(){
        let canvas = document.getElementById("imageCanvas");
        let ganvas = document.getElementById("gridCanvas");
        let cellSize = document.getElementById("sizeNum").value * 1;
        let newSize = (cellSize+1)*20 + 1;
        canvas.setAttribute("width",newSize);
        canvas.setAttribute("height",newSize);
        ganvas.setAttribute("width",newSize);
        ganvas.setAttribute("height",newSize);
        init();
    }
    function newSeed(){
        document.getElementById("seedNum").value = Math.floor(Math.random()*4294967295);
    }
    function syncVals(myLab,yourLab){
        targVal = document.getElementById(myLab).value;
        actVal =  document.getElementById(yourLab).value;
        if (targVal!=actVal) document.getElementById(yourLab).value = targVal;
    }
    function transGrid(){
        let ganvas = document.getElementById("gridCanvas");
        let gtx = ganvas.getContext("2d");
        gtx.clearRect(0,0,ganvas.width,ganvas.height);
        let newX = document.getElementById("xgridPos").value;
        let newY = document.getElementById("ygridPos").value;
        drawGrid(newX,newY);
    }
    function comeTogether(){
        var inSeed = document.getElementById("seedNum").value;
        var hash = hashSeed(inSeed.toString());
        var rand = seedRand(hash[0],hash[1],hash[2],hash[3]);
        let canvas =      document.getElementById("imageCanvas");
        let ctx =         canvas.getContext("2d");
        let drawWidth =   canvas.width - 18;
        let drawHeight =  canvas.height - 18;
        let density =     document.getElementById("multNum").value;
        let passes =      document.getElementById("passNum").value;
        let distance =    document.getElementById("distNum").value;
        let pixels = [];
        for (let iter=0; iter<drawHeight; iter++){
            let row = [];
            for (let jter=0; jter<drawWidth; jter++){
                if (iter===0 || jter===0 || jter==drawWidth-1) {
                    row.push(0);
                    continue;
                }
                if (iter>drawHeight-15) {
                    if( jter<(7*(drawWidth+18)/20)-9 || jter>(13*(drawWidth+18)/20 + 1)-9) row.push(0);
                    else row.push(1);
                    continue;
                }
                if (Math.floor(rand()*100)<density) row.push(0);
                else row.push(1);
            }
            pixels.push(row);
        }
        for (let kter=0; kter<passes; kter++){
            if (density===0 || density==100){kter=passes; continue;}
            for(let iter=1; iter<drawHeight-1; iter++){
                for (let jter=1; jter<drawWidth-1; jter++){
                    if (pixels[iter][jter]==1) continue;
                    let surroundA=0;
                    let surroundB=0;
                    for (let lter=0; lter<9; lter++){
                        if (pixels[iter - 1 + Math.floor(lter/3)][jter - 1 + (lter%3)]===0) surroundA++;
                    }
                    if (surroundA<9){
                        let newX=Math.floor(rand()*(2*distance+1))-distance;
                        let newY=Math.floor(rand()*(2*distance+1))-distance;
                        if (jter+newX < 1) newX=1;
                        else if (jter+newX > drawHeight-2) newX=drawHeight-2;
                        else newX = jter+newX;
                        if (iter+newY < 1) newY=1;
                        else if (iter+newY > drawHeight-2) newY=drawHeight-2;
                        else newY = iter+newY;
                        if (pixels[newY][newX]===0) continue;
                        for (let lter=0; lter<9; lter++){
                            if (pixels[newY - 1 + Math.floor(lter/3)][newX - 1 + (lter%3)]===0) surroundB++;
                        }
                        if (surroundA <= surroundB){
                            pixels[newY][newX] = 0;
                            pixels[iter][jter] = 1;
                        }
                    }
                }
            }
        }
        ctx.fillStyle = "#000000";
        ctx.fillRect(10,10,canvas.width-20,canvas.height-20);
        ctx.fillStyle = "#5a3218";
        for (let iter=1; iter<drawHeight-1; iter++){
            for (let jter=1; jter<drawWidth-1; jter++){
                if (pixels[iter][jter]===0) ctx.fillRect(jter+9, iter+9, 1, 1);
            }
        }
    }

var rand;
