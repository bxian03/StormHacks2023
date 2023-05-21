import os, json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


# Initializing Firebase Admin SDK
# cred = credentials.Certificate('')
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# Iterate through JSON files in the directory
directory = 'backend/data_json'
for filename in os.listdir(directory):
    if filename.endswith('.json'):
        file_path = os.path.join(directory, filename)
        
        # Read the JSON file
        with open(file_path) as json_file:
            json_data = json.loads(json_file)
            
            for key in json_data.keys():
                values = json_data[key]
                for item in values:
                    print(f"{key}: {item}\n")

            
            # Upload the data to Firestore
            # doc_ref = db.collection('your_collection_name').add(data_to_upload)