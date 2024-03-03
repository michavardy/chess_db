import logging
import logging.config
import random
import string
import time
import json
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError, exceptions 
from typing import Callable
from tinydb import TinyDB, Query
from pathlib import Path
from datetime import timedelta
import jwt
import uuid
import csv
from io import StringIO
from pydantic import BaseModel
from datetime import datetime
from typing import Union, Literal, Callable, Any, Optional
from exceptions import AuthorizationError, SchemeNotFoundError, InvalidTokenError, InvalidCredentialsError
from fastapi.staticfiles import StaticFiles
import uvicorn


app = FastAPI()
RESULTS = TinyDB('results.json')
USERS = TinyDB('users.json')
query = Query()

# Secret key for JWT encoding and decoding
SECRET_KEY = "your_secret_key"  # Change this to a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
# OAuth2PasswordBearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# setup loggers
logging.config.fileConfig('logging.conf', disable_existing_loggers=False)
logger = logging.getLogger(__name__)


# Add CORS middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can specify specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for JWT token
class Token(BaseModel):
    access_token: str
    token_type: str

# Pydantic model for authentication
class Authenticate(BaseModel):
    email: str
    password: str

# Pydantic model for user creation
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    avatar: str

# Pydantic model for user information in the token
class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    password: str
    avatar: str
    created: str #%yyyy/%mm/%dd
    verified: bool

class Record(BaseModel):
    id: str
    time_control: str
    created: str
    player_white: str
    player_black: str
    result: str


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    try:
        token = token.replace(',token_type','')
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is not None:
            token_data = TokenData(username=username)
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Token has expired", headers={"WWW-Authenticate": "Bearer"}
        )
    except exceptions.DecodeError:
        raise HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

async def retrieve_body(request: Request):
    body = await request.body()
    return json.loads(body)


def protected(func: Callable) -> Callable:
    async def wrapper(request: Request) -> Any:
        logger.info(f'protected route')
        if "Authorization" not in request._headers:
            raise AuthorizationError
        authorization_header = request._headers["Authorization"]
        scheme, token = authorization_header.split()
        if scheme.lower() != "bearer":
            raise SchemeNotFoundError
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            current_user = USERS.search(query.email == email)
            if not current_user:
                raise InvalidCredentialsError
            try:
                data = await retrieve_body(request)
            except:
                data=None
            if data:
                return await func(current_user[0], data)
            else:
                return await func(current_user[0])
        except PyJWTError:
            raise InvalidTokenError
       
    return wrapper

# Function to create a JWT token
def _create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/chess_db/add_users_from_csv")
@protected
def add_users_from_csv_str(current_user:TokenData, users_csv: str) -> None:
    for user in list(csv.DictReader(StringIO(users_csv), delimiter=',')):
        new_user = User(
            id = str(uuid.uuid4()),
            username=user['username'],
            email=user['email'],
            password=user['password'],
            avatar = user['avatar'],
            created=user['created'],
            verified=bool(user['verified']),
        )
        USERS.insert(new_user.__dict__)


# Endpoint to create a new user and return a token
@app.post("/chess_db/register_new_user")
async def register_user(user: UserCreate) -> dict:
    # Perform user registration logic here
    new_user = User(
        id=str(uuid.uuid4()),
        username=user.username,
        email=user.email,
        password=user.password,
        avatar=user.avatar,
        created=str(datetime.utcnow()),
        verified=False,
    )
    USERS.insert(new_user.__dict__)

    return {'message':'added new user'}


# Endpoint to authenticate and return a token
@app.post("/chess_db/authenticate", response_model=Token)
async def login_for_access_token(auth: Authenticate) -> dict:
    logger.info(f'attemping to authenticate: {auth}')
    user = USERS.search((query.email == auth.email) & (query.password == auth.password))
    if user:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = _create_access_token(data={"sub": auth.email}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"})

@app.post("/chess_db/getUserData")
@protected
async def get_user_data(current_user: User) -> dict:
    logger.info(f'get user data: {current_user}')
    return current_user

# Example protected endpoint that requires a valid token
@app.get("/chess_db/test")
@protected
async def protected_route(current_user: User,  *args, **kwargs) -> dict:
    return {"message": "This is a protected route", "current_user": current_user}

# return all results
@app.post("/chess_db/get_all_results")
@protected
async def get_all_results(current_user: User) -> list[Record]:
    logger.info(f'get all results: ')
    return RESULTS.all()

# return all results
@app.post("/chess_db/get_all_users")
@protected
async def get_all_users(current_user: User) -> list[User]:
    logger.info(f'get all users: ')
    return USERS.all()

# return all results
@app.post("/chess_db/add_result")
@protected
async def add_result(current_user: User,  record: dict) -> dict:
    # Get the current date and time in UTC
    now = datetime.utcnow()
    
    # Format the date in the desired format using strftime
    formatted_date = now.strftime("%Y-%m-%d")

    new_record = Record(
        id = str(uuid.uuid4()),
        time_control = record['time_control'],
        created = formatted_date,
        player_white = record['white_player'],
        player_black = record['black_player'],
        result = record['result']
    )
    RESULTS.insert(new_record.__dict__)
    #if record:
    #    RESULTS.insert(record.dict())
    return {"message": "Result added successfully"}

class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 404:
            response = await super().get_response('.', scope)
        return response

# Mount the static files directory (built React files) to the URL path "/chess_db/"
app.mount("/chess_db/", SPAStaticFiles(directory="/app/frontend/build", html=True), name="static")

def start():
    uvicorn.run("backend.main:app", host="0.0.0.0", port=80, reload=True)

