import paho.mqtt.client as mqtt
import time
import pyrebase

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
    print("Hello")
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("IC.embedded/Pantheon/#")
    client.publish("IC.embedded/Pantheon/test","Connected to computer2")

#If a message is received
def on_message(client, userdata, message):
    print("Received message on computer ",message.payload)
    print("Typeof",type(message.payload))
    print("Message topic: ",message.topic)
	#Check for message topic
    if(message.topic=="IC.embedded/Pantheon/Measurement/Airflow"):
        send=str(message.payload)
		#create dataobject
        data1 = {
        "Time:":time.ctime(),
        "Downforce":send[2:len(send)-1]
		}
        data2 = {
        "Downforce":send[2:len(send)-1]
        }
        print(data1)
		#send the data to the cloud
        send_to_cloud(data1)
        update_cloud(data2)
    if(message.topic=="IC.embedded/Pantheon/Measurement/Airpressure"):
        print("Airpressure")


def connecting():
	try:
		client.connect("test.mosquitto.org", port=1883)
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
    results = db.child("Downforces").push(data)
def update_cloud(data):
    results = db.child("Downforce").update(data)
client.loop_forever()

#endless loop
#while True:
#    client.loop()
#    time.sleep(1)
