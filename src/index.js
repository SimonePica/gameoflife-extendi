import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import BoardController from './Components/BoardController/BoardController.component';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<BoardController tab="game" />);