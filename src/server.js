//const { createServer } = require('https');
const { createServer } = require("http");   // 👈 switch to http
const { parse } = require('url');
const fs = require('fs');
const express = require("express");
const next = require("next");
const apiRoutes = require("./routes"); 

const dev = process.env.NODE_ENV !== "production";
  const port = process.env.PORT || 3003; //10000;
//  const hostname = "0.0.0.0"; // use 0.0.0.0 for hosting, localhost for local dev

const app = next({ dev });
const handle = app.getRequestHandler();
let  parsedUrl = '';
const httpsOptions = {
    key: fs.readFileSync('./ssl.key/server.key'),
  cert: fs.readFileSync('./ssl.crt/server.crt'),
};





app.prepare().then(() => {

    const expressApp = express();
  /*  (req, res) => {
       parsedUrl = parse(req.url, true);
     // handle(req, res, parsedUrl);
    }
  */

     // Mount API routes under /api/*
  expressApp.use("/api", apiRoutes);

  // Next.js handles everything else
// ✅ works in Express 5+
/* expressApp.all("/*", (req, res) => {
  return handle(req, res, parse(req.url, true));
});
*/

// or more explicit:
expressApp.use((req, res) => {
  return handle(req, res, parse(req.url, true));
});

      
   // createServer(httpsOptions,expressApp ).listen(port, hostname, () => {
    createServer(expressApp ).listen(port, hostname, () => {
      console.log(`> Dev HTTPS server ready at https://${hostname}:${port}`);
    });

  // Example migrated Netlify function
  /*server.get("/api/hello", (req, res) => {
    res.json({ msg: "Hello from Express API!" });
  });

  // Another migrated Netlify function
  server.post("/api/contact", (req, res) => {
    res.json({ status: "Contact form received" });
  });

   // Mount API routes under /api/*
  expressApp.use("/api", apiRoutes);

  // Next.js handles everything else
  server.all("*", (req, res) => handle(req, res, parsedUrl));
   */

/*  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });*/
});
