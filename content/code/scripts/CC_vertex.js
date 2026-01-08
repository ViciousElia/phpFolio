/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0                                                           *
 * CLASS ----- Vertex Superclass for extension and implementation             *
 * USAGE ----- Include CC_vertex.js as a deferred script. Instance variable   *
 *             as Vertex(position,size). No support is included for drawing   *
 *             or doing physics on the vertices. If that's needed, extend the *
 *             class with necessary features                                  *
 *                                                                            *
 * METHODS --- constructor: assigns position and size to instance. sets other *
 *                 properties to 0                                            *
 *                                                                            *
 * PROPS ----- position: position of vertex in 3d as {"x":0,"y":0,"z":0}      *
 *             size: relative size of vertex within its space. Used as radius *
 *                 when drawing                                               *
 *                                                                            *
 * DEPENDS --- [none]                                                         *
 *                                                                            *
 * AUTHOR ---- Terra Hyde, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

class Vertex{
    constructor(position,size=0) {
        this.position = position;
        this.size     = size;
    }
}
