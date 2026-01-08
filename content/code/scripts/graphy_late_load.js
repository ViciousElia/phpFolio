buildGraph();drawGraph();

canvas.addEventListener("mousedown",(event) => {
    let targCanv = document.getElementById("graphCanvas");
    let canvRect = targCanv.getBoundingClientRect();
    let maxWidth = targCanv.width;
    let targX = maxWidth * event.offsetX / canvRect.width;
    let targY = maxWidth * event.offsetY / canvRect.width;
    let nearI = null;
    let nearD = 1000000;
    for (let iter=0;iter<Number(document.getElementById("graphSize").value);iter++){
        vertex = graphTable[iter];
        let vertX = vertex['xPos'];
        let vertY = vertex['yPos'];
        let thisD = Math.pow(Math.pow(vertX-targX,2)+Math.pow(vertY-targY,2),0.5);
        if (thisD<nearD){
            nearD = thisD;
            nearI = iter;
        }
    }
    freeze = nearI;
    graphTable[nearI]['xPos']=targX;
    graphTable[nearI]['yPos']=targY;
});
canvas.addEventListener("mousemove", (event) => {
    if (freeze>-1) {
        vertex = graphTable[freeze];
        let targCanv = document.getElementById("graphCanvas");
        let canvRect = targCanv.getBoundingClientRect();
        let maxWidth = targCanv.width;
        vertex['xPos'] = maxWidth * event.offsetX / canvRect.width;
        vertex['yPos'] = maxWidth * event.offsetY / canvRect.width;
    }
});

canvas.addEventListener("mouseup", (event) => {
    freeze=-1;
});
