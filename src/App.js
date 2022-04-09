import logo from './logo.svg';
import Board from './Components/Board/Board.component';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.wrapper}>
      <aside>
        <header className={styles.logo}>
          <div className={styles.group}>
            <span className={styles.g}>G</span>
            <span>ame<div><span className={styles.of}>OF</span> life</div></span>
          </div>
        </header>
        <section>
          <div className={styles.title}>
            <h1> Conway's Game of Life<span>Prova Tecnica</span></h1>
            <div className={styles.counter}><span>0</span></div>
          </div>
          <label for="loadFile">File di configurazione</label>
          <input type="file" name="loadFile" id="loadFile" />
          <label for="setSpeed">Velocità di esecuzione</label>
          <input type="number" min="100" step="100" placeholder="500" name="setSpeed" id="setSpeed" />
          <div className={styles.buttons}>
            <button className={styles.startButton}>Start</button>
            <button className={styles.stopButton} disabled>Stop</button>
          </div>
        </section>
      </aside>
      <main>
        <Board />
      </main>
    </div>
  );
}

export default App;
