import React from 'react';
import styles from './App.module.scss';
import Game from './Game';

const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <p>react-snake</p>
      </header>
      <Game></Game>
    </div>
  );
}

export default App;
