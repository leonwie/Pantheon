import paho.mqtt.client as mqtt
import time

def on_message(client, userdata, message):
	print("Received message: {} on topic {}" .format(time.clock_gettime(),time.clock_gettime()))

client = mqtt.Client()
client.connect("test.mosquitto.org",port=1883)
#client.publish("IC.embedded/Pantheon/test","Connected to raspberry")

#mqtt.error_string(RETURN_CODE)

client.on_message = on_message

client.subscribe("IC.embedded/Pantheon/#")

while True:
    client.loop()
    time.sleep(1)
