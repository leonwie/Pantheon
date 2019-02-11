import paho.mqtt.client as mqtt
import time
import pyrebase
import time

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

#If a message is received
def on_message(client, userdata, message):
	print("Received message on computer ",message.payload)
	print("Typeof",type(message.payload))
	print("Message topic: ",message.topic)
	#Check for message topic
	if(message.topic=="IC.embedded/Pantheon/Measurement"):
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

#initialize the client
client = mqtt.Client()

#client.tls_set(ca_certs="mosquitto.org.crt", certfile="client.crt",keyfile="client.key")
client.connect("test.mosquitto.org",port=1883)

client.publish("IC.embedded/Pantheon/test","Connected to computer")

#mqtt.error_string(MSG_INFO.rc) #MSG_INFO is result of publish()

client.on_message = on_message

client.subscribe("IC.embedded/Pantheon/#")

def stream_handler(message):
	if(message[data]=='On'):
		client.publish("IC.embedded/Pantheon/run","On")
	if(message[data]=='Off'):
		client.publish("IC.embedded/Pantheon/run","Off")

my_stream = db.child("Reading").stream(stream_handler)

def send_to_cloud(data):
    results = db.child("Downforces").push(data)
def update_cloud(data):
    results = db.child("Downforce").update(data)


#endless loop
while True:
	client.loop()
	time.sleep(2)
