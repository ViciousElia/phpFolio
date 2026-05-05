/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0 Graphy3D Release Version                                  *
 * CLASS ----- 3D Vertices using the projective plane for display             *
 * USAGE ----- Include CC_vertexProjected.js as a module script. Instance     *
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
 *             CC_position.js                                                 *
 *                                                                            *
 * AUTHOR ---- Terra Macdonald, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

import { Vertex } from "./CC_vertex";
import { Position } from "./CC_position";

/**
 * Represents a vertex in 3-dimensional projective space
 * @class
 * @note The projection math requires a finite, positive z coordinate. Do not pass z ≤ 0 or non-finite values; call VertexProjected.setProjection(...) before using project()/draw().
 * @example
 * const p = new VertexProjected(1, 2, 3); // 3D vertex
 */
export class VertexProjected extends Vertex {
    static PROJECTION_CENTER_X;
    static PROJECTION_CENTER_Y;
    static PERSPECTIVE;
    
    static setProjection(width,height){
        this.PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
        this.PROJECTION_CENTER_X = width / 2; // x center of the canvas
        this.PROJECTION_CENTER_Y = height / 2; // y center of the canvas
    }
    _checkProjectionInitialized() {
        if (!this.constructor.PERSPECTIVE) {
            throw new Error("Projection not initialized. Call VertexProjected.setProjection() first.");
        }
    }

    constructor(position,size=0) {
        if (!(position instanceof Position)) throw new Error("Parameter `position` must be of type Position.");
        if (position.dimension!==3) throw new Error("Position must be in 3 dimensions!")
        super(position,size);
        this.positionProjected = new Position(0,0);
        this.scaleProjected = 0;
    }
    project() {
        this._checkProjectionInitialized();
        this.scaleProjected = this.constructor.PERSPECTIVE / (this.constructor.PERSPECTIVE + this.position.z);
        this.positionProjected.x = (this.position.x * this.scaleProjected) + this.PROJECTION_CENTER_X;
        this.positionProjected.y = (this.position.y * this.scaleProjected) + this.PROJECTION_CENTER_Y;
    }
    backProject(){
        this._checkProjectionInitialized();
        this.position.x = (this.positionProjected.x - this.PROJECTION_CENTER_X)/this.scaleProjected;
        this.position.y = (this.positionProjected.y - this.PROJECTION_CENTER_Y)/this.scaleProjected;
    }
    draw(ctx) {
        this._checkProjectionInitialized();
        this.project();
        const prevAlpha = ctx.globalAlpha;
        ctx.globalAlpha = Math.abs(1 - this.position.z / (this.constructor.PROJECTION_CENTER_X * 2));
        ctx.beginPath();
        ctx.arc(this.positionProjected.x,this.positionProjected.y,this.size*this.scaleProjected,0,2*Math.PI);
        ctx.fill();
        ctx.globalAlpha = prevAlpha;
    }
}
