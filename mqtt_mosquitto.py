import paho.mqtt.client as mqtt
import time
from i2c_reads import read_airflow_data
from i2c_reads import read_pressure_and_temp_data

#Variable to set whether pi is measuring or not
run=True

#When connected to MQTT:
def on_connect(client, userdata, flags, rc):
	# Subscribing in on_connect() means that if we lose the connection and
	# reconnect then subscriptions will be renewed.
	client.subscribe("IC.embedded/Pantheon/run")

#When disconnected from MQTT try reconnecting
def on_disconnect(client, userdata, rc):
	print("disconnected with rtn code [%d]"% (rc))
	connecting()

#When a message is received from MQTT
def on_message(client, userdata, message):
	print(message.payload)
	print("Received message")
	#If message set global variable run
	global run
	#Turn measurement on
	if(message.payload == b'on'):
		print("MESSAGE ON")
		run=True
	#Turn measurement off
	if(message.payload == b'off'):
		print("MESSAGE OFF")
		run=False

#Set the client
client = mqtt.Client()

#Set encryption for MQTT connection
client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")

#Function to connect to the MQTT broker
def connecting():
	try:
		client.connect("test.mosquitto.org", port=8884)
	except:
		#If connection failed try again:
		print("Error connection unsuccessful")
		connecting()

#Connect to the MQTT Broker
connecting()

#Print on console
print("Connection successful")

#Publish first message onto MQTT Broker
MSG_INFO = client.publish("IC.embedded/Pantheon/test","Connected to raspberry")
print(mqtt.error_string(MSG_INFO.rc)) #MSG_INFO is result of publish()

#Define callback functions
client.on_message = on_message
client.on_connect = on_connect
client.on_disconnect = on_disconnect

#Infinite loop
while True:
	#If run is set do the measurement
	if (run==True):
		#Function from i2c_ready
		airflowsensordata=read_airflow_data()
		#Function from i2c_ready
		pressuresensordata, ctempdata = read_pressure_and_temp_data()
		#Concatenate the data
		concatData = str(ctempdata) + ',' + str(pressuresensordata) + ',' + str(airflowsensordata)
		#Publish concatenated data to the Broker
		client.publish("IC.embedded/Pantheon/Measurement/concatData",concatData)
	#Loop for the client
	client.loop()
	#Sleep to save energy
	time.sleep(1)
