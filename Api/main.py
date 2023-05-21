from fastapi import FastAPI, HTTPException, WebSocket, Depends
from fastapi.responses import JSONResponse, HTMLResponse
import random
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json
from routes import characters

# from database import get_database_connection

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(
    "./apiJSON/stormhacks2023-firebase-adminsdk-dbj0e-bb5d4d40b8.json"
)
firebase_admin.initialize_app(cred)
db = firestore.client()

collection_leaderboard = db.collection("Leaderboard")
collection_questions = db.collection("characters")


# FastAPI stuff
class Room:
    def __init__(self, sessionID, user1WebSocket, user2WebSocket, questionList):
        self.sessionID = sessionID
        self.user1Ready = False
        self.user2Ready = False
        self.user1WebSocket = user1WebSocket
        self.user2WebSocket = user2WebSocket
        self.questionList = questionList
        self.currentQuestion = 0


app = FastAPI()

app.include_router(characters.router)

rooms: List[Room] = []

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://localhost:3000",
    ],  # Set the list of allowed origins or use "*" for all origins
    allow_credentials=True,
    allow_methods=[
        "*"
    ],  # Set the list of allowed HTTP methods or use "*" for all methods
    allow_headers=[
        "*"
    ],  # Set the list of allowed HTTP headers or use "*" for all headers
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
        if doc_dict == None:
            doc_dict = {}
        if userID in doc_dict:
            doc_dict[userID] += points
        else:  # userID not in database
            doc_dict[userID] = points
        collection_leaderboard.document("Points").set(doc_dict)
        return JSONResponse(doc_dict, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")


# answer validation
def validate_answer(room: Room, answerKey: str, answer: str):
    try:
        # kanji-hiragana
        correctAnswers = room.questionList[room.currentQuestion - 1][answerKey]
        if answerKey == "hiragana":
            return answer in correctAnswers
        # hiragana-romaji
        elif answerKey == "romaji":
            return answer == correctAnswers
    except Exception as e:
        raise HTTPException(status_code=404, detail="Question not found")


# get questions
# returns 5 random questions from the document in the form of a list with 5 key value pairs
# @app.get("/questions/{questionDocument}", status_code=200)
def get_questions(questionDocument: str):
    try:
        doc_ref = collection_questions.document(questionDocument).get()
        doc_dict = doc_ref.to_dict()
        keys = list(doc_dict.keys())
        random.shuffle(keys)
        random_keys = keys[:5]
        result_list = []

        if questionDocument == "hiragana-romaji":
            keyName = "hiragana"
            pairName = "romaji"

        elif questionDocument == "kanji-hiragana":
            keyName = "kanji"
            pairName = "hiragana"

        for key in range(5):
            result_list.append(
                {keyName: random_keys[key], pairName: doc_dict[random_keys[key]]}
            )
        # tempList = [{"hiragana":"あ", "romaji":"a"},{"hiragana":"い", "romaji":"i"},
        #             {"hiragana":"う", "romaji":"u"},{"hiragana":"え", "romaji":"e"},
        #             {"hiragana":"お", "romaji":"o"}]
        # return tempList
        return result_list

    except Exception as e:
        raise HTTPException(status_code=404, detail="question not found")


# Websocket stuff
# {"action": "ready"} needs to be sent via ready button
# {"action": "answer", "answer": "a"} needs to be sent via answer button
# wscat -c ws://localhost:8000/ws/test/hiragana-romaji
# call this when you hit ready button
@app.websocket("/ws/{seshID}/{questionDocument}")
async def websocket_endpoint(seshID: str, questionDocument: str, websocket: WebSocket):
    await websocket.accept()

    # Check if room exists if so user1Flag = False and we are user2
    user1Flag = True
    for room in rooms:
        if room.sessionID == seshID:
            user1Flag = False
            currentRoom = room
            currentRoom.user2WebSocket = websocket

    if user1Flag == True:
        questionList = get_questions(questionDocument)
        rooms.append(Room(seshID, websocket, None, questionList))
        currentRoom = rooms[-1]

    if questionDocument == "hiragana-romaji":
        qKey = "hiragana"
        ansKey = "romaji"

    elif questionDocument == "kanji-hiragana":
        qKey = "kanji"
        ansKey = "hiragana"

    try:
        while True:
            # Wait for incoming messages from clients
            message = await websocket.receive_json()

            if message.get("action") == "ready":
                # Update readiness status for the client
                # ready_clients.append(websocket)
                # we are user1
                if user1Flag == True:
                    currentRoom.user1Ready = True
                else:  # we are user 2
                    currentRoom.user2Ready = True
                # Check if both clients are ready
                if currentRoom.user1Ready == True and currentRoom.user2Ready == True:
                    # Send a message to both clients to signal that they can proceed
                    # send questions
                    currentQ = currentRoom.questionList[currentRoom.currentQuestion][
                        qKey
                    ]
                    sendingResult = {"action": "start", "question": currentQ}
                    await currentRoom.user1WebSocket.send_json(sendingResult)
                    await currentRoom.user2WebSocket.send_json(sendingResult)
                    resetReady(currentRoom)
                    currentRoom.currentQuestion += 1
            elif message.get("action") == "answer":
                # Check if answer is correct
                if validate_answer(currentRoom, ansKey, message.get("answer")):
                    # user1 got the right answer
                    if user1Flag == True:
                        await currentRoom.user1WebSocket.send_json({"action": "win"})
                        await currentRoom.user2WebSocket.send_json({"action": "lose"})
                    # user2 got the right answer
                    elif user1Flag == False:
                        await currentRoom.user1WebSocket.send_json({"action": "lose"})
                        await currentRoom.user2WebSocket.send_json({"action": "win"})
                else:  # wrong answer
                    if user1Flag == True:
                        await currentRoom.user1WebSocket.send_json(
                            {"action": "incorrect"}
                        )
                    elif user1Flag == False:
                        await currentRoom.user2WebSocket.send_json(
                            {"action": "incorrect"}
                        )

            elif message.get("action") == "end":
                endRoom(currentRoom, seshID)

            elif message.get("action") == "winGame":
                # user1
                if user1Flag == True:
                    await currentRoom.user2WebSocket.send_json({"action": "loseGame"})
                # user2
                elif user1Flag == False:
                    await currentRoom.user1WebSocket.send_json({"action": "loseGame"})
                endRoom(currentRoom, seshID)
    except Exception as e:
        # Handle WebSocket connection errors, if any
        print(f"WebSocket Error: {e}")


# make a reset ready function
def resetReady(room: Room):
    room.user1Ready = False
    room.user2Ready = False


def endRoom(room: Room, seshID: str):
    for room in rooms:
        if room.sessionID == seshID:
            room.user1WebSocket.close()
            room.user2WebSocket.close()
            rooms.remove(room)
            break
