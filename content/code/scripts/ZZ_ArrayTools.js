/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0                                                           *
 * MODULE ---- Speciality array functions for general use                     *
 * USAGE ----- Include ZZ_ArrayTools.js as a deferred script. Call functions  *
 *             as array methods                                               *
 *                                                                            *
 * FUNCTIONS - sortOn: sorts array on the given key. Works for custom keys.   *
 *                                                                            *
 * VARIABLES - None so far.                                                   *
 *                                                                            *
 * AUTHOR ---- Terra Hyde, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

Array.prototype.sortOn = function(key){
    this.sort(function(a, b){
        if(a[key] < b[key]){
            return -1;
        }else if(a[key] > b[key]){
            return 1;
        }
        return 0;
    });
};

Array.prototype.listEqual = function(second){
    if (!Array.isArray(second)) return false;
    for (let ele in this){
        if (!second.includes(ele)) return false;
    }
    for (let ele in second){
        if (!this.includes(ele)) return false;
    }
    return true;
};

Array.prototype.shuffle = function(){
    let internalRand;
    if (typeof rand === "function") internalRand = rand;
    else internalRand = Math.random;

    let currentIndex = this.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(internalRand() * currentIndex);
        currentIndex--;
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }
};
