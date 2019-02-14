import paho.mqtt.client as mqtt
import time
import pyrebase
import sys

#Wing Info
WINGSPAN = 10
CHORD = 10
LIFTCOEFFICIENT = 10

#Configure Firebase database
config = {
    "apiKey": "AIzaSyCAnkKBia6Jd8REycaDryC2AY5Jj_NQBpQ",
    "authDomain": "formula-1-7a0c8.firebaseapp.com",
    "databaseURL": "https://formula-1-7a0c8.firebaseio.com",
    "projectId": "formula-1-7a0c8",
    "storageBucket": "formula-1-7a0c8.appspot.com",
    "messagingSenderId": "708407712539"
}

#Initialize firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

#If connected to mqtt
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Hello")
        print("Connected with result code "+str(rc))
        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        client.subscribe("IC.embedded/Pantheon/#")
        client.publish("IC.embedded/Pantheon/test","Connected to computer2")
    else:
        print("Connection failed")

#If a message is received
def on_message(client, userdata, message):
    print("Received message on computer ",message.payload)
    print("Message topic: ",message.topic)

	#Check for message topic
    if(message.topic=="IC.embedded/Pantheon/Measurement/concatData"):
        print("Measurement received")
        #Receive the sensordata
        sensordata=message.payload
        #Decode the sensordata
        sensordata=sensordata.decode("utf-8")
        #Split the sensordata up into the individual measurements
        sensorvalues=sensordata_dec.split(",")
        #Split the array into different variables and convert to float
        temperature = float(sensorvalues[0])
        airpressure = float(sensorvalues[1])
        airflow = float(sensorvalues[2])
    #Convert temperature to kelvin
    tempk = temperature + 273.15
    #Calculate airdensity
    airdensity = tempk / (287.05 * airpressure * 100)
    #Calculate Downforce
    downforce = 0.5 * WINGSPAN * CHORD * LIFTCOEFFICIENT * airdensity * airflow*100
    #Add downforce with timestamp to database to be fetched
    downforce_add = {
    "Time:":time.ctime(),
    "Downforce":str(round(downforce,6))
    }
    #Update the most recent downforce value
    downforce_update = {
    "Downforce":str(round(downforce,6))
    }
    #Update the most recent airpressure value
    airpressure_update = {
    "Pressure":str(round(airpressure,6))
    }
    #Update the most recent temperature value
    temperature_update = {
    "Temperature":str(round(temperature,6))
    }
    print("Sending to cloud")
    #send the data to the cloud
    send_to_cloud(downforce_add)
    update_cloud(downforce_update, "Downforce")
    update_cloud(airpressure_update, "Pressure")
    update_cloud(temperature_update, "Temperature")

#Function to connect to the MQTT broker
def connecting():
	try:
		client.connect("146.169.213.10", port=1883)
	except:
		print("Error connection unsuccessful")
        #If connection fails try again
		connecting()

#initialize the client
client = mqtt.Client()
#Connect to the MQTT Broker
connecting()
print("Connection successful")
#Client callback functions
client.on_connect = on_connect
client.on_message = on_message

#Define stream handler to detect firebase changes
def stream_handler(message):
    if(message["data"]==1):
        #Send message to broker to turn measuring on
        client.publish("IC.embedded/Pantheon/run","on")
        print("On")
    if(message["data"]==0):
        #Send message to broker to turn measuring off
        client.publish("IC.embedded/Pantheon/run","off")
        print("Off")

#Surveying changes in Firebase reading/value
my_stream = db.child("Reading/Value").stream(stream_handler)

#Sending data to cloud
def send_to_cloud(data):
    print("Data: ", data)
    results = db.child("Downforces").push(data)

#Updating data on cloud
def update_cloud(data, topic):
    results = db.child(topic).update(data)

#Infinite loop
client.loop_forever()
