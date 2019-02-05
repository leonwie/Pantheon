import paho.mqtt.client as mqtt
import time

def on_message(client, userdata, message):
	print("Received message on computer ",message.payload)
	print("Received message on computer")


client = mqtt.Client()

#client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")
client.connect("test.mosquitto.org",port=1883)

client.publish("IC.embedded/Pantheon/test","Connected to computer")

#mqtt.error_string(MSG_INFO.rc) #MSG_INFO is result of publish()

client.on_message = on_message

client.subscribe("IC.embedded/Pantheon/#")

while True:
	client.loop()
	time.sleep(2)
