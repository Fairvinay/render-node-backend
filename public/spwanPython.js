const {spawn} = require('child_process');


var uint8arrayToString = function(data) {
    return String.fromCharCode.apply(null, data);
};

const getPythonScriptStdout = (pythonScriptPath) => {
    const python = spawn('python', [pythonScriptPath]);
    return new Promise((resolve, reject) => {
        let result = ""
        python.stdout.on('data', (data) => {
            result += uint8arrayToString (data);
        });
        python.on('close', () => {
            resolve(result)
        });
        python.on('error', (err) => {
            reject(err)
        });
    })
}


getPythonScriptStdout('G:/jee-neonvinay/programs/angular/iciciapp/simple/public/printPY.py').then((output) => {
    console.log(output)
    var t = output.replace(/[\r\n]/gm, '')
      t = JSON.parse(t);
     console.log("output " + t.date + " ch " + t.checksum)
    console.log(" out: "+JSON.stringify(output));
    	

})