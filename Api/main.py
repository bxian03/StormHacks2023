from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from routes import characters

# Firebase stuff
cred = credentials.Certificate("./apiJSON/stormhacks2023-firebase-adminsdk-dbj0e-bb5d4d40b8.json")

firebase_admin.initialize_app(cred)
db = firestore.client()


collection_games = db.collection("games")


# FastAPI stuff
app = FastAPI()

app.include_router(characters.router)

# to run server on terminal 
# python -m uvicorn main:app --reload 
# http://127.0.0.1:8000



@app.get("/")
async def root():
    return {"message": "Hello World"}

# returns a game
@app.get("/games/{seshID}")
async def get_game(seshID: str):
    try:
        doc = collection_games.document(seshID).get()
        return JSONResponse(content=doc.to_dict(), status_code=200)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Game not found")
    
# give a player a point in the current game
@app.post("/games/{seshID}/{userID}", status_code=200)
async def give_point(seshID: str ,userID:str):
    try:
        document = collection_games.document(seshID)
        document.update({userID: firestore.Increment(1)})
    except Exception as e:
        print("error lol")
        raise HTTPException(status_code=404, detail="Item ID not found")