# Conway's Game of Life - PROVA TECNICA

Progetto creato con ReactJS che simula "Conway's Game of Life".

## Come utilizzare l'applicazione:

1. Creare un file JSON nel seguente formato:

```json
    "initialGeneration": 2,
    "board": [
        ["*", ".", ".", "*"],
        ["*", ".", ".", "*"],
        ["*", ".", ".", "*"]
    ]
```

dove *initialGeneration* è la generazione di partenza e *board* è una matrice di "*", "." che rappresenta lo stato iniziale;

2. Caricare il file JSON creato nell'applicazione;
3. Determinare la velocità di esecuzione (default: 500, minValue: 100);
4. Premere il **bottone START** per iniziare a calcolare le generazioni successive della board;
5. Per fermare le generazioni premere il **bottone STOP**

**NOTA**: *Cambiando la velocità di esecuzione o caricando una nuova configurazione iniziale, l'applicazione entra nello stato di STOP*