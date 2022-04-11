import React from 'react';
import Board from '../Board/Board.component';
import styles from "./BoardController.module.css";

/**
 * Stati validi della board
 * RUN => Il file di configurazione iniziale è stato caricato e l'algoritmo sta calcolando lo stato successivo della board
 * STOP => Il file di configurazione iniziale è stato caricato, ma l'algoritmo è fermo e non sta calcolando lo stato successivo della board
 * NOT_LOAD => Nessun file di configurazione iniziale è stato caricato
 * INVALID_FILE => Il file di configurazione caricato non rispetta il formato corretto, è necessario caricare un altro file
 */
let BOARD_STATE = Object.freeze({RUN: Symbol("RUN"), STOP: Symbol("STOP"), NOT_LOAD: Symbol("NOT_LOAD"), INVALID_FILE: Symbol("INVALID_FILE")});

class BoardController extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
            speed: 500,
            board: null,
            boardKey: "0000000",
            generationCount: 0,
            controllerState: BOARD_STATE.NOT_LOAD
      }

      // ID timer per eseguire l'aggiornamento della board mostrando la generazione successiva
      this.timerID = null;

      // Bind al contesto dell'oggetto per this
      this.loadFile = this.loadFile.bind(this);
      this.start = this.start.bind(this);
      this.stop = this.stop.bind(this);
      this.setSpeed = this.setSpeed.bind(this);
      this.setCount = this.setCount.bind(this);
    }
    
    /**
     * Aggiorna lo stato del board controller con il numero totale di generazioni effettuate
     * 
     * @param {int} p_iTotalCount generazioni totali effettuate
     */
    setCount(p_iTotalCount = 0) {
        this.setState({
            generationCount: p_iTotalCount
        });
    }

    /**
     * Aggiorna lo stato del board controller con la nuova velocità di generazione
     * 
     * @param {Event} p_oEvent informazioni sull'evento generato
     */
    setSpeed(p_oEvent) {
        this.setState((prevState) => ({
            speed: p_oEvent.target.value,
            controllerState: prevState.controllerState === BOARD_STATE.RUN ? BOARD_STATE.STOP : prevState.controllerState
        }));
    }

    /**
     * Avvia il board controller portandolo nello stato di esecuzione
     */
    start() {
        this.setState({
            controllerState: BOARD_STATE.RUN
        });
    }

    /**
     * Ferma il board controller portandolo nello stato di stop
     */
    stop() {
        this.setState({
            controllerState: BOARD_STATE.STOP
        });
    }

    /**
     * Carica un nuovo file di configurazione.
     * Al termine del caricamento la board viene messa nello stato di stop se il caricamento termina con successo,
     * altrimenti viene portata nello stato di INVALID_FILE
     * 
     * @param {Event} p_oEvent informazioni sull'evento generato
     */
    loadFile(p_oEvent) {
        // FileReader per la lettura del file json di configurazione
        const l_oFileReader = new FileReader();
        l_oFileReader.readAsText(p_oEvent.target.files[0] || "", "UTF-8");
        l_oFileReader.onload = p_oEventFile => {
            let l_oJSON = JSON.parse(p_oEventFile.target.result);

            // Controllo la correttezza del file di configurazione

            // Controlli sulla tabella: - tutte le righe hanno stessa lunghezza e contengono solo i caratteri "*" e "."
            let l_iRowLength = (l_oJSON.board || [[]])[0].length;
            if(l_iRowLength) {
                for(let i=0; i<l_oJSON.board.length || 0; i++) {
                    if(l_iRowLength !== l_oJSON.board[i].length) {
                        // Riga di lunghezza diversa trovata
                        l_iRowLength = 0;
                        break;
                    }
                    for(let j=0; j<l_oJSON.board[i].length || 0; j++) {
                        if(l_oJSON.board[i][j] === "*" || l_oJSON.board[i][j] === ".") {
                            continue;
                        }
                        // Carattere non consentito trovato
                        l_iRowLength = 0;
                        break;
                    }
                }
            }
            
            // Aggiorno lo stato della board
            this.setState({
                boardKey: 'id' + (new Date()).getTime(),
                board: l_oJSON.board,
                generationCount: l_oJSON.initialGeneration,
                controllerState: isNaN(l_oJSON.initialGeneration) || !l_iRowLength ? BOARD_STATE.INVALID_FILE : BOARD_STATE.STOP
            });
        };
    }

    /**
     * Rappresentazione del controllore della board
     * 
     * @returns elemento del dom
     */
    render() {
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
                        <h1>Conway's Game of Life<span>Prova Tecnica</span></h1>
                        <div className={styles.counter}><span>{this.state.generationCount}</span></div>
                    </div>
                    <label htmlFor="loadFile">File di configurazione</label>
                    <input type="file" name="loadFile" id="loadFile" onChange={this.loadFile} accept="application/JSON"/>
                    <label htmlFor="setSpeed">Velocità di esecuzione (ms)</label>
                    <input type="number" min="100" step="100" placeholder="500" name="setSpeed" id="setSpeed" onChange={this.setSpeed} />
                    <i>{this.state.speed < 100 ? "I valori inferiori a 100 saranno riportati al valore minimo" : ""}</i>
                    <div className={styles.buttons}>
                        <button className={styles.startButton} onClick={this.start} disabled={this.state.controllerState === BOARD_STATE.STOP ? "" : "disabled"}>Start</button>
                        <button className={styles.stopButton} onClick={this.stop} disabled={this.state.controllerState === BOARD_STATE.RUN ? "" : "disabled"}>Stop</button>
                    </div>
                    <i className={styles.author}>@SimonePica</i>
                </section>
            </aside>
            <main>
                {
                this.state.controllerState === BOARD_STATE.NOT_LOAD ? 
                    <div className={styles.messageWrapper}>
                        <div className={styles.message}>
                            <div className={styles.icon}>📂</div>
                            <span>Caricare un file di configurazione iniziale</span>
                        </div>
                    </div>
                :
                (
                    this.state.controllerState === BOARD_STATE.INVALID_FILE ?
                        <div className={styles.messageWrapper}>
                            <div className={styles.message}>
                                <div className={styles.icon}>❌</div>
                                <span>Il file di configurazione non è valido</span>
                            </div>
                        </div>
                    :
                        <Board key={this.state.boardKey} enable={this.state.controllerState === BOARD_STATE.RUN} board={this.state.board} speed={Math.max(this.state.speed, 100)} initialGeneration={this.state.generationCount} updateCount={this.setCount} />
                )
                }
            </main>
        </div>
        );
    }
  }

export default BoardController;