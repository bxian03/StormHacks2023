from fastapi import APIRouter, Depends
from database import get_database_connection

router = APIRouter(
    prefix="/characters"
)

@router.get("/")
async def read_characters():
    return {"message": "hello characters"}

@router.post("/upload/{document_name}")
async def upload_characters(document_name: str, data: dict, db = Depends(get_database_connection)):
    doc_ref = db.collection('characters').document(document_name)
    # print(type(data))
    
    doc_ref.update(data)
    return {'message': f'Data imported successfully for document {document_name}!'}

@router.get("/upload/{document_name}")
async def upload_characters(document_name: str, db = Depends(get_database_connection)):
    doc_ref = db.collection('characters').document(document_name)
    print(doc_ref.get())
    # doc_ref.set(data)
    return {'message': f'Data imported successfully for document {document_name}!'}
