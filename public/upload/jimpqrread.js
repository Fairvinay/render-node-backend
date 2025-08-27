
/*
https://medium.com/@dalaidunc/fs-readfile-vs-streams-to-read-text-files-in-node-js-5dd0710c80ea
https://stackoverflow.com/questions/13695046/watch-a-folder-for-changes-using-node-js-and-print-file-paths-when-they-are-cha
https://github.com/paulmillr/chokidar

reffre
https://stackoverflow.com/questions/71288762/why-does-this-module-return-undefined
*/
//Importing jimp module
var Jimp = require("jimp");
// Importing filesystem module
var fs = require('fs')
const util = require('util');
// Importing qrcode-reader module
var qrCode = require('qrcode-reader');
var chokidar = require('chokidar');
var path = require('path');

var paths = [path.resolve(__dirname + '/./../datafiles/')];
var outOkQRs = [path.resolve(__dirname + '/./../dataokqr/')];
// Read the image and create a buffer
// (Here image.png is our QR code)
var buffer =  ""//fs.readFileSync(paths[0]);
var watcher = chokidar.watch(paths, {ignored: /^\./, persistent: true ,interval: 100,
  binaryInterval: 300,
  alwaysStat: false,
  depth: 99,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },});
const readdir = util.promisify(fs.readdir);

readdir(paths[0]).then(files => {
  startQRTests(files.filter(file => /dummy\d+\.csv/.test(file)));
});

  
var jQrReader = function (fileName , jimp  )   { 
	console.log(" in jQrReader fileName "+fileName+" jimp "+(typeof jimp))
	this.buffer ="";
	this.fileBuf  = new Promise((resolve, reject) => {
		   try {
			   (async () => {
		        buffer = await fs.readFileSync(fileName)
		        resolve(buffer);
		   });
		} catch (error) {
            reject(error);
		   console.log("image "+fileName+" read failed ")
        }
	});
	
	console.log("fileBuf "+(typeof this.fileBuf));
	if ( typeof this.fileBuf !=='undefined'){
		this.fileBuf.then(imageData => { console.log(imageData); this.buffer =imageData; } );
		
	}
	console.log("buffer "+(typeof buffer));
	//var fileBuf= await fs.readFileSync(fileName);
// Parse the image using Jimp.read() method
   this.read = (fileName) => {
		return new Promise((resolve, reject) => {
		// re-initialsiles qr -code 
		var qrCode = require('qrcode-reader');
		var buffer = fs.readFileSync(fileName)
		console.log("buffer "+(typeof buffer));
		console.log("buffer "+JSON.stringify(buffer));
		var fileNamForQR = fileName.substring(fileName.lastIndexOf("/")+1,fileName.length)
	 
		   jimp.read(buffer, function(err, image) {
			if (err) {
				console.error(err);
			}
			// Creating an instance of qrcode-reader module
			let qrcode = new qrCode();
			qrcode.callback = function(err, value) {
				if (err) {
					console.error("qr call back er "+err);
					varR = "0"
					reject(error);
				}
				// Printing the decrypted value
				console.log(value.result);
				try {
					fs.writeFileSync(outOkQRs[0]+fileNamForQR+'.txt', value.result);
					varR =  value.result
					resolve(varR);
				} catch(err) {
					//res.send("file corrupt 2 ");
					console.log("file qr write error  "+err);
					varR = "0"
					reject(error);
				}
				//return varR;
			};
			// Decoding the QR code
			qrcode.decode(image.bitmap);
		  });
		});
	}
};
// watche the /datafiles/ folder
/*
watcher
  .on('add', function(path) {console.log('File', path, 'has been added');  })
  .on('change', function(path) {console.log('File', path, 'has been changed');   })
  .on('unlink', function(path) {console.log('File', path, 'has been removed');   })
  .on('error', function(error) {console.error('Error happened', error);})
*/
// check for files 
async function startQRTests(files) {
  for (let file of files) {
    console.log(file);
    await Jimp.read(fs.readFileSync(file));
    //await read2(file);
  }
}  


module.exports= [ jQrReader ,  Jimp ]