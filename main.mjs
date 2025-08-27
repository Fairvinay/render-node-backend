// main.js
import { Worker } from 'worker_threads';
import fs from 'fs/promises'; // Using promise-based file system
import path from 'path';
import { fileURLToPath } from 'url';

const CSV_URLS = [
  'http://192.168.1.12:3000/NSE_CM.csv',
  'http://192.168.1.12:3000/NSE_CM.csv',
  'http://192.168.1.12:3000/NSE_CM.csv'
];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runWorker = (url , workerName) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.mjs', {
      workerData: { url , workerName}
    });

    worker.on('message',  async (data) => {
      console.log(`✅ Worker finished for ${url}`);
     //  const filename = `output-${encodeURIComponent(url)}.json`;
     // const filepath = path.join(__dirname, 'outputs', filename);
         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeName = workerName.replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `output-${safeName}-${timestamp}.json`;
      const filepath = path.join(__dirname, 'outputs', filename);
      try {
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`📁 Written to ${filepath}`);
      resolve(data);
         } catch (err) {
        console.error(`❌ Error writing file for ${url}:`, err);
        reject(err);
      }

    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};

const run = async () => {
  console.log("Main: Starting 3 workers...");
  //const results = await Promise.all(CSV_URLS.map(runWorker));
  const results = await Promise.all(CSV_URLS.map(ur => {
      runWorker(ur, 'nse-read')
  }));
  console.log("All workers completed.");
  console.log("Combined Result:", results.flat());
};

run();
 