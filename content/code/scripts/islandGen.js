function syncVals(myLab,yourLab){
    targVal = document.getElementById(myLab).value;
    actVal =  document.getElementById(yourLab).value;
    if (targVal!=actVal) document.getElementById(yourLab).value = targVal;
}
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
//this is the template for how to set up the rand function. I'm leaving it in for future Terra.
function demoUpdate(){
    var pTarg = document.getElementById("demo");
    var target = document.createElement("p");
    var inSeed = document.getElementById("seedNum").value;
    var hash = hashSeed(inSeed.toString());
    var rand = seedRand(hash[0],hash[1],hash[2],hash[3]);
    for (var iter=0;iter<10;iter++){
        var newVal = document.createElement("span");
        newVal.innerHTML = rand() + ' ';
        target.append(newVal);
    }
    pTarg.append(target);
}
function mapGen(){
    var inSeed = document.getElementById("seedNum").value;
    var hash = hashSeed(inSeed.toString());
    var rand = seedRand(hash[0],hash[1],hash[2],hash[3]);

    let canvas = document.getElementById("imageCanvas");
    let mapWidth = canvas.width;
    let mapHeight = canvas.height;
    let fullArray = [];

    for(let iter=0;iter<mapHeight;iter++){
        var rowArray = [];
        for(let jter=0;jter<mapWidth;jter++){
            rowArray.push(0);
        }
        fullArray.push(rowArray);
    }

    const scale = document.getElementById("multNum").value;
    let curScale = document.getElementById("multNum").value;

    let curGap = mapWidth-1;
    let rectify = 0;

    while (curGap > 1){
        for(let iter=0; iter<mapHeight-1; iter+=curGap){
            for(let jter=0; jter<mapWidth-1; jter+=curGap){
                let yPos = iter + curGap/2;
                let xPos = jter + curGap/2;
                fullArray[yPos][xPos] = (fullArray[iter][jter]+fullArray[iter+curGap][jter+curGap]+fullArray[iter+curGap][jter]+fullArray[iter][jter+curGap])/4 + rand()*curScale;
            }
        }
        for(let iter=0; iter<mapHeight-1; iter+=curGap){
            for(let jter=0; jter<mapWidth-1; jter+=curGap){
                let yPos = iter + curGap/2;
                let xPos = jter + curGap/2;
                let thisGap = curGap/2;
                let u = yPos-curGap/2;
                let d = yPos+curGap/2;
                let l = xPos-curGap/2;
                let r = xPos+curGap/2;

                if (u > 10)           fullArray[u][xPos] = (fullArray[u][jter]+fullArray[u][jter+curGap]+fullArray[yPos][xPos]+fullArray[yPos-curGap][xPos])/4 + rand()*curScale;
                if (d < mapHeight-11) fullArray[d][xPos] = (fullArray[d][jter]+fullArray[d][jter+curGap]+fullArray[yPos][xPos]+fullArray[yPos+curGap][xPos])/4 + rand()*curScale;
                if (l > 10)           fullArray[yPos][l] = (fullArray[iter][l]+fullArray[iter+curGap][l]+fullArray[yPos][xPos]+fullArray[yPos][xPos-curGap])/4 + rand()*curScale;
                if (r < mapWidth-11)  fullArray[yPos][r] = (fullArray[iter][r]+fullArray[iter+curGap][r]+fullArray[yPos][xPos]+fullArray[yPos][xPos+curGap])/4 + rand()*curScale;
            }
        }
        curGap /= 2;
        curScale *= scale;
    }
    for(let iter=0;iter<mapHeight;iter++){
        for(let jter=0;jter<mapWidth;jter++){
            if (fullArray[iter][jter]>rectify) rectify = fullArray[iter][jter];
        }
    }
//    rectify = 255/rectify;
    if (document.getElementById("smoothCheck").checked){
        for (let kter=0;kter<10;kter++){
            let holdArray = JSON.parse(JSON.stringify(fullArray));
            for(let iter=1;iter<mapHeight-1;iter++){
                for(let jter=1;jter<mapWidth-1;jter++){
                    if ((255*fullArray[iter][jter]/rectify)>128) fullArray[iter][jter] = (holdArray[iter+1][jter+1]+holdArray[iter+1][jter-1]+holdArray[iter-1][jter+1]+holdArray[iter-1][jter-1])/16+(holdArray[iter+1][jter]+holdArray[iter-1][jter]+holdArray[iter][jter+1]+holdArray[iter][jter-1])/8+holdArray[iter][jter]/4;
                }
            }
        }
    }

    let drawCtx = canvas.getContext("2d");
    for(let iter=0;iter<mapHeight;iter++){
        for(let jter=0;jter<mapWidth;jter++){
            fullArray[iter][jter] *= (255/Math.pow(rectify,2))*fullArray[iter][jter];
            if (fullArray[iter][jter]>230){
                var blue = fullArray[iter][jter];
                var green = fullArray[iter][jter];
                var red = fullArray[iter][jter];
            } else if (fullArray[iter][jter]>184){
                blue = 255-fullArray[iter][jter];
                green = 255-fullArray[iter][jter];
                red = 255-fullArray[iter][jter];
            } else if (fullArray[iter][jter]>156){
                blue = (305-fullArray[iter][jter])/4;
                green = 305-4*fullArray[iter][jter]/3;
                red = (305-fullArray[iter][jter])/4;
            } else if (fullArray[iter][jter]>128){
                let val = 255-fullArray[iter][jter]*7/5;
                blue = val;
                green = val+fullArray[iter][jter]/4;
                red = val+fullArray[iter][jter]/2;
            } else {
                let val = 255 - fullArray[iter][jter]*2
                blue = 140-(val/3+fullArray[iter][jter]/5);
                green = 78-(val/5+fullArray[iter][jter]/8);
                red = val/16;
            }
            fullArray[iter][jter] |= 0;

            drawCtx.fillStyle = `rgb(${red},${green},${blue})`;
            drawCtx.fillRect(jter,iter,1,1);
        }
    }
}

function newSeed(){
    document.getElementById("seedNum").value = Math.floor(Math.random()*4294967295);
}
