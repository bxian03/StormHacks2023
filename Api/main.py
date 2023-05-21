from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random

# Firebase stuff
cred = credentials.Certificate("apiJSON\stormhacks2023-firebase-adminsdk-dbj0e-bb5d4d40b8.json")

firebase_admin.initialize_app(cred)
db = firestore.client()


collection_leaderboard = db.collection("Leaderboard") 
collection_questions = db.collection("questions")


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
# [(question, answer), (question, answer), (question, answer), (question, answer), (question, answer))]
@app.get("/questions/{questionDocument}/", status_code=200)
async def get_questions(questionDocument: str):
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
