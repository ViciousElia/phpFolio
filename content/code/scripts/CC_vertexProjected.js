/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0 Graphy3D Release Version                                  *
 * CLASS ----- 3D Vertices using the projective plane for display             *
 * USAGE ----- Include CC_vertexProjected.js as a deferred script. Instance   *
 *             variable as VertexProjected(position,size). Use an object with *
 *             x, y, and z elements for the position. No support is included  *
 *             for doing physics on the vertices. If that's needed, extend    *
 *             the class with shape and any necessary physics properties      *
 *                                                                            *
 * METHODS --- constructor: assigns position and size to instance. sets other *
 *                 properties to 0                                            *
 *             setProjection: takes the width and height of the display space *
 *                 and configures the projection space accordingly            *
 *             project: recalculates the positionProjected member based on    *
 *                 the projection space and z-position of vertex              *
 *             backProject: recalculates the position member based on the     *
 *                 projection space and the positionProjected member          *
 *             draw: takes a graphics context and draws a circle based on the *
 *                 positionProjected, size, and scaleProjected members        *
 *                                                                            *
 * PROPS ----- position: position of vertex in 3d as {"x":0,"y":0,"z":0}      *
 *             size: relative size of vertex within its space. Used as radius *
 *                 when drawing                                               *
 *             positionProjected: position of vertex in 2d visual space as    *
 *                 {"x":0,"y":0}                                              *
 *             scaleProjected: scale coefficient for position and size of the *
 *                 vertex in the visual space. updated in project() method    *
 *                                                                            *
 * DEPENDS --- CC_vertex.js                                                   *
 *                                                                            *
 * AUTHOR ---- Terra Hyde, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

class VertexProjected extends Vertex {
    static PROJECTION_CENTER_X;
    static PROJECTION_CENTER_Y;
    static PERSPECTIVE;
    
    static setProjection(width,height){
        this.PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
        this.PROJECTION_CENTER_X = width / 2; // x center of the canvas
        this.PROJECTION_CENTER_Y = height / 2; // y center of the canvas
    }

    constructor(position,size=0) {
        this.position = position;
        this.size = size;
        this.positionProjected = {"x":0,"y":0};
        this.scaleProjected = 0;
    }
    project() {
        this.scaleProjected = this.PERSPECTIVE / (this.PERSPECTIVE + this.position.z);
        this.positionProjected.x = (this.position.x * this.scaleProjected) + this.PROJECTION_CENTER_X;
        this.positionProjected.y = (this.position.y * this.scaleProjected) + this.PROJECTION_CENTER_Y;
    }
    backProject(){
        this.position.x = (this.positionProjected.x - this.PROJECTION_CENTER_X)/this.scaleProjected;
        this.position.y = (this.positionProjected.y - this.PROJECTION_CENTER_Y)/this.scaleProjected;
    }
    draw(ctx) {
        this.project();
        ctx.globalAlpha = Math.abs(1 - this.z / gWidth);
        ctx.beginPath();
        ctx.arc(this.positionProjected.x,this.positionProjected.y,this.size*this.scaleProjected,0,2*Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
