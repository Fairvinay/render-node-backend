// worker.js
import { parentPort, workerData } from 'worker_threads';
import fetch from 'node-fetch';

const parseLine = (line) => {
  const parts = line.split(',');
  const rawName = parts[1] || '';
  const symbol = parts[9] || '';
  const name = rawName.split(' ').slice(0, 3).join(' ');
  return { symbol, name };
};

const fetchAndParse = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split('\n').filter(Boolean);
  return lines.map(parseLine);
};

fetchAndParse(workerData.url)
  .then(data => parentPort.postMessage(data))
  .catch(err => {
    console.error(`Worker Error for ${workerData.url}:`, err);
    parentPort.postMessage([]);
  });
