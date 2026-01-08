/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0                                                           *
 * MODULE ---- Adaptive Grid Overlay for graphical tool outputs.              *
 * USAGE ----- Include ZZ_Grids.js as a deferred script. For translations,    *
 *             include a <canvas id="gridCanvas" slide="true"></canvas> in    *
 *             the html.                                                      *
 *                                                                            *
 * FUNCTIONS - dispGrid: checks HTML input elements and shows/hides the grid  *
 *             initGrid: checks HTML input elements and draws grid. resets    *
 *                       translation values                                   *
 *             drawGrid: redraws grid, accounting for translations            *
 *             syncVals: takes an input and output HTML id and writes the     *
 *                       input value over the output HTML id's value          *
 *             transGrid: clears grid and calculates translations             *
 *                                                                            *
 * VARIABLES - gridStyles: style string used to recall the style of the grid  *
 *                 when turning visibility on and off                         *
 *                                                                            *
 * AUTHOR ---- Terra Hyde, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

var gridStyles;
function dispGrid(){
    let grids = document.getElementById("showGrid");
    if (grids.checked) document.getElementById("gridCanvas").setAttribute("style",gridStyles);
    else document.getElementById("gridCanvas").setAttribute("style","display:none");
}
function initGrid(){
    let ganvas = document.getElementById("gridCanvas");
    let gtx = ganvas.getContext("2d");
    let widCells = Number(document.getElementById("cellWidth").value);
    let heiCells = Number(document.getElementById("cellHeight").value);
    let wide = Number(ganvas.width)/widCells;
    let high = Number(ganvas.height)/heiCells;
    gtx.clearRect(0,0,Number(ganvas.width),Number(ganvas.height));
    gtx.lineWidth=1;
    gtx.strokeStyle="#808080";
    for (let iter = 0;iter*wide<Number(ganvas.width);iter++){
        gtx.beginPath();
        gtx.moveTo(iter*wide,0);
        gtx.lineTo(iter*wide,Number(ganvas.height));
        gtx.stroke();
    }
    for (let iter = 0;iter*high<Number(ganvas.height);iter++){
        gtx.beginPath();
        gtx.moveTo(0,iter*high);
        gtx.lineTo(Number(ganvas.width),iter*high);
        gtx.stroke();
    }
    gtx.beginPath();
    gtx.moveTo(Number(ganvas.width),0);
    gtx.lineTo(Number(ganvas.width),Number(ganvas.height));
    gtx.stroke();
    gtx.beginPath();
    gtx.moveTo(0,Number(ganvas.height));
    gtx.lineTo(Number(ganvas.width),Number(ganvas.height));
    gtx.stroke();
    if (document.getElementById("xgridPos")!==null) {
        document.getElementById("xgridPos").value="0";
        document.getElementById("ygridPos").value="0";
        document.getElementById("xgridSlide").value="0";
        document.getElementById("ygridSlide").value="0";
        document.getElementById("xgridPos").max=Math.floor(wide);
        document.getElementById("ygridPos").max=Math.floor(high);
        document.getElementById("xgridSlide").max=Math.floor(wide);
        document.getElementById("ygridSlide").max=Math.floor(high);
    }
}
function drawGrid(newX,newY){
    let ganvas = document.getElementById("gridCanvas");
    let gtx = ganvas.getContext("2d");
    let widCells = Number(document.getElementById("cellWidth").value);
    let heiCells = Number(document.getElementById("cellHeight").value);
    let wide = Number(ganvas.width)/widCells;
    let high = Number(ganvas.height)/heiCells;
    gtx.lineWidth=1;
    gtx.strokeStyle="#808080";
    for (let iter = 0;iter*wide-newX<=Number(ganvas.width);iter++){
        gtx.beginPath();
        gtx.moveTo(iter*wide-newX,0-newY);
        gtx.lineTo(iter*wide-newX,Number(ganvas.height)+newY);
        gtx.closePath();
        gtx.stroke();
    }
    for (let iter = 0;iter*high-newY<=Number(ganvas.height);iter++){
        gtx.beginPath();
        gtx.moveTo(0-newX,iter*high-newY);
        gtx.lineTo(Number(ganvas.width)+newX,iter*high-newY);
        gtx.closePath();
        gtx.stroke();
    }
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
    if (newX==document.getElementById("xgridPos").max) {
        document.getElementById("xgridPos").value = "0";
        document.getElementById("xgridSlide").value = "0";
    }
    if (newY==document.getElementById("ygridPos").max){
        document.getElementById("ygridPos").value = "0";
        document.getElementById("ygridSlide").value = "0";
    }
    drawGrid(newX,newY);
}

if (document.getElementById("gridCanvas")===null){
    console.log("No grid canvas. Attempting to create.");
    let drawCanvas = document.getElementById("imageCanvas");
    let gridNode;
    if (document.getElementsByClassName("scaleCanvas").length!==0){
        let canvasGroup = document.getElementsByClassName("scaleCanvas")[0];
        let groupStyle = canvasGroup.getAttribute("style");
        gridNode = document.createElement("canvas");
        gridNode.setAttribute("height",drawCanvas.height);
        gridNode.setAttribute("width",drawCanvas.width);
        gridNode.setAttribute("style",drawCanvas.getAttribute("style"));
        gridNode.style.zIndex = 2;
        gridNode.style.gridArea = "1/1";
        gridNode.setAttribute("id","gridCanvas");
        gridNode.innerHTML = drawCanvas.innerHTML;
        drawCanvas.after(gridNode);
    } else console.log("No canvas region to add grid.");
} else {
    let drawCanvas = document.getElementById("imageCanvas");
    let gridNode = document.getElementById("gridCanvas");
    gridNode.setAttribute("height",drawCanvas.height);
    gridNode.setAttribute("width",drawCanvas.width);
    gridNode.setAttribute("style",drawCanvas.getAttribute("style"));
    gridNode.style.zIndex = 2;
    gridNode.style.gridArea = "1/1";
    gridNode.setAttribute("id","gridCanvas");
    gridNode.innerHTML = drawCanvas.innerHTML;
}
if (document.getElementById("gridOptions")===null){
    console.log("No grid variables. Attempting to create.");
    if (document.getElementsByClassName("controls").length!==0){
        let controlGroup = document.getElementsByClassName("controls")[0];
        let lastOne = controlGroup.lastElementChild;
        let gridNode = document.createElement("div");
        gridNode.setAttribute("id","gridOptions");
        gridNode.setAttribute("slide","false");
        if (document.getElementById("gridCanvas").getAttribute("slide")=="true"){
            gridNode.innerHTML = '<p><label for="showGrid">Display Grid? </label><input id="showGrid" type="checkbox" onChange="dispGrid()" checked="true"/></p><p><label for="cellWidth">Grid Width: </label><input type="number" value="15" min="3" max="50" id="cellWidth" onChange="initGrid()"/></p><p><label for="cellHeight">Grid Height: </label><input type="number" value="15" min="3" max="50" id="cellHeight" onChange="initGrid()"/></p><p><label for="xgridPos">Grid X Position: </label><input default="0" id="xgridPos" min="0" max="50" onChange="syncVals(\'xgridPos\',\'xgridSlide\');transGrid()" step="1" type="number" value="0" /><input default="0" id="xgridSlide" min="0" max="50" onChange="syncVals(\'xgridSlide\',\'xgridPos\');transGrid()" step="1" type="range" value="0" /></p><p><label for="ygridPos">Grid Y Position: </label><input default="0" id="ygridPos" min="0" max="50" onChange="syncVals(\'ygridPos\',\'ygridSlide\');transGrid()" step="1" type="number" value="0" /><input default="0" id="ygridSlide" min="0" max="50" onChange="syncVals(\'ygridSlide\',\'ygridPos\');transGrid()" step="1" type="range" value="0" /></p>';
        } else gridNode.innerHTML = '<p><label for="showGrid">Display Grid? </label><input id="showGrid" type="checkbox" onChange="dispGrid()" checked="true"/></p><p><label for="cellWidth">Grid Width: </label><input type="number" value="15" min="3" max="50" id="cellWidth" onChange="initGrid()"/></p><p><label for="cellHeight">Grid Height: </label><input type="number" value="15" min="3" max="50" id="cellHeight" onChange="initGrid()"/></p>';
        controlGroup.insertBefore(gridNode,lastOne);
    } else console.log("No controls group to create grid variables.");
} else  {
    let gridNode=document.getElementById("gridOptions");
    gridNode.innerHTML = '<p><label for="showGrid">Display Grid? </label><input id="showGrid" type="checkbox" onChange="dispGrid()" checked="true"/></p><p><label for="cellWidth">Grid Width: </label><input type="number" value="15" min="3" max="50" id="cellWidth" onChange="initGrid()"/></p><p><label for="cellHeight">Grid Height: </label><input type="number" value="15" min="3" max="50" id="cellHeight" onChange="initGrid()"/></p>';
}
if ((document.getElementById("gridCanvas")===null) || (document.getElementById("gridOptions")===null)) console.log("Canvas properties missing. Cannot init.");
else  initGrid();
gridStyles = document.getElementById("gridCanvas").getAttribute("style");