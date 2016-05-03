console.log("This will be a game of life.");

/*********/
/* World */
/*********/

var plan =
    ["############################",
     "#      #    #      o      ##",
     "#                          #",
     "#          #####           #",
     "##         #   #    ##     #",
     "###           ##     #     #",
     "#           ###      #     #",
     "#   ####                   #",
     "#   ##       o             #",
     "# o  #         o       ### #",
     "#    #                     #",
     "############################"];

// Vector is used to represent coordinate pairs
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

// adds two Vectors
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

/********/
/* Grid */
/********/

// Grid constructor
function Grid (width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
}

// determines whether Vector is within boundaires of Grid
Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width &&
           vector.y >= 0 && vector.y < this.height;
};

// gets object located at given Vector
Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width * vector.y];
};

// places object at given Vector
Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
};

// Grid tests

// Test 1
// Result: undefined
var grid = new Grid(5, 5);
console.log(grid.get(new Vector(1, 1)));

// Test 2
// Result: X
grid.set(new Vector(1, 1), "X");
console.log(grid.get(new Vector(1, 1)));