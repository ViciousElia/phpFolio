init();clearFrame();drawGraph();

document.addEventListener("keydown",(event) => {
    if(event.keyCode===39) rotateField();
    if(event.keyCode===37) rotateField(false);
});

canvas.addEventListener("mousedown",(event) => {
    let targCanv = document.getElementById("graphCanvas");
    let canvRect = targCanv.getBoundingClientRect();
    let maxWidth = targCanv.width;
    let targX = maxWidth * event.offsetX / canvRect.width;
    let targY = maxWidth * event.offsetY / canvRect.width;
    let nearI = null;
    let nearD = 10000000;
    for (let iter=0;iter<vertices.length;iter++){
        vertex = vertices[iter];
        let vertX = vertex.xProjected;
        let vertY = vertex.yProjected;
        let thisD = Math.pow(Math.pow(vertX-targX,2)+Math.pow(vertY-targY,2),0.5);
        if (thisD<nearD){
            nearD = thisD;
            nearI = iter;
        }
    }
    freeze = nearI;
    vertices[nearI].xProjected=targX;
    vertices[nearI].yProjected=targY;
    vertices[nearI].backProject();
});
canvas.addEventListener("mousemove", (event) => {
    if (freeze>-1) {
        vertex = vertices[freeze];
        let targCanv = document.getElementById("graphCanvas");
        let canvRect = targCanv.getBoundingClientRect();
        let maxWidth = targCanv.width;
        vertex.xProjected = maxWidth * event.offsetX / canvRect.width;
        vertex.yProjected = maxWidth * event.offsetY / canvRect.width;
        vertices[freeze].backProject();
    }
});

canvas.addEventListener("mouseup", (event) => {
    freeze=-1;
});
