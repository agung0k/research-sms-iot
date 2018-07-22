const firebase = require('firebase/app')
require('firebase/database')

var db;

function init(){
	var config = {
		apiKey: "AIzaSyACoYhtGhdfpp-iIcdKzcbvX055pL90Jsc",
		authDomain: "i3s-cloud.firebaseapp.com",
		databaseURL: "https://i3s-cloud.firebaseio.com/"
	};

	firebase.initializeApp(config);
	this.db = firebase.database()
}

function listenSensor(){
	var sensor1Ref = this.db.ref('sensors/sensor0001')
	sensor1Ref.on('value', function(snapshot){
		console.log(snapshot.val())
	})
}

function writeSensor(sensorId, state){
	var sensorData = {
		state: state
	};
	
	var updates = {}
	updates['/sensors/'+sensorId] = sensorData
	return this.db.ref().update(updates)
}
