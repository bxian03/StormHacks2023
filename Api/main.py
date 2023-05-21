from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.responses import JSONResponse, HTMLResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from routes import characters

# Firebase stuff
cred = credentials.Certificate("./apiJSON/stormhacks2023-firebase-adminsdk-dbj0e-bb5d4d40b8.json")

firebase_admin.initialize_app(cred)
db = firestore.client()


collection_leaderboard = db.collection("Leaderboard") 
collection_questions = db.collection("characters")


# FastAPI stuff
class Room: 
    def __init__(self,sessionID,user1WebSocket,user2WebSocket):
        self.sessionID = sessionID
        self.user1Ready = False
        self.user2Ready = False
        self.user1WebSocket = user1WebSocket
        self.user2WebSocket = user2WebSocket

app = FastAPI()

app.include_router(characters.router)

# connected_clients: List[WebSocket] = []
# ready_clients: List[WebSocket] = []
rooms: List[Room] = []

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Set the list of allowed origins or use "*" for all origins
    allow_credentials=True,
    allow_methods=["*"],  # Set the list of allowed HTTP methods or use "*" for all methods
    allow_headers=["*"],  # Set the list of allowed HTTP headers or use "*" for all headers
)

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
        if (doc_dict == None):
            doc_dict = {}
        if userID in doc_dict:
            doc_dict[userID] += points
        else: # userID not in database
            doc_dict[userID] = points
        collection_leaderboard.document("Points").set(doc_dict)
        return JSONResponse(doc_dict, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")

# answer validation  
# url should be /questions/{questionDocument}/{questionKey}/{answer}
# questionDocument is the document name in the questions collection
# questionKey is the key of the question in the document
# supports hiragana katakana json files
# answer is the answer to the question
@app.get("/questions/{questionDocument}/{questionKey}/{answer}", status_code=200)
async def validate_answer(questionDocument: str, questionKey: str, answer: str): 
    try:
        answer = answer.lower()
        doc_ref = collection_leaderboard.document(questionDocument).get()
        doc_dict = doc_ref.to_dict()
        # assumption dict is not empty
        if (doc_dict[questionKey].equals(answer)):
            return JSONResponse(True, status_code=200)
        else:
            return JSONResponse(False, status_code=200)
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Question not found")
    
# get questions
# returns 5 random questions from the document in the form of a list with 5 key value pairs
@app.get("/questions/{questionDocument}/", status_code=200)
async def get_questions(questionDocument: str):
    try:
        doc_ref = collection_questions.document(questionDocument).get()
        doc_dict = doc_ref.to_dict()
        keys = list(doc_dict.keys())    
        random.shuffle(keys)
        random_keys = keys[:5]
        result_list = []
        for key in range(5):
            result_list.append({"hiragana": random_keys[key], "romaji": doc_dict[random_keys[key]]})
        return JSONResponse(result_list, status_code=200)
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Question not found")

# Websocket stuff
# {"action": "ready"} needs to be sent via ready button
# call this when you hit ready button
@app.websocket("/ws/{seshID}/{userID}")
async def websocket_endpoint(seshID: str, userID: str, websocket: WebSocket):
    await websocket.accept()

    # Check if room exists if so user1Flag = False and we are user2
    user1Flag = True
    for room in rooms:
        if room.sessionID == seshID:
            user1Flag = False
            currentRoom = room
            currentRoom.user2WebSocket = websocket

    if (user1Flag == True):
        rooms.append(Room(seshID,websocket,None))
        currentRoom = rooms[-1]
    # Add client to the connected clients list
    # connected_clients.append(websocket)

    try:
        while True:
            # Wait for incoming messages from clients
            message = await websocket.receive_json()

            if message.get("action") == "ready":
                # Update readiness status for the client
                # ready_clients.append(websocket)
                # we are user1
                if (user1Flag == True):
                    currentRoom.user1Ready = True
                else: # we are user 2
                    currentRoom.user2Ready = True
                # Check if both clients are ready
                if currentRoom.user1Ready == True and currentRoom.user2Ready == True:
                # if len(ready_clients) == 2:
                    # Send a message to both clients to signal that they can proceed
                    await currentRoom.user1WebSocket.send_json({"action": "start"})
                    await currentRoom.user2WebSocket.send_json({"action": "start"})
                    await currentRoom.user1WebSocket.close()
                    await currentRoom.user2WebSocket.close()
                    # remove room from rooms list
                    rooms.remove(currentRoom)
                    # for client in ready_clients:
                    #     await client.send_json({"action": "start"})
                    # # after sending the send_json, close both websockets and clear the list
                    # for client in ready_clients:
                    #     await client.close()
                    break 
    except Exception as e:
        # Handle WebSocket connection errors, if any
        print(f"WebSocket Error: {e}")

