import paho.mqtt.client as mqtt
import time
from database import send_to_cloud

def on_message(client, userdata, message):
	print("Received message on computer ",message.payload)
	print("Typeof",type(message.payload))
	if(message.topic=="IC.embedded/Pantheon/Measurement"):
		send=str(message.payload)
		data = {
	    	"Time:":time.ctime(),
	    	"Downforce":send[2:len(send)-1]
			}
		print(data)
		send_to_cloud(data)


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
