import paho.mqtt.client as mqtt
import time
from i2c_reads import read_airflow_data
from i2c_reads import read_pressure_and_temp_data

run=True

def on_connect(client, userdata, flags, rc):
	client.subscribe("IC.embedded/Pantheon/run")

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

#client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")

def connecting():
	try:
		client.connect("146.169.222.168", port=1883)
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
		pressuresensordata, ctempdata = read_pressure_and_temp_data()
		concatData = str(ctempdata) + ',' + str(pressuresensordata) + ',' + str(airflowsensordata)
		print(concatData)
		client.publish("IC.embedded/Pantheon/Measurement/concatData",concatData)
	client.loop()
	time.sleep(2)
