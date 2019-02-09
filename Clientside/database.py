import pyrebase
import time
#import firebase_admin
#from firebase_admin import credentials

config = {
    "apiKey": "AIzaSyCAnkKBia6Jd8REycaDryC2AY5Jj_NQBpQ",
    "authDomain": "formula-1-7a0c8.firebaseapp.com",
    "databaseURL": "https://formula-1-7a0c8.firebaseio.com",
    "projectId": "formula-1-7a0c8",
    "storageBucket": "formula-1-7a0c8.appspot.com",
    "messagingSenderId": "708407712539"
}

#cred = credentials.Certificate("path/to/serviceAccountKey.json")
#firebase_admin.initialize_app(cred)

firebase = pyrebase.initialize_app(config)

auth = firebase.auth()

#email = input('Please enter your email\n')
#password = input('Please enter your password\n')

email = "lw2316@ic.ac.uk"
password = "123456"

#user = auth.create_user_with_email_and_password(email, password)

user = auth.sign_in_with_email_and_password(email, password)

#auth.get_account_info(user['idToken'])

db = firebase.database()

#db.child("Downforces").push({"Time:":"12:00","Downforce:":"8.555"})
#db.child("Downforces").child("Downforce:").update({"Downfore:":"13.5"})

# data to save
#lana = {"name": "Lana Kane", "agency": "Figgis Agency"}
#db.child("agents").child("Lana").set(lana, user['idToken'])
# Pass the user's idToken to the push method
def send_to_cloud(data):
    results = db.child("Downforces").push(data, user['idToken'])

#https://www.youtube.com/watch?v=aojoWWMN1r0
