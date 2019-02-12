import paho.mqtt.client as mqtt
import time
from test import read_data

def on_message(client, userdata, message):
	print(message)
	print("Received message")

client = mqtt.Client()

client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")
while(client.connect("test.mosquitto.org", port=8884)!=0):
	print("Error connection unsuccessful")
	print(mqtt.error_string(RETURN_CODE))


print("Connection successful")

MSG_INFO = client.publish("IC.embedded/Pantheon/test","Connected to raspberry")
print(mqtt.error_string(MSG_INFO.rc)) #MSG_INFO is result of publish()

client.on_message = on_message

client.subscribe("IC.embedded/Pantheon/run")

while True:
	sensordata=read_data()
	client.publish("IC.embedded/Pantheon/Measurement",str(sensordata))
	client.loop()
	time.sleep(2)
