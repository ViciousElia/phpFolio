var localRand;
const phiPlus   = (1+Math.sqrt(5))/2;

function initRand(){
    if (typeof rand === "function") localRand = rand;
    else localRand = Math.random;
}

//  Returns an integer in the range [1,maximum] with weights defined so that  //
//  f(n) = base*f(n+1) for all n in the range, where f is the probability of  //
//  returning n from the function.                                            //
function lowWeightExpo(maximum,base=2){
    let maxTarg = Math.pow(base,maximum-1);
    let randInt = Math.ceil(localRand()*maxTarg);
    randInt = Math.ceil(Math.log2(randInt)/Math.log2(base));
    return Math.max(1,(maximum-randInt));
}

//  Returns an integer in the range [1,maximum] with weights defined so that  //
//  f(n) = f(n+1)/base for all n in the range, where f is the probability of  //
//  returning n from the function.                                            //
function highWeightExpo(){
    let maxTarg = Math.pow(base,maximum-1);
    let randInt = Math.ceil(localRand()*maxTarg);
    randInt = Math.ceil(Math.log2(randInt)/Math.log2(base));
    return Math.min(maximum,randInt);
}

//  WARNING: This function has limited output range based on implementation.  //
//           For many systems, the maximum output is 0x20=0d32. If you need   //
//           a larger output space, consider either implementing high         //
//           precision floats or rewriting the function to operate on a new   //
//           numeric range such as long int or double. Possibly on R+ using   //
//           high precision floats.                                           //
//  Same as lowWeightExpo above, except that the base is (1+sqrt(5))/2 and    //
//  calculations are done almost entirely by addition and subtraction         //
function lowWeightFibo(maximum){
    if (maximum==1) return 1;
    let p1 = 1/(1+phiPlus);
    let p2 = 1/(1+2*phiPlus);
    let randMax = p1+p2;
    if (maximum==2){
        if (localRand()*randMax<p1) return 1;
        else return 2;
    }
    let last=p1,current=p2,next=p1-p2;
    for(let iter=2;iter<maximum;iter++){
        randMax+=next;
        last=current;
        current=next;
        next=last-current;
        if (randMax>1 || next<=0){
            randMax=1;break;
        }
    }
    let randVal=localRand()*randMax;
    let counter=0;
    while (randVal>0&&counter<maximum){
        counter++;
        if (p1>p2){
            randVal-=p1;
            p1-=p2;
        } else{
            randVal-=p2;
            p2-=p1;
        }
    }
    return counter;
}

initRand();