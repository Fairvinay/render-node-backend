var NSEHOLIDAYS = [ "01-26-2023","07-Mar-2023","30-Mar-2023","04-Apr-2023","07-Apr-2023","14-Apr-2023","01-May-2023","28-Jun-2023","15-Aug-2023","19-Sep-2023","02-Oct-2023","24-Oct-2023","14-Nov-2023","27-Nov-2023","25-Dec-2023"];


var listofCNXBANK= [];

function rangeNew(size, startAt = 0,chunck) {
    return [...Array(size).keys()].map(i => i*chunck + startAt);
}

listofCNXBANK=  rangeNew(60,42000,100);


var listofNIFFIN= [];

listofNIFFIN=  rangeNew(20,17500,100);

var listofCNXIT= [];

listofCNXIT=  rangeNew(20,17500,100);

var listofNIFSEL= [];

listofNIFSEL=   rangeNew(50,7800,25);


var expiryOfCNXBANK = reCalculateExpiry(3);
var expiryOfNIFFIN = reCalculateExpiry(2);
var expiryOfNIFSEL = reCalculateExpiry(1);
var expiryOfCNXIT = reCalculateExpiry(3);

function lastThrusday(year, month) {
	var d = new Date();
	while(d.getDay() != 4)
			 	{
			 	    d.setDate(d.getDate() + 1)
		 	}
	while(d.getDate() <= 31 ){
		 d.setDate(d.getDate() + 7);

	}

	var lastThursday = d;// 7 = number of days in week, 4 = the thursdayIndex (0= sunday)
	var currentMs = d.getTime();
	//var lastThursday = new Date(currentMs + (daysAfterLastThursday * 24 * 60 * 60 * 1000));
    return lastThursday.toDateString();
}
  function reCalculateExpiry(daysFromSunday) {


      	   var day = daysFromSunday;
		 	var date = new Date();
		 	var nextYear = date.getFullYear() + 1;
		 	listofThrusday= [];
		 	var parameters ={"stock_code":'',
								"exch_code":'',
								"from_date":'',
								"to_date":'',
								"interval":'',
								"product_type":'',
								"expiry_date":'',
								"right":'',
						"strike_price":''};
			console.log("Day of week " +day+ " date.getDay()  "+ date.getDay());
		 	while(date.getDay() != day)
		 	{
		 	    date.setDate(date.getDate() + 1)
		 	}
			var month = 0; prevMont=0;
		 	while(date.getFullYear() < nextYear)
		 	{
		 	    var yyyy = date.getFullYear();

		 	    var mm = (date.getMonth() + 1);
		 	    mm = (mm < 10) ? '0' + mm : mm;
				month = mm;
		 	    var dd = date.getDate();
		 	    		date.setHours(0,0,0,0);
		 	    dd = (dd < 10) ? '0' + dd : dd;
		 	    for( var ft =0; ft <  NSEHOLIDAYS.length; ft++) {
					var dateString = NSEHOLIDAYS[ft];
				   if(new Date(dateString).toString() === "Invalid Date") {
					      console.log("NSE Holiday is invalid "+dateString);
    				}
			 	   else {
					   var holiday = new Date(dateString);
					   console.log("expiry Date "+date.toString() +" holiday "+holiday.toString());
					   if (date > holiday) {
					     console.log("expiry Date is greater than holiday ");
					   } else if (date < holiday) {
					     console.log("expiry Date is less than holiday ");
					   } else {
					     console.log("Both Dates are same");
					     console.log("expiry Date shifte prior to holiday ");
					     dd = dd -1 // don't change this way future date's get mismacthed after + 7 bello  date.setDate(date.getDate() - 1);
					     break;
					   }

				   }
		     	}
				//dd = date.getDate();
			    //dd = (dd < 10) ? '0' + dd : dd;
			    //console.log(" last thrusday " +lastThrusday(date.getFullYear() , mm));
			    if( [25 ,26, 27, 28 ,29 ,30 ,31 ].filter(x => x ==dd) !=""){
						dd = dd + 1;
				}

		 	    var li  ="<li><span class='dropdown-item' >"+yyyy + '-' + mm + '-' + dd +"</span></li>"

		 		listofThrusday.push(li);
		 	    console.log(yyyy + '-' + mm + '-' + dd)
				prevMont= mm;
		 	    date.setDate(date.getDate() + 7);
	 	}
		return listofThrusday;

      }

