const FyersAPI = require("fyers-api-v3").fyersModel

var fyers = new FyersAPI()
fyers.setAppId("TK2NQ6EYHR-100 ")
fyers.setRedirectUrl("https://successrate.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyersauthcodeverify")
fyers.setAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZDoxIiwiZDoyIiwieDowIiwieDoxIiwieDoyIl0sImF0X2hhc2giOiJnQUFBQUFCb2tESHJUSHBjdENpVEJ2ZVBRbDJDcVoyclJhbjdVY3gxZjFzN3B3ZGZSTEM2Vjk2MkpKTWROYkRFdVE0bzJLQS1ibjhieXJTNHZXUU5HMWwxZ3dxUkR2SS04OWk4ZlBkS0t0cTh2VmZYOV9LNXpEZz0iLCJkaXNwbGF5X25hbWUiOiIiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImZ5X2lkIjoiWFYzMTM2MCIsImFwcFR5cGUiOjEwMCwiZXhwIjoxNzU0MzUzODAwLCJpYXQiOjE3NTQyODA0MjcsImlzcyI6ImFwaS5meWVycy5pbiIsIm5iZiI6MTc1NDI4MDQyNywic3ViIjoiYWNjZXNzX3Rva2VuIn0.jfWRbCM77z9D8bhmUklThZovXOBmVUaJYe0hyTGVgdY"
)

const reqBody = 
{
  "id":"25080400002455",
}

fyers.cancel_order(reqBody).then((response) => {
    console.log(response)
}).catch((error) => {
    console.log(error)
})
