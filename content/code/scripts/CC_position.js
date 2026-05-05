/******************************************************************************
 *                                                                            *
 * VERSION --- v1.0                                                           *
 * CLASS ----- Position Superclass for extension and implementation           *
 * USAGE ----- Include CC_position.js as a module script. Instance variable   *
 *             as Position(...coordinates). Provides common 2- and 3-         *
 *             dimensional checks (x,y,z, cross product, et c)                *
 *                                                                            *
 * METHODS --- constructor: assigns coordinates to an array, sets dimension   *
 *                 and calculates Euclidean length as modulus.                *
 *             origin: creates a new n-dimensional 0-vector                   *
 *             fromArray: creates a new Position directly from an array       *
 *             clone: creates a new copy-by-value of the Position             *
 *             toArray: creates a copy of the coordinates array               *
 *             toString: stringifies the Position as Position(...coords)      *
 *             isZero: checks whether the Position is close to zero           *
 *             equals: checks whether the Position has the same value as      *
 *                 another                                                    *
 *             add, subtract, multiply, cross: return new Positions from      *
 *                 standard vector arithmetic operations                      *
 *             increase, decrease, scale: perform vector arithmetic in-place  *
 *             inner: calculate the inner product                             *
 *             normalize: normalizes the vector, setting its modulus to 1     *
 *                 in-place                                                   *
 *             distance: calculates the Euclidean distance between two        *
 *                 Positions                                                  *
 *                                                                            *
 * PROPS ----- coordinates: n-dimensional coordinates of the Position         *
 *             dimension: number of coordinates representing the Position.    *
 *                 Not read-only, but should be treated as though it were.    *
 *             modulus: Euclidean size of the Position. Not read-only, but    *
 *                 should be treated as though it were.                       *
 *             x,y,z: aliases for coordinates[0], coordinates[1], and         *
 *                 coordinates[2] when they exist. Attempted access will      *
 *                 throw if the dimension is insufficient                     *
 *                                                                            *
 * DEPENDS --- [none]                                                         *
 *                                                                            *
 * AUTHOR ---- Terra Macdonald, FruitFolio.com                                     *
 *                                                                            *
 ******************************************************************************/

const POSITION_EPSILON = 1e-10;

/**
 * Represents a position in n-dimensional space
 * @class
 * @example
 * const p = new Position(1, 2, 3); // 3D position
 */
export class Position {
    /**
     * Creates a new Position
     * @constructor
     * @param {...number} coordinates - Numeric coordinates (e.g., x, y, z)
     * @throws {Error} If any coordinate is not a number
     */
    constructor(...coordinates){
        for (let coordinate of coordinates) if (typeof coordinate !== 'number') throw new Error('Coordinates must be numbers!');
        this.dimension = coordinates.length;
        this.coordinates = [...coordinates];
        this.modulus = this.#modulate();
    }
    static origin(dimensions) {
        return new Position(...Array(dimensions).fill(0));
    }
    static fromArray(arr) {
        return new Position(...arr);
    }
    /**
     * Creates a clone of this position
     * @returns {Position} A new Position with identical coordinates
     */
    clone() {
        return new Position(...this.coordinates);
    }
    /**
     * Returns an array representation of the position
     * @returns {Array} Array representation
     */
    toArray() {
        return [...this.coordinates];
    }
    /**
     * Returns a string representation of the position
     * @returns {string} String representation
     */
    toString() {
        return `Position(${this.coordinates.join(', ')})`;
    }
    /**
     * Checks if position is near the origin
     * @returns {boolean} True if modulus is sufficiently small
     */
    isZero() {
        return this.modulus < POSITION_EPSILON;
    }
    /**
     * Checks if two positions are equal. Does not throw on mismatched dimension
     * @param {Position} position - The position to compare against
     * @returns {boolean} True if positions are equal in dimension and coordinates
     * @example
     * const p1 = new Position(1, 2, 3);
     * const p2 = new Position(1, 2, 3);
     * p1.equals(p2); // true
     */
    equals(position){
        return position instanceof Position &&
           this.dimension === position.dimension &&
           this.coordinates.every((coord, i) => 
               Math.abs(coord - position.coordinates[i]) < POSITION_EPSILON
           );
    }
    /**
     * Adds two positions together (vector addition)
     * @param {Position} position - The position to add
     * @returns {Position} A new Position representing the sum
     * @throws {Error} If positions have different dimensions
     */
    add(position){
        if (!(position instanceof Position)) throw new Error("Cannot add positions and non-positions!");
        if (this.dimension !== position.dimension) throw new Error("Cannot add positions of unequal dimension!");
        const returnCoordinates = this.coordinates.map(
            (coord, i) => coord + position.coordinates[i]
        );
        return new Position(...returnCoordinates);
    }
    /**
     * Subtracts two positions (inverse vector addition)
     * @param {Position} position - The position to subtract
     * @returns {Position} A new Position representing the difference
     * @throws {Error} If positions have different dimensions
     */
    subtract(position){
        if (!(position instanceof Position)) throw new Error("Cannot subtract positions and non-positions!");
        if (this.dimension !== position.dimension) throw new Error("Cannot subtract positions of unequal dimension!");
        const returnCoordinates = this.coordinates.map(
            (coord, i) => coord - position.coordinates[i]
        );
        return new Position(...returnCoordinates);
    }
    /**
     * Multiplies position by a scalar (scalar multiplication)
     * @param {Number} scalar - The scale by which to multiply
     * @returns {Position} A new Position representing the product
     */
    multiply(scalar){
        if (typeof scalar !== 'number') throw new Error("Cannot multiply by non-number!");
        const returnCoordinates = this.coordinates.map(
            (coord) => coord * scalar
        );
        return new Position(...returnCoordinates);
    }
    /**
     * Adds two positions together in-place (vector addition)
     * @param {Position} position - The position to add
     * @throws {Error} If positions have different dimensions
     */
    increase(position){
        if (!(position instanceof Position)) throw new Error("Cannot add positions and non-positions!");
        if (this.dimension !== position.dimension) throw new Error("Cannot add positions of unequal dimension!");
        this.coordinates = this.coordinates.map(
            (coord, i) => coord + position.coordinates[i]
        );
        this.modulus = this.#modulate();
    }
    /**
     * Subtracts two positions in-place (inverse vector addition)
     * @param {Position} position - The position to subtract
     * @throws {Error} If positions have different dimensions
     */
    decrease(position){
        if (!(position instanceof Position)) throw new Error("Cannot subtract positions and non-positions!");
        if (this.dimension !== position.dimension) throw new Error("Cannot subtract positions of unequal dimension!");
        this.coordinates = this.coordinates.map(
            (coord, i) => coord - position.coordinates[i]
        );
        this.modulus = this.#modulate();
    }
    /**
     * Multiplies position by a scalar in-place (scalar multiplication)
     * @param {Number} scalar - The scale by which to multiply
     */
    scale(scalar){
        if (typeof scalar !== 'number') throw new Error("Cannot multiply by non-number!");
        this.coordinates = this.coordinates.map( (coord) => coord * scalar );
        this.modulus *= this.#modulate();
    }
    /**
     * Normalizes position
     * @throws {Error} If position is sufficiently close to zero vector. Essentially a Div0
     */
    normalize(){
        if (this.modulus<POSITION_EPSILON) throw new Error("Cannot normalize origin!");
        this.scale(1/this.modulus);
        this.modulus = 1;
    }
    /**
     * Gets the Euclidean distance between two positions
     * @param {Position} position - The position to compare
     * @returns {Number} A Number representing the distance between positions
     * @throws {Error} If positions have different dimensions
     */
    distance(position){
        if (!(position instanceof Position)) throw new Error("Cannot subtract positions and non-positions!");
        if (this.dimension !== position.dimension) throw new Error("Cannot subtract positions of unequal dimension!");
        return this.subtract(position).modulus;
    }
    /**
     * Calculates the inner product of two positions (n-dimensional dot-product)
     * @param {Position} position - The position to multiply
     * @returns {Number} A new number representing the dot-product
     * @throws {Error} If positions have different dimensions
     */
    inner(position){
        if (!(position instanceof Position)) throw new Error("Cannot multiply positions and non-positions!");
        if (this.dimension !== position.dimension) throw new Error("Cannot multiply positions of unequal dimension!");
        return this.coordinates.reduce((sum,coord,idx) => sum + coord*position.coordinates[idx],0);
    }
     /**
     * Calculates the cross-product of two positions in 3 dimensions
     * @param {Position} position - The position to multiply
     * @returns {Position} A Number representing the distance between positions
     * @throws {Error} If positions are not in 3 dimensions
     */
    cross(position) {
        if (!(position instanceof Position)) throw new Error("Cannot multiply positions and non-positions!");
        if (this.dimension !== 3 || position.dimension !== 3) throw new Error("Cross product only defined for 3D vectors");
        // Implementation...
        return new Position(
            this.y*position.z - position.y*this.z,
            this.z*position.x - position.z*this.x,
            this.x*position.y - position.x*this.y
        );
    }
    /**
     * Calculates the modulus (Euclidean distance from origin)
     * @private
     * @returns {number} The modulus (sqrt(Σ coordinate²))
     */
    #modulate() { return Math.sqrt(this.coordinates.reduce((sum, coord) => sum + coord * coord, 0)); }

    get x() { 
        if (this.dimension > 0) return this.coordinates[0];
        else throw new Error(`Position has dimension ${this.dimension}, but 'x' requires dimension >= 1`)
    }
    get y() { 
        if (this.dimension > 1) return this.coordinates[1];
        else throw new Error(`Position has dimension ${this.dimension}, but 'y' requires dimension >= 2`)
    }
    get z() { 
        if (this.dimension > 2) return this.coordinates[2];
        else throw new Error(`Position has dimension ${this.dimension}, but 'z' requires dimension >= 3`)
    }
    set x(value) {
        if (typeof value !== 'number') throw new Error("Positions must use numeric coordinates.");
        if (this.dimension>0) {this.coordinates[0] = value;this.modulus = this.#modulate();}
        else throw new Error(`Cannot set 'x': Position has dimension ${this.dimension}, but 'x' requires dimension >= 1`)
    }
    set y(value) {
        if (typeof value !== 'number') throw new Error("Positions must use numeric coordinates.");
        if (this.dimension>1) {this.coordinates[1] = value;this.modulus = this.#modulate();}
        else throw new Error(`Cannot set 'y': Position has dimension ${this.dimension}, but 'y' requires dimension >= 2`)
    }
    set z(value) {
        if (typeof value !== 'number') throw new Error("Positions must use numeric coordinates.");
        if (this.dimension>2) {this.coordinates[2] = value;this.modulus = this.#modulate();}
        else throw new Error(`Cannot set 'z': Position has dimension ${this.dimension}, but 'z' requires dimension >= 3`)
    }
}