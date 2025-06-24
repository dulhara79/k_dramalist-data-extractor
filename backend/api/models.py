from pydantic import BaseModel
from typing import List, Dict, Optional, Union

class Actor(BaseModel):
    name: Optional[str] = None  # Allow name to be empty or None
    character: str
    role_type: Optional[str] = None

class Statistics(BaseModel):
    score: str
    ranked: str
    popularity: str
    watchers: str

class Drama(BaseModel):
    title: str
    year: Union[str, int]  # Allow both string and integer for year
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    original_network: Optional[str] = None
    aired_on: Optional[str] = None
    number_of_episodes: Optional[str] = None
    duration: Optional[str] = None
    content_rating: Optional[str] = None
    rating: Optional[float] = None  # Allow None for invalid ratings
    genres: List[str]
    tags: List[str]
    synopsis: str
    statistics: Statistics
    directors: List[str]
    screenwriters: List[str]
    main_actors: List[Actor]
    url: str

class DramaResponse(BaseModel):
    dramas: List[Drama]
    total: int
    page: int
    per_page: int

class SearchParams(BaseModel):
    query: Optional[str] = None
    genres: Optional[List[str]] = None
    year: Optional[str] = None
    rating: Optional[float] = None