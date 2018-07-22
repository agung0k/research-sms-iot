const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, ()=> console.log('Listening on port 3000'))

const { StillCamera } = require("pi-camera-connect");
const stillCamera = new StillCamera({
		width: 720,
		height: 480
	});

/* ================================================================ */
/* ========================= firebase -below- ===================== */
const firebase = require('firebase/app')
require('firebase/database')

var db

var cam_name
var dir_name

var fastSnapExecNum


function init(){
	var config = {
		apiKey: "AIzaSyACoYhtGhdfpp-iIcdKzcbvX055pL90Jsc",
		authDomain: "i3s-cloud.firebaseapp.com",
		databaseURL: "https://i3s-cloud.firebaseio.com/",
		storageBucket: "i3s-cloud.appspot.com"
	};
	
	firebase.initializeApp(config);
	this.db = firebase.database()
	
	this.cam_name = "camera01"
	this.dir_name = `${ __dirname }/snapImage/`
	
	this.fastSnapExecNum = 0
}

function listenSensor(){
	var sensor1Ref = this.db.ref('sensors/sensor0001')
	sensor1Ref.on('value', function(snapshot){
		console.log(snapshot.val())
	})
}

init()

/* =============================================================== */
/* ======================= Fast Snap Photo ========================= */

const delay = require('delay')

const {performance} = require('perf_hooks')
var t0
var t1

function doFastSnap(){
	this.fastSnapExecNum++
	(async() => {
		await delay(1000 * (this.fastSnapExecNum -1))
		fastSnap()
	})();
}

function fastSnap(){
	var d = new Date()
	var date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear()
	var time = d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()
	
	var img_name = this.cam_name + '_' + date + '_' + time + '.jpg'
	//t0 = performance.now()
	stillCamera.takeImage().then(image => { 
		this.fastSnapExecNum--
		fs.writeFileSync('snapImage/'+img_name, image)
		//t1 = performance.now()
		//console.log("execution time: "+ (t1-t0))
		
		uploadPromiseFTP(this.dir_name, img_name)
		console.log(img_name + " captured")
	});
}


/* ======================= promise-ftp ====================== */
var PromiseFtp = require('promise-ftp')
var fs = require('fs')
var ftp = new PromiseFtp()


ftp.connect({
	host: 'retrolab.xyz',
	port: 21,
	user: 'scholar@i3s.retrolab.xyz',
	password: 'scholar',
	keepalive: 100})

function uploadPromiseFTP(dir_name, img_name){
	(async() => {
		var isConnected = false
		while(!isConnected){
			if(ftp.getConnectionStatus() == PromiseFtp.STATUSES.CONNECTED){
				ftp.put(dir_name + img_name, img_name)
				.then(function(){
					console.log(img_name + ' uploaded')
					writeLastSnap('http://i3s.retrolab.xyz/snapImage/' + img_name)
				})
				isConnected = true
				console.log("ftp is connected")
				
			} else if(ftp.getConnectionStatus() == PromiseFtp.STATUSES.DISCONNECTED){
				console.log("ftp needs to reconnect")
				ftp.reconnect()
				await delay(1000)
			}
			else{
				console.log("ftp is not yet connected")
				await delay(1000)
			}
			console.log(ftp.getConnectionStatus())
		}
		
	})();
	
}

/*======================== notify snap ====================== */

function writeLastSnap(imgUrl){
	return this.db.ref('/systems/system0001').update({last_snap: imgUrl})
}

/* ================================================================ */
/* ========================= MQTT -below- ========================= */
const mqtt = require('mqtt')
const mqtt_server = "mqtt://test.mosquitto.org"
const mqtt_camera_path = "camera_channel"

var client = mqtt.connect(mqtt_server)

client.on('connect', function(){
	client.subscribe(mqtt_camera_path)
})

client.on('message', function(topic, message){
	if(topic == mqtt_camera_path && message.toString() == '1'){
		console.log('snap requested')
		doFastSnap()
	}
})
