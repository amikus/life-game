console.log("This will be a game of life.");



/*********/
/* World */
/*********/

// the game world layout
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

function elementFromChar(legend, ch) {
    // empty string is null
    if (ch == " ")
        return null;
    
    // otherwise, instantiate correct element by looking up 
    // character's constructor and applying new to it
    var element = new legend[ch]();
    
    // to help with lookup of originating char using charFromElement
    element.originChar = ch;
    
    return element;
}

function charFromElement(element) {
    if (element == null)
        return " ";
    else
        return element.originChar;
}

function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;
    
    
    map.forEach(function(line, y) {
        for (var x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
        }
    });
}

/*
Desc:       Displays World object as string

Requires:   NA
Result:     Returns output String representing game grid
*/
World.prototype.toString = function() {
    
    var output = "";
    
    // scans through grid, line-by-line,
    // producing one char for each element
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += "\n";
    }
    
    return output;
}
/**********/
/* Vector */
/**********/

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

/*
// Grid tests

// Test 1
// Result: undefined
var grid = new Grid(5, 5);
console.log(grid.get(new Vector(1, 1)));

// Test 2
// Result: X
grid.set(new Vector(1, 1), "X");
console.log(grid.get(new Vector(1, 1)));
*/

/********/
/* Wall */
/********/
function Wall() {}

/***********/
/* Critter */
/***********/

// the 8 squares surrounding a critter
var directions = {
    "n": new Vector(0, -1),
    "ne": new Vector(1, -1),
    "e": new Vector(1, 0),
    "se": new Vector(1, 1),
    "s": new Vector(0, 1),
    "sw": new Vector(-1, 1),
    "w": new Vector(-1, 0),
    "nw": new Vector(-1, -1)
};

// returns random element in array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// splits direction names into an array
var directionNames = "n ne e se s sw w nw".split(" ");

// simple critter that bounces off of obstacles
function BouncingCritter() {
    this.direct = randomElement(directionNames);
}

/*
Desc:       Critter uses View object that is passed to it to find an
            empty space to move into

Requires:   View object
Result:     Returns an action, which is an object with a type property
            that names the type of action a critter wants to take
            May also return direction critter wants to move
*/
BouncingCritter.prototype.act = function(view) {
    
    // if current direction is not empty
    if (view.look(this.direction) != " ")
        // find the nearest empty space
        this.direction = view.find(" ") || "s";
    
    return {type: "Move", direction: this.direction};
};

/***************/
/* The Program */
/***************/

// create the world
var world = new World(plan,
                     {"#": Wall,
                      "o": BouncingCritter});

//output the world
console.log(world.toString());

