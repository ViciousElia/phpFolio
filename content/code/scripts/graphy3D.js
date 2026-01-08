    var canvas = null;
    var ctx = null;
    var raf;
    let gWidth = 1000;
    let gHeight = 1000;
    let PERSPECTIVE = gWidth * 0.8; // The field of view of our 3D scene
    let PROJECTION_CENTER_X = gWidth / 2; // x center of the canvas
    let PROJECTION_CENTER_Y = gHeight / 2; // y center of the canvas
    var vertices = [];
    var edges = [];
    var rotate = false;
    var freeze = -1;
    
    class Vertex3D{
        constructor(newX=0,newY=0,newZ=0) {
            this.x = newX;
            this.y = newY;
            this.z = newZ;
            this.vx = 0;
            this.vy = 0;
            this.vz = 0;
            this.radius = 10;
            this.xProjected = 0;
            this.yProjected = 0;
            this.scaleProjected = 0;
            this.edges = [];
        }
        project() {
            this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
            this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
            this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
        }
        backProject(){
            this.x = (this.xProjected - PROJECTION_CENTER_X)/this.scaleProjected;
            this.y = (this.yProjected - PROJECTION_CENTER_Y)/this.scaleProjected;
        }
        draw() {
            this.project();
            ctx.globalAlpha = Math.abs(1 - this.z / gWidth);
            ctx.beginPath();
            ctx.arc(this.xProjected,this.yProjected,this.radius*this.scaleProjected,0,2*Math.PI);
            ctx.fill();
        }
    }

    class Edge3D{
        constructor(newV1=0,newV2=0) {
            this.v1 = Math.min(newV1,newV2);
            this.v2 = Math.max(newV1,newV2);
            this.radius = 1;
            this.scaleProjected = 0;
            this.z = 0;
        }
        project() {
            vertices[this.v1].project();
            vertices[this.v2].project();
            let z1 = vertices[this.v1].z;
            let z2 = vertices[this.v2].z;
            this.z = (z1+z2)/2;
            this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        }
        draw() {
            this.project();
            ctx.globalAlpha = Math.abs(1 - this.z / gWidth);
            ctx.lineWidth = 5*this.scaleProjected;
            ctx.beginPath();
            ctx.moveTo(vertices[this.v1].xProjected,vertices[this.v1].yProjected);
            ctx.lineTo(vertices[this.v2].xProjected,vertices[this.v2].yProjected);
            ctx.stroke();
        }
    }
    
    function drawGraph(){
        for (let edge of edges) edge.draw();
        for (let vert of vertices) vert.draw();
    }
    
    function init(){
        if (canvas===null) canvas = document.getElementById("graphCanvas");
        if (ctx===null) ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#00b464";
        gWidth = canvas.width;
        gHeight = canvas.height;
        PERSPECTIVE = gWidth * 0.8; // The field of view of our 3D scene
        PROJECTION_CENTER_X = gWidth / 2; // x center of the canvas
        PROJECTION_CENTER_Y = gHeight / 2; // y center of the canvas
        vertices = [];
        edges = [];
        let gSize = Number(document.getElementById("graphSize").value);
        let gString = document.getElementById("graphString").value.split(',');
        let gScale = Number(gWidth)/2;
        for (let iter=0;iter<gSize;iter++){
            let phiGold = Math.PI*(3-Math.sqrt(5));
            let localZ = 1 - (iter / (gSize-1)) * 2;
            let localR = Math.sqrt(1-localZ*localZ);
            let theta = iter*phiGold;
            let localX = Math.cos(theta)*localR;
            let localY = Math.sin(theta)*localR;
            vertices.push(new Vertex3D(localX*gScale,localY*gScale,gScale*(1+localZ)));
        }
        for(let edge of gString){
            if (edge==='') continue;
            let splitE = edge.split('-');
            let leftV = Math.min(Number(splitE[0]),Number(splitE[1]))-1;
            let rightV = Math.max(Number(splitE[0]),Number(splitE[1]))-1;
            if (leftV==rightV) continue;
            if (leftV>gSize-1 || rightV>gSize-1) continue;
            if (!vertices[leftV].edges.includes(rightV)) vertices[leftV].edges.push(rightV);
            if (!vertices[rightV].edges.includes(leftV)) vertices[rightV].edges.push(leftV);
            edges.push(new Edge3D(leftV,rightV));
        }
    }
    function clearFrame(){
        ctx.clearRect(0,0,gWidth,gHeight);
    }
    
    function updatePoints(){
        if (canvas===null) canvas = document.getElementById("graphCanvas");
        let centre = gWidth/2;
        let grav = (1/100);
        let hook = (1/200);
        let coul = 25000;
        let rest = 150 - vertices.length/2;

        for (let iter=0;iter<vertices.length;iter++){
            if (iter==freeze) continue;
            let vertex = vertices[iter];
            let netForce = [grav*(0-vertex.x),grav*(0-vertex.y),grav*(centre-vertex.z)];

            let myRest = rest*(1+3*(vertex.edges.length/vertices.length))

            for(let jter=0;jter<vertices.length;jter++){
                if (iter==jter) continue;
                let theta = Math.atan2(vertex.y-vertices[jter].y,vertex.x-vertices[jter].x);
                let distance = Math.sqrt(Math.pow(vertex.y-vertices[jter].y,2)+Math.pow(vertex.x-vertices[jter].x,2)+Math.pow(vertex.z-vertices[jter].z,2));
                let stretch = myRest-distance;
                if (distance<1) distance=1;
                let phi = Math.acos((vertex.z-vertices[jter].z)/distance);

                if (vertex.edges.includes(jter)){
                    netForce[0] += hook*stretch*Math.cos(theta)*Math.sin(phi);
                    netForce[1] += hook*stretch*Math.sin(theta)*Math.sin(phi);
                    netForce[2] += hook*stretch*Math.cos(phi);
                } else {
                    netForce[0] += coul*Math.cos(theta)*Math.sin(phi)/(distance*distance);
                    netForce[1] += coul*Math.sin(theta)*Math.sin(phi)/(distance*distance);
                    netForce[2] += coul*Math.cos(phi)/(distance*distance);
                }
            }

            vertex.x = Math.min(Math.max(vertex.x+vertex.vx+netForce[0]/2,-(gWidth/2-50)),(gWidth/2-50));
            vertex.y = Math.min(Math.max(vertex.y+vertex.vy+netForce[1]/2,-(gWidth/2-50)),(gWidth/2-50));
            vertex.z = Math.min(Math.max(vertex.z+vertex.vz+netForce[2]/2,50),gWidth-50);
            
            vertex.vx = (vertex.vx+netForce[0])*0.8;
            vertex.vy = (vertex.vy+netForce[1])*0.8;
            vertex.vz = (vertex.vz+netForce[2])*0.8;
        }
    }

    function cycle(){
        updatePoints();
        if (rotate) rotateField(true,1);
        else {
            clearFrame();
            drawGraph();
        }
        raf = window.requestAnimationFrame(cycle);
    }
    function animateGraph(run=true){
        if (run) cycle();
        else window.cancelAnimationFrame(raf);
    }
    
    function rotateField(which=true,speed=3){
        if (rotate && speed>1) return;
        let angle = speed*Math.PI/180;
        if (!which) angle *= -1;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        for (let vertex of vertices){
            let tempX = vertex.x;
            let tempZ = vertex.z-gWidth/2;
            vertex.x = cos*tempX-sin*tempZ;
            vertex.z = cos*tempZ+sin*tempX + gWidth/2;
            vertex.project();
        }
        clearFrame();
        drawGraph();
    }

    function specialGraph(which){
        let newString = '';
        let gSize = Number(document.getElementById('graphSize').value);
        switch(which){
            case 'empty':
                break;
            case 'path':
                for (let iter=0;iter<gSize-1;iter++) newString += ''+(iter+1)+'-'+(iter+2)+',';
                newString = newString.slice(0,-1);
                break;
            case 'tree':
                let maxN = Math.ceil(0.5*(Math.sqrt(4*gSize-3)-1));
                let maxL = Math.floor((gSize-2)/maxN);
                for (let lter=0;lter<=maxL;lter++){
                    for (let kter=1;kter<=maxN;kter++){
                        let cellNum = lter*maxN+1+kter;
                        if (cellNum>gSize) continue;
                        newString += ''+(lter+1)+'-'+cellNum+',';
                    }
                }
                newString = newString.slice(0,-1);
                break;
            case 'binary':
                for (let iter=2;iter<=gSize;iter++) {
                    let target = Math.floor(iter/2);
                    newString += ''+(iter)+'-'+target+',';
                }
                newString = newString.slice(0,-1);
                break;
            case 'cycle':
                for (let iter=0;iter<gSize-1;iter++) newString += ''+(iter+1)+'-'+(iter+2)+',';
                newString += '1-'+gSize;
                break;
            case 'square':
                for (let iter=1;iter<gSize+1;iter++){
                    if (iter%4===0) newString += ''+(iter-3)+'-'+(iter)+',';
                    else if (iter+1<=gSize) newString += ''+(iter)+'-'+(iter+1)+',';
                }
                newString = newString.slice(0,-1);
                break;
            case 'cube':
                for (let iter=1;iter<gSize+1;iter++){
                    if (iter%4===0) newString += ''+(iter-3)+'-'+(iter)+',';
                    else if (iter+1<=gSize) newString += ''+(iter)+'-'+(iter+1)+',';
                    if (iter%8>0 && iter%8<5) newString += ''+(iter+4)+'-'+(iter)+',';
                }
                newString = newString.slice(0,-1);
                break;
            case 'complete':
                for (let iter=0;iter<gSize-1;iter++) {
                    for (let jter=iter+1;jter<gSize;jter++) {
                        newString += ''+(iter+1)+'-'+(jter+1)+',';
                    }
                }
                newString = newString.slice(0,-1);
                break;
            case 'random':
                for (let iter=0;iter<gSize-1;iter++) {
                    for (let jter=iter+1;jter<gSize;jter++) {
                        if (Math.random()>0.9) newString += ''+(iter+1)+'-'+(jter+1)+',';
                    }
                }
                newString = newString.slice(0,-1);
                break;
            default:
                break;
        }
        document.getElementById('graphString').value = newString;
        init();
        clearFrame();
        drawGraph();
    }
    function toggleRotate(){
        rotate = !rotate;
    }
    function toggleTable() {
        if (document.getElementById("hideCheck").checked) document.getElementById("edgeTable").setAttribute("style","display:none");
        else document.getElementById("edgeTable").removeAttribute("style");
    }
    function markEdges(which,what='r0-c0'){
        let gSize = Number(document.getElementById("graphSize").value);
        let gString = document.getElementById("graphString").value.split(',');
        
        if (which=='string'){
            if (what=='r0-c0'){
                
            } else {
                let rc = what.split('-');
                let rowNum = rc[0].substring(1);
                let colNum = rc[1].substring(1);
                let left = ''+rowNum+'-'+colNum;
                let right = ''+colNum+'-'+rowNum;
                let isChecked = document.getElementById(what).checked;
                if (gString.includes(left) || gString.includes(right)) {
                    if (!isChecked) {
                        let indie = gString.indexOf(left);
                        if (!(indie>=0)) indie = gString.indexOf(right);
                        gString.splice(indie,1);
                        if (gString[0]==='') gString=[];
                    }
                } else {
                    if (isChecked) {
                        gString.push(left);
                    }
                }
                let newString = gString.toString();
                if (newString.substring(0,1)==',') newString = newString.substring(1);
                document.getElementById("graphString").value = newString;
            }
        }
    }
