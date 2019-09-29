import React, { useState } from 'react';
import styles from './Game.module.scss';

class Snake {
  head: [number, number];
  bodies: Array<[number, number]>;
  direction: [number, number];

  constructor() {
    this.head = [0,1];
    this.bodies = [[0,0]];
    this.direction = [0,1];
  }
}

function range(length: number): number[] {
  return Array.from({length}, (v,k) => k)
}

function nextApple(grid_size: number, snake: Snake): [number, number] {
  while(true) {
    const i = Math.floor(Math.random() * grid_size);
    const j = Math.floor(Math.random() * grid_size);

    if (snake.head === [i,j]) continue;
    for (let body of snake.bodies) {
      if (body === [i,j]) continue;
    }
    return [i,j];
  }
}

const Game: React.FC = () => {
  const grid_size = 16

  const [snake, setSnake] = useState(new Snake());
  const [apple, setApple] = useState(nextApple(grid_size, snake));

  let cellStyles: string[][] = range(grid_size).map((i) => range(grid_size).map((j) => 
    styles.whitespace
  ));
  cellStyles[snake.head[0]][snake.head[1]] = styles.snakeHead;
  for (let body of snake.bodies) {
    cellStyles[body[0]][body[1]] = styles.snakeBody;
  }
  cellStyles[apple[0]][apple[1]] = styles.apple;

  const cells = range(grid_size).flatMap((i) => range(grid_size).map((j) =>
    <div className={`${styles.cell} ${cellStyles[i][j]}`} key={(i * grid_size + j).toString()}></div>
  ));
  return (
    <div className={styles.Game}>
      <div className={styles.table}>
        {cells}
      </div>
    </div>
  );
}

export default Game;
