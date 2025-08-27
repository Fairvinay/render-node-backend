
import json


dateandCheck = { "date": "current_date" , "checksum" : "checksum"};



dateandCheck  = json.dumps(dateandCheck , separators=(',', ':'))


print (dateandCheck);