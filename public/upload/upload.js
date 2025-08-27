
/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
var serverIP = "localhost";
var serverPORT= "61749";
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
		var qrDATA = "";
        reader.onload = function (e) {
	           console.log("upload js readURL called ");
               $('#imageResult')
                .attr('src', e.target.result)
				.css('width', '6.5rem')
				.css('height', '6.5rem');
				qrDATA = e.target.result;
				console.log("upload js file uploaded "+e.target.result);
				var form = $('#fileUploadForm')[0];
				var data = new FormData(form);
				console.log("sending file to node ....");
				// send QR data to node 
				$.ajax({
				   type: 'POST',
				   url: "http://"+serverIP+":"+serverPORT+"/datafileform",
				   enctype: 'multipart/form-data',
				   processData: false,
				   contentType: false,
				   data: data,
				   cache: false,
				   success: function (result) { 
				    console.log(result); 
					var jRes = JSON.parse(result)
					$('#serverFileStatus').text('File Sent '+jRes.status);
					$('#serverFileRefer').text(jRes.refer);
					$('#serverFileTST').text('Refer code:');
				   }
				});
        };
        var r = reader.readAsDataURL(input.files[0]);
		//if(qrDATA !=='undefined' && qrDATA !=="" ){ 
		return qrDATA;
		//}
    }
}

$(function () {
    $('#upload').on('change', function () {
        qrDATA =  readURL(input);
		//qrDATA = $('#imageResult').attr('src')
		 
		
    });
});

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  if(input.files[0])
  {  var fileName = input.files[0].name;
	
  infoArea.textContent = 'File name: ' + fileName;
  }
}

/*  ==========================================
    SHOW Window Document URL  NAME
* ========================================== */

var windowLocOrg = window.location.origin;
alert("window.location.origin "+windowLocOrg);
var windowHost = window.location.host;
alert(" window.location.host "+windowHost);
var windowIPAndPort = windowHost.split(":")
var windowIP = windowIPAndPort[0];
var windowPort = windowIPAndPort[1];
alert(" IP "+windowIP);
alert(" PORT "+windowPort);
if (typeof windowIP !=='undefined' && typeof windowPort !=='undefined'){
    	
    if(validIPaddress(windowIP) && validPort(windowPort)){
    		 serverIP = windowIP;
			 serverPORT= windowPort;
    }

}
function validIPaddress(ipaddress) {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return (true)  
  }  
  alert("You have entered an invalid IP address!")  
  return (false)  
}  
function validPort(port){

	// Regular expression to check if number is a valid port number
const regexExp = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;
// a number
const num = port;
   if(!regexExp.test(port)){
   	alert("You have entered an invalid PORT !") 
   	return (false)  
   }
    return (true)  
  
}