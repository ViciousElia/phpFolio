/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0                                                           *
 * MODULE ---- Seedable Pseudo Random Number Generator.                       *
 * USAGE ----- Include ZZ_SeedRand.js as a deferred script. Add a localRand   *
 *             variable and set it to return the rand function once rand is   *
 *             initialised. Alternatively, simply call rand() after           *
 *             initialising it. Unnecessary if the implementation has seed    *
 *             support                                                        *
 *                                                                            *
 * FUNCTIONS - hashSeed: takes a string input and generates a 128-bit hash    *
 *                       stored as a 4-integer array.                         *
 *             seedRand: takes up to 4 integer inputs (with zero at the end)  *
 *                       and returns a callable function with psuedorandom    *
 *                       outputs using bit-shifting and static variables      *
 *             newSeed:  generates a new seed for hashSeed and seedRand using *
 *                       built-in random number generator. Uses the seed to   *
 *                       set up rand variable.                                *
 *                                                                            *
 * VARIABLES - rand:     random number generator to be set by newSeed and     *
 *                       called with rand() in the tool that uses the module. *
 *                                                                            *
 * AUTHOR ---- Terra Hyde, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

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
    };
}
function newSeed(rando=true){
    if (rando) document.getElementById("seedNum").value = Math.floor(Math.random()*4294967295);
    let inSeed = document.getElementById("seedNum").value;
    let hash = hashSeed(inSeed.toString());
    rand = seedRand(hash[0],hash[1],hash[2],hash[3]);
    try{
        if (typeof localRand !== typeof undefined) localRand=rand;
    } catch (e){
        console.log("Unable to check local randomiser. Error Report: "+e);
    }
}
var rand;

if (document.getElementById("seedNum")===null){
    console.log("No seed environment. Attempting to create.");
    if (document.getElementsByClassName("controls").length!==0){
        let controlGroup = document.getElementsByClassName("controls")[0];
        let lastOne = controlGroup.lastElementChild;
        let seedNode = document.createElement("p");
        seedNode.innerHTML = '<label for="seedNum">Seed Value: </label><input default="1337" id="seedNum" max="4294967295" min="0" step="1" type="number" value="1337" onChange="newSeed(false)"/><input type="button" onclick="newSeed()" value="Randomise Seed!" />';
            controlGroup.insertBefore(seedNode,lastOne);
    } else console.log("No controls group to create seed environment.");
}
newSeed();
