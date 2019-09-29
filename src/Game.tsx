import React, { useState, useEffect, useRef } from 'react';
import styles from './Game.module.scss';

const GRID_SIZE = 16;
const INTERVAL_MILLS = 300;

type Point = {
  x: number;
  y: number;
}

function isSame(lhs: Point, rhs: Point): boolean {
  return lhs.x === rhs.x && lhs.y === rhs.y;
}

enum Direction {
  LEFT, UP, RIGHT, DOWN,
}

class Snake {
  head = { x:0, y:1 };
  bodies = [{ x:0, y:0 }];
  direction = Direction.RIGHT;
}

function nextApple(snake: Snake): Point {
  while(true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const apple = { x, y };

    if (isSame(snake.head, apple)) continue;
    for (let body of snake.bodies) {
      if (isSame(body, apple)) continue;
    }
    return apple;
  }
}

class World {
  snake: Snake = new Snake();
  apple = nextApple(this.snake);

  next(input: Direction | null): World | null {
    const direction = input == null ? this.snake.direction : input;
    let dx = 0, dy = 0;
    switch (direction) {
      case Direction.LEFT:
        [dx, dy] = [0, -1];
        break;
      case Direction.UP:
        [dx, dy] = [-1, 0];
        break;
      case Direction.RIGHT:
        [dx, dy] = [0, 1];
        break;
      case Direction.DOWN:
        [dx, dy] = [1, 0];
        break;
    }

    let world = new World();
    world.snake = {
      head: { x: this.snake.head.x + dx, y: this.snake.head.y + dy },
      bodies: this.snake.bodies,
      direction,
    }
    world.apple = this.apple;
    if (isSame(this.apple, world.snake.head)) {
      world.snake.bodies.push(this.snake.head);
      world.apple = nextApple(world.snake);
    } else {
      world.snake.bodies = this.snake.bodies.slice(1);
      world.snake.bodies.push(this.snake.head);
    }

    const head = world.snake.head
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return null; // Game over; out-of-table
    }
    for (let body of world.snake.bodies) {
      if (isSame(body, head)) {
        return null; // Game over; crash
      }
    }
    return world;
  }
}

function range(length: number): number[] {
  return Array.from({ length }, (_, k) => k)
}

const Game: React.FC = () => {
  const [world, setWorld] = useState(new World());
  const [gameover, setGameover] = useState(false);
  
  const key : { current: Direction | null } = useRef(null);
  useEffect(() => {
    document.onkeydown = (e) => {
      switch (e.keyCode) {
        case 37:
          if (world.snake.direction !== Direction.RIGHT) {
            key.current = Direction.LEFT;
          }
          break;
        case 38:
          if (world.snake.direction !== Direction.DOWN) {
            key.current = Direction.UP;
          }
          break;
        case 39:
          if (world.snake.direction !== Direction.LEFT) {
            key.current = Direction.RIGHT;
          }
          break;
        case 40:
          if (world.snake.direction !== Direction.UP) {
            key.current = Direction.DOWN;
          }
          break;
      }
    }
  })

  useEffect(() => {
    const id = setInterval(() => {
      const nextWorld = world.next(key.current);
      if (nextWorld == null) {
        setGameover(true);
        clearInterval(id);
      } else {
        setWorld(nextWorld);
      }
    }, INTERVAL_MILLS);
    return () => {
      clearInterval(id);
    };
  });

  let cellStyles: string[][] = range(GRID_SIZE).map((i) => range(GRID_SIZE).map((j) => 
    styles.whitespace
  ));
  cellStyles[world.snake.head.x][world.snake.head.y] = styles.snakeHead;
  for (let body of world.snake.bodies) {
    cellStyles[body.x][body.y] = styles.snakeBody;
  }
  cellStyles[world.apple.x][world.apple.y] = styles.apple;

  const cells = range(GRID_SIZE).flatMap((i) => range(GRID_SIZE).map((j) =>
    <div className={`${styles.cell} ${cellStyles[i][j]}`} key={(i * GRID_SIZE + j).toString()}></div>
  ));
  return (
    <div className={styles.Game}>
      <div className={gameover ? styles.gameover : styles.gaming}>Game over</div>
      <div className={styles.table}>
        {cells}
      </div>
    </div>
  );
}

export default Game;
