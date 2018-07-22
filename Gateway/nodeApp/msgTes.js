const express = require('express')

const app = express()


app.get('/', (req, res) => res.send('Hello Worldaaah!'))
app.listen(3000, () => console.log('listening in port 3000'))

/* ==============================================================*/
/* =============== firebase -below- ==============*/
var FCM = require('fcm-node')
var serverKey = "AIzaSyACoYhtGhdfpp-iIcdKzcbvX055pL90Jsc"
var fcm = new FCM(serverKey)
