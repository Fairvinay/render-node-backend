//var myPythonScript = "G:/jee-neonvinay/programs/python/breeze_venv/CrytopHashCheckSum.py";
var myPythonScript = "C:/icici/breeze_venv/CrytopHashCheckSum.py";
var pythonExecutable = "python";

const spawn = require('child_process').spawn;

var uint8arrayToString = function(data) {
    return String.fromCharCode.apply(null, data);
};


const getPythonScriptStdout = (pythonScriptPath) => {

  const python = spawn('python', ['-u',pythonScriptPath]);
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

var getCheckSum =
function (file, params,callback) {
    
   // var myPythonScript = "G:/jee-neonvinay/programs/python/breeze_venv/CrytopHashCheckSum.py";
var myPythonScript = "C:/icici/breeze_venv/CrytopHashCheckSum.py";

getPythonScriptStdout (myPythonScript).then((output) => {
    //console.log(output)
    var t = output.replace(/[\r\n]/gm, '')
      t = JSON.parse(t);
     console.log("output " + t.date + " ch " + t.checksum)
   // console.log(" out: "+JSON.stringify(output));
    callback(t)	

})

// console.log("python hash started ");

// var checkSum="";

// // The '-u' tells Python to flush every time
// const scriptExecution = spawn(pythonExecutable, );
// scriptExecution.stdout.on('data', (data) => {
//     //console.log("data "+data);
//     checkSum =uint8arrayToString(data); 
//     console.log(uint8arrayToString(data));
// 	callback(checkSum)
// 	return checkSum;
//     //window.console.log(new Date())
// });



} 
//getCheckSum();


module.exports = {
    
    getCheckSum: getCheckSum

}
