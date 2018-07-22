const express = require('express')

const app = express()


app.get('/', (req, res) => res.send('Hello Worldaaah!'))
app.listen(3000, () => console.log('listening in port 3000'))

/* ==============================================================*/
/* =============== firebase -below- ==============*/
const firebase = require('firebase/app')
require('firebase/database')

var db;

var timerCam1

function init(){
	var config = {
		apiKey: "AIzaSyACoYhtGhdfpp-iIcdKzcbvX055pL90Jsc",
		authDomain: "i3s-cloud.firebaseapp.com",
		databaseURL: "https://i3s-cloud.firebaseio.com/",
		messagingSenderId: '360590744222'
	};

	firebase.initializeApp(config);
	this.db = firebase.database()
	
	normalizeUserCommand()
	
	timerCam1 = 0
}

function normalizeUserCommand(){
	this.db.ref('/systems/system0001').update({user_action: '0'})
}

function listenSensor(){
	/*
	var sensor1Ref = this.db.ref('sensors/sensor0001')
	sensor1Ref.on('value', function(snapshot){
		console.log(snapshot.val())
	})
	*/
	var userAction = this.db.ref('systems/system0001/user_action')
	userAction.on('value', function(snapshot){
		var userCmd = snapshot.val()
		console.log('user memerintah ' + userCmd)
		
		switch(userCmd){
			case '1':
				client.publish(mqtt_camera_path, '1')
				break
			case '2':
				client.publish(mqtt_camera_path, '2')
				break
			case '3':
				client.publish(mqtt_camera_path, '3')
				break
			case '4':
				raiseAlarm()
				break
			default:
				console.log('user command idle')
		}
		normalizeUserCommand()
		
	})
}

function writeSensor(sensorId, state){
	return this.db.ref('/sensors/'+sensorId).update({state: state})
}

//const {performance} = require('perf_hooks')

init()
listenSensor()

/*
testing()
function testing(){
	var t0 = performance.now()
	this.db.ref('/sensors/sensor0001').update({state: true}).
	then(function(){
			var t1 = performance.now()
			console.log("execution time: "+ (t1-t0))
		})
}
*/

/* ==============================================================*/
/* =============== mqtt -below- ==============*/
const mqtt = require('mqtt')

const mqtt_server = "mqtt://test.mosquitto.org"
const mqtt_sensor_path = "sensor_channel"
const mqtt_camera_path = "camera_channel"

//const cam1_path = "mqtt://test.mosquitto.org"

var client  = mqtt.connect(mqtt_server)
 
client.on('connect', function () {
  client.subscribe(mqtt_sensor_path)
})
 
client.on('message', function (topic, message) {
  console.log(message.toString())

  if(topic == mqtt_sensor_path){
    if(message.toString() == 'sensor1_1'){
	  if(timerCam1 < (Date.now())){
		  client.publish(mqtt_camera_path, '1')
		  timerCam1 = Date.now() + 5000
		  console.log("instruct camera 1")
	  }
      console.log('Movement detected!')
      pushNotif("Sensor 1 Detect Something")
      
      writeSensor('sensor0001', true)
    }
    else if(message.toString() == 'sensor1_0'){
	  writeSensor('sensor0001', false)
	}
	
	else if(message.toString() == 'sensor2_1'){
	  if(timerCam1 < (Date.now())){
		  client.publish(mqtt_camera_path, '2')
		  timerCam1 = Date.now() + 5000
		  console.log("instruct camera 2")
	  }
      console.log('Movement detected!')
      pushNotif("Sensor 2 Detect Something")
      
      writeSensor('sensor0002', true)
    }
    else if(message.toString() == 'sensor2_0'){
	  writeSensor('sensor0002', false)
	}
	
	else if(message.toString() == 'sensor3_1'){
	  if(timerCam1 < (Date.now())){
		  client.publish(mqtt_camera_path, '3')
		  timerCam1 = Date.now() + 5000
		  console.log("instruct camera 3")
	  }
      console.log('Movement detected!')
      pushNotif("Sensor 3 Detect Something")
      
      writeSensor('sensor0003', true)
    }
    else if(message.toString() == 'sensor3_0'){
	  writeSensor('sensor0003', false)
	}
	else{
		console.log("error message")
	}
  }
})

var Gpio = require('onoff').Gpio
var buzzer = new Gpio(17, 'out')

const delay = require('delay')


function raiseAlarm(){
	(async() =>{
		buzzer.write(1, function(err){
			console.log("buzzer on")
		})
		
		await delay(5000)
		
		buzzer.write(0, function(err){
			console.log("buzzer off")
		})
		
		})()
}

/* ==============================================*/
/* ================== pusher ====================*/
var Pusher = require('pusher');
var pusher = new Pusher({
  appId: '564059',
  key: 'cada946cd94280b616b6',
  secret: '87ceede8ea56a6d077d9',
  cluster: 'ap1',
  encrypted: true
});

function pushNotif(messageBody){

	pusher.trigger('my-channel', 'my-event', messageBody);
}
