#Tetris.js

Classic canvas based game written in Javascript

[See it live!](http://www.jmgarza.info/tetris.js)

##Features

Game renders smoothly and rapidly by redrawing only portions of the screen that have changed.  Similarly, the game uses requestAnimationFrame to draw only when the browser
is ready to draw the next frame.  

All the tetrominoes are their own objects with a shape attribute that stores each cell object within an array of arrays.  By doing this, only the active tetromino's cells
make draw calls to HTML5's canvas.  Fewer calls to canvas keeps the game's framerate high.  The rotations are also calculated on the fly, rather than storing a pre-rotated
piece in the tetromino class.  By calculating piece transformations on the fly and keeping to a strict object-inhertance hierarchy, the code base stays very lean and maintainable.
