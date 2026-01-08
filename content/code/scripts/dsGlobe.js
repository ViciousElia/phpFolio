/*
 * A globe is 180 degrees top to bottom and 360 degrees around.
 * A globe can be divided into 90 degree regions that form right triangles.
 * Something like the diamond-square algorithm may be used to generate the
 * interiors of those triangles, but the edges must be the same between
 * neighbouring triangles.
 *
 * Idea: build grid n x n per octant; top triangle of grid empty; divide
 * remaining triangle with the following recursive structure:
 *
 * divide height by 2 -> square height.
 * take lower square -> perform DS on lower square.
 * Two right triangles remain, _up_ and _right_.
 * recurse into _up_ with square height.
 * recurse into _right_ with square height.
 * continue recursion until square height = 1
 *
 * In order to achieve the desired goal with a stitchable surface, the figure
 * will need to be built in several steps:
 *
 * 1 - build seams. 12 total, located at
 *       - North, long 0, 90, 180, 270
 *       - South, long 0, 90, 180, 270
 *       - Equat, long 0-90, 90-180, 180-270, 270-360
 * 2 - perform modified DS on 4 squares, low + high on each
 *       - North, long 0-180 with 0-90 low tri and 90-180 high tri
 *       - North, long 180-360 with 180-270 low tri and 270-360 high tri
 *       - South, long 0-180 with 0-90 low tri and 90-180 high tri
 *       - South, long 180-360 with 180-270 low tri and 270-360 high tri
 *
 * It may be possible to optimise it if handled cleverly...
 *  _____ _____
 * |    /|\    | A - -180 to -90 in the North
 * | A / | \ D | B - -90  to 0   in the North
 * |  /  |  \  | C - 0    to 90  in the North
 * | / B | C \ | D - 90   to 180 in the North
 * |/____|____\|
 * |\    |    /| E - -180 to -90 in the South
 * | \ F | G / | F - -90  to 0   in the South
 * |  \  |  /  | G - 0    to 90  in the South
 * | E \ | / H | H - 90   to 180 in the South
 * |____\|/____|
 *  
 * The top    of A is the same as the top    of D
 * The left   of A is the same as the left   of E
 * The right  of D is the same as the right  of H
 * The bottom of E is the same as the bottom of H
 *
 * This turns the globe into an octahedron.
 *
 * So now ... we do the equator. This handles bottom of B, bottom of C, left of
 * A, and right of D. Then ... we do the prime meridian and date line. This
 * handles the right of B, right of F, top of A and bottom of H. Finally ... we
 * do the 90 degree meridian. This handles the four inner diagonals.
 *
 * Doing it in that order only requires pinning one point to 0, and that can be
 * adjusted after setting its midpoint. In that way, we have a fully untethered
 * structure that can tile the sphere as though it were a tetrahedron.
 *
 * Casting it onto the sphere is a problem for future Terra.
*/

var max_depth = 2;

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

const mean = data => {
  if (data.length < 1) {
    return;
  }
  return data.reduce((prev, current) => prev + current) / data.length;
};

var inSeed = 10071987;
var hash = hashSeed(inSeed.toString());
var randf = seedRand(hash[0],hash[1],hash[2],hash[3]);

function meridian(length,points=[]){
    // Assume the length is valid, then work from there.
    let meridianArray = [];
    for (let iter=0; iter<length; iter++) meridianArray.push(0);
    let width = (length - 1) / 2;
    let depth = max_depth;
    if (points.length===0){
        meridianArray[0] = depth*(randf() - 0.5);
        meridianArray[width] = depth*(randf() - 0.5);
    } else{
        let shortWidth = width/2;
        if (points.length==2){
            meridianArray[shortWidth]=points[0];
            meridianArray[width+shortWidth]=points[1];
            meridianArray[0]=(points[0]+points[1])/2+depth*(randf()-0.5);
            meridianArray[width]=(points[0]+points[1])/2+depth*(randf()-0.5);
        } else {
            meridianArray[0] = points[0];
            meridianArray[shortWidth] = points[1];
            meridianArray[width] = points[2];
            meridianArray[width+shortWidth] = points[3];
        }
    }
    meridianArray[length-1] = meridianArray[0];
    while (width>1){
        width /= 2;
        depth /= 2;
        for (let iter=1;iter*width+1<length;iter++){
            if (meridianArray[iter*width] === 0) meridianArray[iter*width] = (meridianArray[(iter+1)*width]+meridianArray[(iter-1)*width])/2 + depth*(randf() - 0.5);
        }
    }
    return meridianArray;
}

function prepArray(length){
    // Assume the length is valid, then work from there.
    let globeArray = [];
    let halfArc = (length-1)/2;
    for (let iter=0; iter<length;iter++) {
        globeArray.push([]);
        for (let jter=0; jter<length;jter++){
            globeArray[iter].push(null);
        }
    }
    let equator = meridian(2*length-1);
    let prime = meridian(2*length-1,[equator[0],equator[length-1]]);
    let ninety = meridian(2*length-1,[prime[0],equator[halfArc],prime[length-1],equator[3*halfArc]]);

// console.log(equator);
// console.log(prime);
// console.log(ninety);

    for (let iter=0;iter<halfArc;iter++){
        globeArray[iter][halfArc-iter] = ninety[iter];
        globeArray[halfArc+iter][iter] = ninety[iter+halfArc];
        globeArray[length-iter-1][halfArc+iter] = ninety[iter+length-1];
        globeArray[halfArc-iter][length-iter-1] = ninety[iter+length+halfArc-1];

        globeArray[halfArc][halfArc-iter] = equator[iter];
        globeArray[halfArc][length-iter-1] = equator[iter+length+halfArc-1];
        globeArray[halfArc-iter][0] = equator[iter+halfArc];
        globeArray[halfArc+iter][0] = equator[iter+halfArc];
        globeArray[length-iter-1][length-1] = equator[iter+length-1];
        globeArray[iter][length-1] = equator[iter+length-1];

        globeArray[iter][halfArc] = prime[iter];
        globeArray[iter+halfArc][halfArc] = prime[iter+halfArc];
        globeArray[length-1][halfArc-iter] = prime[iter+length];
        globeArray[length-1][halfArc+iter] = prime[iter+length];
        globeArray[0][length-iter-1] = prime[iter+length+halfArc-1];
        globeArray[0][iter] = prime[iter+length+halfArc-1];
    }
    
    return globeArray;
}

// rows in globeArray correspond to vertical moves on the square
// columns in globeArray correspond to horizontal moves on the square
// so globeArray[37][24] is 3

function seededDS(globeArray,intDepths=false){
    let length = globeArray.length;
    let backArray = [];
    for (let iter=0; iter<length;iter++) {
        backArray.push([]);
        for (let jter=0; jter<length;jter++){
            if (globeArray[iter][jter]!==null) backArray[iter].push(0);
            else backArray[iter].push(null);
        }
    }
    let width = length-1;
    let depth = max_depth/2;
    let maxValue = -256;
    let minValue = 256;
    while (width>1){
        width/=2;
        for (let yPos=width;yPos<length-1;yPos+=width){
            for (let xPos=width;xPos<length-1;xPos+=width){
                if (globeArray[yPos][xPos]===null)
                    globeArray[yPos][xPos] = (globeArray[yPos-(width/2)][xPos-(width/2)] + globeArray[yPos-(width/2)][xPos+(width/2)] + globeArray[yPos+(width/2)][xPos-(width/2)] + globeArray[yPos+(width/2)][xPos+(width/2)])/8 + depth*(randf()-0.5);
            }
        }
        for (let yPos=width;yPos<length-1;yPos+=width){
            for (let xPos=width;xPos<length-1;xPos+=width){
                if (backArray[yPos][xPos]===null)
                    globeArray[yPos][xPos] = (globeArray[yPos][xPos-(width/2)] + globeArray[yPos-(width/2)][xPos] + globeArray[yPos+(width/2)][xPos] + globeArray[yPos][xPos+(width/2)])/8 + depth*(randf()-0.5);
                maxValue = Math.max(maxValue,globeArray[yPos][xPos]);
                minValue = Math.min(minValue,globeArray[yPos][xPos]);
            }
        }
        depth/=2;
    }
// Rectify to a range of [0,1] or [0,255,1] if intDepths
    for (let yPos=0;yPos<length;yPos++){
        for (let xPos=0;xPos<length;xPos++){
            globeArray[yPos][xPos] -= minValue;
            globeArray[yPos][xPos] /= (maxValue-minValue);
            if (intDepths){
                globeArray[yPos][xPos] *= 255;
                globeArray[yPos][xPos] = Math.round(globeArray[yPos][xPos]);
            }
        }
    }
    return globeArray;
}

function drawSide(globeArray,context,angle){
    let length = globeArray.length;
    let ratio90 = Math.PI / length; // the fraction of 90 degrees covered per array entry
    
    
}



















