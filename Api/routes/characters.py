from fastapi import APIRouter

router = APIRouter(
    prefix="/characters"
)

@router.get("/")
async def read_characters():
    return {"message": "hello characters"}