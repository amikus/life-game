console.log("This will be a game of life.");

/* World map */
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

Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

