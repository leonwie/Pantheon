# Live formula 1 downforce tracking

## Four main files:
* mqtt_subscriber.py  -- Run on the Raspberry pi
* Clientside\main.py -- Run on any laptop or phone
* App/PantheonDown -- Run on iOS simulator using XCode
* livegraph\app.js -- Run on nodejs or access on heroku: https://desolate-brook-74012.herokuapp.com/?fbclid=IwAR0D4lOiHnYv2-wT4iuwhscy0E0LoMmwT2zaIWh53WWcjRW9edovi5sJvgM

## Explaining on the raspberry pi:

The raspberry pi file connects to the test.mosquitto.org broker. It reads data from the raspberry pi from the 2 respective sensors using the i2c_read.py file.

## Livegraph

The livegraph is written in javascript and html and can be run by accessing the app.js file with node js or using heroku: https://desolate-brook-74012.herokuapp.com/?fbclid=IwAR0D4lOiHnYv2-wT4iuwhscy0E0LoMmwT2zaIWh53WWcjRW9edovi5sJvgM

The script pulls data from the firebase database and sends it via socket.io to the embedded java script.

## MQTT Broker
To overview the mqtt broker send and receive messages go on:

http://www.hivemq.com/demos/websocket-client/

Host: "test.mosquitto.org"
Port:"8080"

Press connect

Subscribe to topic: "IC.embedded/Pantheon/#"

You are good to go.

## App
This application has been built using React Native - allowing it to be run on any iOS or Android Device. By expanding on an open source template this application adds firebase's realtime database to fetch data from the sensor and display it to the user. Screenshots can be seen below:- 

![alt text](https://github.com/leonwie/Pantheon/blob/master/readmeimages/Data.png)
![alt text](https://github.com/leonwie/Pantheon/blob/master/readmeimages/Drivers.png)
![alt text](https://github.com/leonwie/Pantheon/blob/master/readmeimages/Teams.png)
![alt text](https://github.com/leonwie/Pantheon/blob/master/readmeimages/nav.png)
![alt text](https://github.com/leonwie/Pantheon/blob/master/readmeimages/Cal.png)


