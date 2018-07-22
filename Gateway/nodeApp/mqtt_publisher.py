import paho.mqtt.publish as publish
 
MQTT_SERVER = "192.168.34.2"
#MQTT_SERVER = "localhost"
MQTT_PATH = "camera_channel"
 
publish.single(MQTT_PATH, "Hello World!", hostname=MQTT_SERVER)
