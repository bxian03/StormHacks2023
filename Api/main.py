from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
import random

from routes import characters
from database import get_database_connection

def get_collection_leaderboard(db = Depends(get_database_connection)):
    return db.collection("Leaderboard")

def get_collection_questions(db = Depends(get_database_connection)):
    return db.collection("characters")

# FastAPI stuff
class Room: 
    def __init__(self,sessionID,user1WebSocket,user2WebSocket):
        self.sessionID = sessionID
        self.user1Ready = False
        self.user2Ready = False
        self.user1WebSocket = user1WebSocket
        self.user2WebSocket = user2WebSocket

app = FastAPI(dependencies=[Depends(get_database_connection), Depends(get_collection_leaderboard), Depends(get_collection_questions)])

app.include_router(characters.router)

# to run server on terminal 
# python -m uvicorn main:app --reload 
# http://127.0.0.1:8000



@app.get("/")
async def root():
    return {"message": "Hello World"}


# get player score
@app.get("/Leaderboard/Points/{userID}", status_code=200)
async def get_player_score(userID: str, collection_leaderboard = Depends(get_collection_leaderboard)):
    try:
        doc_ref = collection_leaderboard.document("Points").get()
        doc_dict = doc_ref.to_dict()
        return JSONResponse(doc_dict[userID], status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="User not found")
        

# add to player score
@app.post("/Leaderboard/Points/{userID}/{points}", status_code=200)
async def add_player_score(userID: str, points: int, collection_leaderboard = Depends(get_collection_leaderboard)):
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
async def validate_answer(questionDocument: str, questionKey: str, answer: str, collection_leaderboard = Depends(get_collection_leaderboard)): 
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
# [(question, answer), (question, answer), (question, answer), (question, answer), (question, answer))]
@app.get("/questions/{questionDocument}/", status_code=200)
async def get_questions(questionDocument: str, collection_questions = Depends(get_collection_questions)):
    try:
        doc_ref = collection_questions.document(questionDocument).get()
        doc_dict = doc_ref.to_dict()
        keys = list(doc_dict.keys())    
        random.shuffle(keys)
        random_keys = keys[:5]
        random_pairs = [(key, doc_dict[key]) for key in random_keys]
        return JSONResponse(random_pairs, status_code=200)
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Question not found")
