import paho.mqtt.client as mqtt
import time
from i2c_reads import read_airflow_data
from i2c_reads import read_pressure_data

run=True

def on_connect(client, userdata, flags, rc):
	.subscribe("IC.embedded/Pantheon/run")

def on_disconnect(client, userdata, rc):
	print("disconnected with rtn code [%d]"% (rc))
	connecting()

def on_message(client, userdata, message):
	print(message.payload)
	print("Received message")
	global run
	if(message.payload == b'on'):
		print("MESSAGE ON")
		run=True
	if(message.payload == b'off'):
		print("MESSAGE OFF")
		run=False

client = mqtt.Client()

client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")

def connecting():
	try:
		client.connect("test.mosquitto.org", port=8884)
	except:
		print("Error connection unsuccessful")
		#print(mqtt.error_string(RETURN_CODE))
		connecting()

connecting()

print("Connection successful")

MSG_INFO = client.publish("IC.embedded/Pantheon/test","Connected to raspberry")
print(mqtt.error_string(MSG_INFO.rc)) #MSG_INFO is result of publish()

client.on_message = on_message
client.on_connect = on_connect
client.on_disconnect = on_disconnect

while True:
	if (run==True):
		airflowsensordata=read_airflow_data()
		pressuresensordata=read_pressure_data()
		client.publish("IC.embedded/Pantheon/Measurement/Airpressure",str(pressuresensordata))
		client.publish("IC.embedded/Pantheon/Measurement/Airflow",str(airflowsensordata))
	client.loop()
	time.sleep(2)
