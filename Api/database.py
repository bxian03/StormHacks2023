import firebase_admin
from firebase_admin import credentials, firestore, db

def get_database_connection():

    if not firebase_admin._apps:
        cred = credentials.Certificate("./apiJSON/stormhacks2023-firebase-adminsdk-dbj0e-bb5d4d40b8.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()

    try:
        yield db
    finally:
        pass



# def get_collection_leaderboard():
#     db = get_database_connection()
#     print(db)
#     collection_leaderboard = db.collection("Leaderboard")
#     try:
#         yield collection_leaderboard
#     finally:
#         pass
