from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import Optional, List
from models import Drama, DramaResponse, SearchParams
import os
import ast

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV data
DATA_PATH = "../data/drama_dataset.csv"
df = None

def load_data():
    global df
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        # Convert list-like and dict-like columns from strings to Python objects
        for col in ['genres', 'tags', 'directors', 'screenwriters', 'main_actors', 'statistics']:
            df[col] = df[col].apply(lambda x: ast.literal_eval(x) if pd.notna(x) else [])
        # Convert year to string
        df['year'] = df['year'].astype(str)
        # Clean rating column: convert to float, handle invalid values by setting to None
        df['rating'] = pd.to_numeric(df['rating'], errors='coerce').astype('float64')
    else:
        df = pd.DataFrame()

load_data()

@app.get("/api/dramas", response_model=DramaResponse)
async def get_dramas(page: int = 1, per_page: int = 20):
    start = (page - 1) * per_page
    end = start + per_page
    dramas = df.iloc[start:end].to_dict(orient="records")
    return DramaResponse(
        dramas=dramas,
        total=len(df),
        page=page,
        per_page=per_page
    )

@app.get("/api/dramas/{title}")
async def get_drama(title: str):
    drama = df[df['title'] == title].to_dict(orient="records")
    if drama:
        return drama[0]
    return {"error": "Drama not found"}

@app.get("/api/search", response_model=DramaResponse)
async def search_dramas(
    query: Optional[str] = None,
    genres: Optional[List[str]] = Query(None),
    year: Optional[str] = None,
    rating: Optional[float] = None,
    page: int = 1,
    per_page: int = 20
):
    filtered_df = df
    if query:
        filtered_df = filtered_df[filtered_df['title'].str.contains(query, case=False, na=False)]
    if genres:
        filtered_df = filtered_df[filtered_df['genres'].apply(lambda x: any(g in x for g in genres))]
    if year:
        filtered_df = filtered_df[filtered_df['year'] == year]
    if rating:
        filtered_df = filtered_df[filtered_df['rating'].notna() & (filtered_df['rating'] >= rating)]
    
    start = (page - 1) * per_page
    end = start + per_page
    dramas = filtered_df.iloc[start:end].to_dict(orient="records")
    return DramaResponse(
        dramas=dramas,
        total=len(filtered_df),
        page=page,
        per_page=per_page
    )

@app.get("/api/genres")
async def get_genres():
    genres = set()
    for genre_list in df['genres']:
        genres.update(genre_list)
    return sorted(list(genres))

@app.get("/api/stats")
async def get_stats():
    return {
        "total_dramas": len(df),
        "average_rating": df['rating'].mean() if not df.empty and df['rating'].notna().any() else 0,
        "most_common_genres": df['genres'].explode().value_counts().head(5).to_dict(),
        "years_range": {"min": df['year'].min(), "max": df['year'].max()} if not df.empty else {}
    }