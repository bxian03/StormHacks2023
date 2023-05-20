from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Firebase stuff
cred = credentials.Certificate("apiJSON\stormhacks2023-firebase-adminsdk-dbj0e-bb5d4d40b8.json")

firebase_admin.initialize_app(cred)
db = firestore.client()


collection_leaderboard = db.collection("games")


# FastAPI stuff
app = FastAPI()


# to run server on terminal 
# python -m uvicorn main:app --reload 
# http://127.0.0.1:8000



@app.get("/")
async def root():
    return {"message": "Hello World"}


# get player score
@app.get("/Leaderboard/Points/{userID}", status_code=200)
async def get_player_score(userID: str):
    try:
        doc_ref = collection_leaderboard.document("Points").get()
        doc_dict = doc_ref.to_dict()
        return JSONResponse(doc_dict[userID], status_code=200)
        
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")
        

# add to player score
@app.post("/Leaderboard/Points/{userID}/{points}", status_code=200)
async def add_player_score(userID: str, points: int):
    try:
        doc = collection_leaderboard.document("Points").get()
        doc_dict = doc.to_dict()
        print(doc_dict)
        if (doc_dict == None):
            doc_dict = {}
        if userID in doc_dict:
            doc_dict[userID] += points
        else: # userID not in database
            doc_dict[userID] = points
        print(doc_dict)
        collection_leaderboard.document("Points").set(doc_dict)
        return JSONResponse(doc_dict, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")