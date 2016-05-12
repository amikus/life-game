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
};

/*
Desc:       Creates turn system to allow critters to act
            within the World
Requires:   NA
Result:     In succession, each critter takes one action
*/
World.prototype.turn = function() {
    // for tracking critters that have already acted
    var acted = [];
    
    this.grid.forEach(function(critter, vector) {
        
        // if a critter can act and hasn't already acted this turn
        if (critter.act && acted.indexOf(critter) == -1) {
            // add critter to the acted array
            acted.push(critter);
            // let critter act
            this.letAct(critter, vector);
        }
    }, this);
};

/*
Desc:       Enables critter to take a single action
Requires:   A Critter and a Vector object
Result:     Critter takes a single action
*/
World.prototype.letAct = function(critter, vector) {
    
    // get an action from the critter
    var action = critter.act(new View(this, vector));
    
    // if an action is found and it's a "move" type action
    if (action && action.type == "move") {
        
        // get a valid destination for the critter
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) == null) {
            
            //and move the critter to the location
            this.grid.set(vector, null);
            this.grid.set(dest, critter);
        }
    }
};


/*
Desc:       Checks to see if intended critter destination is valid
Requires:   A critter action and a Vector object
Result:     Returns critter destination Vector if it is a valid
            destination
*/
World.prototype.checkDestination = function(action, vector) {
    
    // if the direction array contains the direction specified
    // by the object
    if (directions.hasOwnProperty(action.direction)) {
        
        // determine whether or not the direction is a valid
        // direction for the critter to move
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest))
            return dest;
    }
};

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


Grid.prototype.forEach = function(f, context) {
    //scans through grid, line by line
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            
            var value = this.space[x + y * this.width];
            if (value != null)
                
                //calls function that was passed in for
                //each element of the grid that isn't null/undefined
                f.call(context, value, new Vector(x, y));
        }
    }
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
};

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

/********/
/* View */
/********/

/*
Desc:       View constructor
Requires:   World object, Vector object
Result:     Creates instance of View object
*/
function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

/*
Desc:       Gather character stored in a space that is located
            adjacent to critter in a specified direction
Requires:   Direction critter is looking
Result:     Returns character stored in specified direction
*/
View.prototype.look = function(dir) {
    
    // set target to space critter may act upon
    var target = this.vector.plus(directions[dir]);
    
    // if target is a valid location within grid . . .
    if (this.world.grid.isInside(target))
        // . . . grab the char stored at that location
        return charFromElement(this.world.grid.get(target));
    else
        // . . . otherwise return a wall
        return "#";
};

/*
Desc:       Finds all directions adjacent to critter in which a
            particular character chan be found
Requires:   Character to look for
Result:     Returns array of directions in which critter can find
            character of interest
*/
View.prototype.findAll = function(ch) {
    // array for storing each direction in which ch can be found
    var found = [];
    
    // look in each direction
    for (var dir in directions)
        // if direction has ch, store the direction in found array
        if (this.look(dir) == ch)
            found.push(dir);
    
    // return directional array
    return found;
};

/*
Desc:       Return a random direction adjacent to critter in which a
            particular character can be found
Requires:   Character to look for
Result:     Returns random direction in which critter can find
            character of interest
*/
View.prototype.find = function(ch) {
    // store array of each direction in which ch can be found
    var found = this.findAll(ch);
    
    // if ch cannot be found in any direction, return null
    if (found.length == 0)
        return null;
    
    // otherwise return a random direction from the found array
    return randomElement(found);
}

/***************/
/* The Program */
/***************/

// create the world
var world = new World(plan,
                     {"#": Wall,
                      "o": BouncingCritter});

// output the world
// 5 turns
for (var i = 0; i < 5; i++) {
    world.turn();
    console.log(world.toString());
}
}

