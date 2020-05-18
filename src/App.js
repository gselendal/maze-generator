import React from 'react';
import logo from './logo.svg';
import './App.css';

const MAZE_BLOCK = 40;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const ROWS = CANVAS_HEIGHT / MAZE_BLOCK;
const COLS = CANVAS_HEIGHT / MAZE_BLOCK;
let grid = []
const padding = (CANVAS_WIDTH - CANVAS_HEIGHT) / 2
let stack = []
let pos = { x: 0, y: 0 };


class Cell {
  constructor(i, j, ctx) {
    this.i = i;
    this.j = j;
    this.ctx = ctx;
    this.walls = [true, true, true, true] // top right down left
    this.visited = false;
    this.highlighted = false;
  }

  show = () => {
    var x = this.i * MAZE_BLOCK;
    var y = this.j * MAZE_BLOCK;
    this.ctx.strokeStyle = 'white'

    this.ctx.beginPath()
    this.ctx.moveTo(padding + x, y)

    if (this.walls[0]) this.ctx.lineTo(padding + x, y + MAZE_BLOCK) //top
    else this.ctx.moveTo(padding + x, y + MAZE_BLOCK)

    if (this.walls[1]) this.ctx.lineTo(padding + x + MAZE_BLOCK, y + MAZE_BLOCK) //right
    else this.ctx.moveTo(padding + x + MAZE_BLOCK, y + MAZE_BLOCK)

    if (this.walls[2]) this.ctx.lineTo(padding + x + MAZE_BLOCK, y) //down
    else this.ctx.moveTo(padding + x + MAZE_BLOCK, y)

    if (this.walls[3]) this.ctx.lineTo(padding + x, y) //left
    this.ctx.stroke()


    if (this.visited) {
      var original = this.ctx.fillStyle;
      this.ctx.fillStyle = this.highlighted ? 'purple' : 'pink'
      this.ctx.fillRect(padding + x, y, MAZE_BLOCK, MAZE_BLOCK)
      this.ctx.fillStyle = original;
    }
  }

  checkNeighbors = () => {
    var neighbors = []

    var top = grid[this.index(this.i, this.j - 1)]
    var right = grid[this.index(this.i + 1, this.j)]
    var bottom = grid[this.index(this.i, this.j + 1)]
    var left = grid[this.index(this.i - 1, this.j)]

    if (top && !top.visited) neighbors.push(top)
    if (right && !right.visited) neighbors.push(right)
    if (bottom && !bottom.visited) neighbors.push(bottom)
    if (left && !left.visited) neighbors.push(left)

    if (neighbors.length > 0) {
      var rand = Math.floor(Math.random() * neighbors.length)
      return neighbors[rand]
    } else return undefined
  }

  index = (i, j) => {
    if (i < 0 || j < 0 || i >= COLS || j >= ROWS) return -1;
    return j + i * COLS
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.startCell = grid[0 + COLS * COLS]
    this.endCell = grid[ROWS]
  }

  draw = () => {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.drawMaze()
  }

  createMaze = async () => {
    for (var i = 0; i < ROWS; i++) {
      for (var j = 0; j < COLS; j++) {
        var cell = new Cell(i, j, this.ctx);
        grid.push(cell);
      }
    }

  }

  drawMaze = () => {
    for (var i = 0; i < grid.length; i++) {
      grid[i].show();
    }

    this.current.visited = true;
    this.current.highlighted = true;
    var next = this.current.checkNeighbors()

    if (next) {
      next.visited = true;

      stack.push(this.current);
      this.removeWalls(this.current, next)

      this.current = next;
    } else if (stack.length > 0) {
      var cell = stack.pop();
      this.current = cell;
    }
  }
  //top right down left
  removeWalls = (curr, next) => {
    var xdiff = next.j - curr.j;
    var ydiff = next.i - curr.i;

    if (xdiff === 1) {
      next.walls[3] = false;
      curr.walls[1] = false;
    } else if (xdiff === -1) {
      next.walls[1] = false;
      curr.walls[3] = false;
    }

    if (ydiff === 1) {
      next.walls[0] = false;
      curr.walls[2] = false;
    } else if (ydiff === -1) {
      next.walls[2] = false;
      curr.walls[0] = false;
    }
  }

  start = async () => {
    this.loop();
    this.createMaze()
    this.current = grid[0]
  }

  loop = () => {
    this.gameInterval = setInterval(() => {
      this.draw();
    }, 30);
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext('2d');
    this.start();
  }

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        < canvas id='c1' ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        </canvas>
      </div>
    );
  }
}

export default App;
