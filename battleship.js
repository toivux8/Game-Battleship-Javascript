var view= {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHIt: function (location) {
        var cell= document.getElementById(location);
        cell.setAttribute("class" , "hit");
    },

    displayMiss: function(location) {
        var cell= document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk:0,
    shipLength: 3,
    ships: [ {locations: [ 0, 0, 0], hits: ["", "", ""]},
            {locations: [0 ,0 , 0], hits: ["", "", ""]},
            {locations: [ 0 ,0 , 0], hits: ["", "", ""]}],
    fire: function(guess) {
        for(var i=0; i<this.numShips; i++) {
            var ship= this.ships[i];
            var index= ship.locations.indexOf(guess);
            if(index>=0) {
                ship.hits[index] = "hit";
                view.displayHIt(guess);
                view.displayMessage("HIT !");
                if(this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship");
                    this.shipsSunk++ ;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function(ship) {
        for(var i=0; i<this.numShips; i++) {
            if(ship.hits[i] !== "hit")
                return false;
        }
        return true;
    },

    generateShipLocations: function() {
        var locations;
        for(var i=0; i<this.numShips; i++) {
            do {
                locations = this.generateShip();
            }
            while(this.collision(locations))
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random()*2);
        var row, col;

        if(direction ===1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * this.boardSize-this.shipLength);
        }
        else {
            row = Math.floor(Math.random() * this.boardSize-this.shipLength);
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for(var i=0; i<this.shipLength; i++) {
            if(direction === 1) {
                newShipLocations.push(row + "" +(col+i));
            }
            else {
                newShipLocations.push((row+i) + "" +col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for(var i=0; i<this.shipLength; i++) {
            var ship = model.ships[i];
            for(var j=0; j<locations.length; j++) {
                if(ship.locations.indexOf(locations[j])>=0) {
                    return true;
                }
            }
        }
        return false;
    }

}

function parseGuess(guess) {
    var anphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if(guess === null||guess.length !==2)
        alert("Opps, please enter a letter and a number.");
    else {
        var firstLetter= guess.charAt(0);
        var row= anphabet.indexOf(firstLetter);
        var column= guess.charAt(1);
        if(isNaN(row)||isNaN(column)) {
            alert("Opps, that isn't on the board.");
        }
        else if(row<0||row>=model.boardSize||column<0||column>=model.boardSize) {
            alert("Opps, that is off the board.");
        }
        else 
            return row + column;
    }
    return null;
}

var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location= parseGuess(guess);
        if(location) {
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk == model.numShips) {
                view.displayMessage("You win the battlesip in" + this.guesses + "guesses.");
            }
        }
    },
}

function init() {
    var fireButton = document.getElementById("fireAction");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13) {
        fireButton.click();
        return false ;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value ;
    controller.processGuess(guess);

    // reset value of guess to null
    guess.value = "";
}

window.onload = init;



