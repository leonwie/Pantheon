import paho.mqtt.client as mqtt
import time
from test import read_data

def on_message(client, userdata, message):
	print("Received message: {} on topic {}" .format(time.clock_gettime(),time.clock_gettime()))


client = mqtt.Client()

client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")
client.connect("test.mosquitto.org",port=8884)

client.publish("IC.embedded/Pantheon/test","Connected to raspberry")

#mqtt.error_string(MSG_INFO.rc) #MSG_INFO is result of publish()

client.on_message = on_message

client.subscribe("IC.embedded/Pantheon/#")

while True:
	sensordata=read_data
	client.publish(sensordata)
    client.loop()
    time.sleep(2)
