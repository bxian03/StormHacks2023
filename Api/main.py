from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Firebase stuff
cred = credentials.Certificate("apiJSON/stormhacks-api-cf5d066f8e25.json")

firebase_admin.initialize_app(cred)
db = firestore.client()


collection_games = db.collection('games')


# FastAPI stuff
app = FastAPI()


# to run server on terminal 
# python -m uvicorn main:app --reload 
# http://127.0.0.1:8000


# Example
# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# @app.get("/characters")
# async def get_chars():
#     # return the characters
#     return 

# returns a game
@app.get("/game/{seshID}")
async def get_game(seshID):
    try:
        doc = collection_games.document(seshID).get()
        return JSONResponse(content=doc.to_dict(), status_code=200)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Game not found")
    
# give a player a point in the current game
# do type annotations later
@app.post("/game/{seshID}/{userID}", status_code=200)
async def give_point(seshID,userID):
    try:
        document = collection_games.document(seshID)
        document.update({userID: firestore.Increment(1)})

    except Exception as e:
        print("error lol")
        raise HTTPException(status_code=404, detail="Item ID cannot be negative")