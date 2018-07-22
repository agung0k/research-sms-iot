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
  // message is Buffer
  //console.log(topic + " " + message)
  //client.end()

  if(topic == mqtt_sensor_path){
    if(message.toString() == '1'){
      console.log('Movement detected!')
      client.publish(mqtt_camera_path, '1')
    }
  }
})
