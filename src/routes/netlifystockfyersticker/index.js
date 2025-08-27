//const express = require("express");
 


//app.set("view engine", "ejs");


module.exports =  (app) => {
  const router = require("express").Router();
  // now you can use app
  app.set("view engine", "ejs");


  // Import all route modules
    //const helloRoute = require("./hello");
    //const contactRoute = require("./contact");
    const tickerRoutes = require("./routes"); //   require("./netlifystockfyersbridge");

    // Mount them under /api
    //router.use("/hello", helloRoute);
    //router.use("/contact", contactRoute);
    router.use("/", tickerRoutes);


 

  return router;
};
