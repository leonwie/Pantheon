import paho.mqtt.client as mqtt
import time
import pyrebase
import sys

#wing info
WINGSPAN = 10
CHORD = 10
LIFTCOEFFICIENT = 10

config = {
    "apiKey": "AIzaSyCAnkKBia6Jd8REycaDryC2AY5Jj_NQBpQ",
    "authDomain": "formula-1-7a0c8.firebaseapp.com",
    "databaseURL": "https://formula-1-7a0c8.firebaseio.com",
    "projectId": "formula-1-7a0c8",
    "storageBucket": "formula-1-7a0c8.appspot.com",
    "messagingSenderId": "708407712539"
}

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
        sensordata=message.payload
        sensordata_dec=sensordata.decode("utf-8")
        sensorvalues=sensordata_dec.split(",")
        temperature = float(sensorvalues[0])
        airpressure = float(sensorvalues[1])
        airflow = float(sensorvalues[2])
    #print("Sensordata: ")
    tempk = temperature + 273.15
    airdensity = tempk / (287.05 * airpressure * 100)
    downforce = 0.5 * WINGSPAN * CHORD * LIFTCOEFFICIENT * airdensity * airflow*100
    downforce_add = {
    "Time:":time.ctime(),
    "Downforce":str(round(downforce,3))
    }
    downforce_update = {
    "Downforce":str(round(downforce,3))
    }
    airpressure_update = {
    "Pressure":str(round(airpressure,3))
    }
    temperature_update = {
    "Temperature":str(round(temperature,3))
    }
    print("Sending to cloud")
    #send the data to the cloud
    send_to_cloud(downforce_add)
    update_cloud(downforce_update, "Downforce")
    update_cloud(airpressure_update, "Pressure")
    update_cloud(temperature_update, "Temperature")


def connecting():
	try:
		client.connect("146.169.222.168", port=1883)
	except:
		print("Error connection unsuccessful")
		connecting()

#initialize the client
client = mqtt.Client()
connecting()
print("Connection successful")
client.on_connect = on_connect
client.on_message = on_message

client.subscribe("IC.embedded/Pantheon/#")

def stream_handler(message):
    if(message["data"]==1):
        client.publish("IC.embedded/Pantheon/run","on")
        print("On")
    if(message["data"]==0):
        client.publish("IC.embedded/Pantheon/run","off")
        print("Off")

my_stream = db.child("Reading/Value").stream(stream_handler)

def send_to_cloud(data):
    print("Data: ", data)
    results = db.child("Downforces").push(data)
def update_cloud(data, topic):
    results = db.child(topic).update(data)

client.loop_forever()

#endless loop
#while True:
#    client.loop()
#    time.sleep(1)
