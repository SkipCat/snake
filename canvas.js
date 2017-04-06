// TODO
// go part (ws)
// display several apples ?
// more generic for snake move (not SnakeList[0])
// moveAllSnakes ?
// snake move automatic
// do not display apple on snake

var ws = new WebSocket('wss://golang-game-skipcat.c9users.io:8081');

ws.onerror = function (evt) {
    console.log("ERR: " + evt.data);
};
ws.onmessage = function(event) {
    console.log(event.data);
};

window.onload = function() {
    var canvas = document.querySelector('canvas');
    var context = canvas.getContext('2d');
    var nbPixel = 500;
    var nbCellsByLine = 20;
    var cellsize = nbPixel / nbCellsByLine;

    var SnakeList = [];
    var AppleList = [];

/*********************** CANVAS *************************/

    function createCanvas() {
        var i = 0;
        for (var x = 0; x < canvas.width; x += cellsize) {
            for (var y = 0; y < canvas.height; y += cellsize)  {
                if (i % 2 == 0) {
                    context.fillStyle = 'ivory';
                }
                else {
                    context.fillStyle = 'black';
                }
                context.beginPath();
                context.fillRect(x, y, cellsize, cellsize); // x and y coordonnates, 50 length and width
                i ++;
            }
            i ++;
        }
    }

/*********************** APPLES *************************/

    function createApple(color, coord) {
        return {color : color, coord : coord};
    }

    var newApple = createApple('crimson', [{
        x : Math.floor(Math.random() * nbCellsByLine), // int random between 0 and nb cells
        y : Math.floor(Math.random() * nbCellsByLine)
    }]);
    AppleList.push(newApple);

    function displayApple(AppleList) {
        for (var i = 0; i < AppleList.length; i ++) {
            context.beginPath();
            context.fillStyle = AppleList[i].color;
            context.fillRect(AppleList[i].coord[0].x * cellsize, AppleList[i].coord[0].y * cellsize, cellsize, cellsize);
        }
    }

    function eatApple(AppleList) {
        AppleList.pop();
        var apple = createApple('crimson', [{
            x : Math.floor(Math.random() * nbCellsByLine),
            y : Math.floor(Math.random() * nbCellsByLine)
        }]);
        AppleList.push(apple);
    }

/*********************** SNAKES *************************/

    function checkLimit(snake) {
        for (var i = 0; i < snake.body.length; i ++) {
            if (snake.body[i].x * cellsize >= canvas.width  || snake.body[i].x * cellsize < 0
                || snake.body[i].y * cellsize >= canvas.width  || snake.body[i].y * cellsize     < 0) {
                return true;
            }
        }
    }

    function killSnake(snake) {
        for (var i = 1; i < snake.body.length; i ++) { // i = 1 -> avoid to count head
            if (snake.body[0].x == snake.body[i].x && snake.body[0].y == snake.body[i].y) {
                return true;
            }
        }
    }

    function createSnake(name, color, list_pos) {
        return {name : name, color : color, body : list_pos};
    }

    function displaySnake(snake) {
        for (var i = 0; i < snake.body.length; i ++) {
            context.beginPath();
            context.fillStyle = snake.color;
            context.fillRect(snake.body[i].x * cellsize,snake.body[i].y * cellsize, cellsize, cellsize);
            context.strokeStyle = 'black';
            context.strokeRect(snake.body[i].x * cellsize, snake.body[i].y * cellsize, cellsize, cellsize);
        }
        // display snake head
        context.fillStyle = 'green';
        context.fillRect(snake.body[0].x * cellsize, snake.body[0].y * cellsize, cellsize, cellsize);
        context.strokeStyle = 'black';
        context.strokeRect(snake.body[0].x * cellsize, snake.body[0].y * cellsize, cellsize, cellsize);
    }

    function displayAllSnakes(SnakeList) {
        for (snake in SnakeList) {
            displaySnake(SnakeList[snake]);
        }
    }

    var newSnake = createSnake('Detritus', 'purple', [
        {x : 0, y : 0},
        {x : 1, y : 0},
        {x : 2, y : 0},
        {x : 3, y : 0}
    ]);
    SnakeList.push(newSnake);
    
    function moveSnake(coord) {
        SnakeList[0].body.unshift(coord); // add coord to beginning of array snake body
        var rectToChange = SnakeList[0].body[SnakeList[0].body.length-1]; // get first rect of body
        
        // check if head is on apple
        if (AppleList[0].coord[0].x * cellsize != coord.x * cellsize
            || AppleList[0].coord[0].y * cellsize!= coord.y * cellsize) { // DOES'NT MATCH WITH OBJECTS
            SnakeList[0].body.pop(); // pulls out last element of array body
        }
        else {
            eatApple(AppleList);
        }

        // game over
        if (checkLimit(SnakeList[0]) || killSnake(SnakeList[0])) {
            location.reload();
        }

        // redraw all
        createCanvas();
        displaySnake(SnakeList[0]);
        displayApple(AppleList);
    }
    // gameLoop = setInterval(doGameLoop, 16); // Play the game until the game is over

    function moveAllSnakes(SnakeList) {
        for (var snake in SnakeList) {
            moveSnake(SnakeList[snake]);
        }
    }

    document.onkeydown = function(event) {
        var movement = JSON.stringify(event.keyCode);
        ws.send(movement);
    
        /*if (event.keyCode === 37) { // left arrow
            var coordLeft = {
                x : SnakeList[0].body[0].x - 1,
                y : SnakeList[0].body[0].y
            };
            moveSnake(coordLeft);
        }
        if (event.keyCode === 38) { // up arrow
            var coordUp = {
                x : SnakeList[0].body[0].x,
                y : SnakeList[0].body[0].y - 1
            };
            moveSnake(coordUp);
        }
        if (event.keyCode === 39) { // right arrow
            var coordRight = {
                x : SnakeList[0].body[0].x + 1,
                y : SnakeList[0].body[0].y
            };
            moveSnake(coordRight);
        }
        if (event.keyCode === 40) { // down arrow
            var coordDown = {
                x : SnakeList[0].body[0].x,
                y : SnakeList[0].body[0].y + 1
            };
            moveSnake(coordDown);
        }*/
    };


/*********************** MAIN PROGRAM *************************/

    createCanvas();
    displayAllSnakes(SnakeList);
    displayApple(AppleList);
    //console.log('apple', AppleList[0].coord[0]);
};
