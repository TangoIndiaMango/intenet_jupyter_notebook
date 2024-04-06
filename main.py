from fastapi import FastAPI
from pydantic import BaseModel
import pickle


# Load the serialized models
with open('naive_bayes_classifier.pkl', 'rb') as f:
    naive_bayes_classifier = pickle.load(f)

with open('tfidf_vectorizer.pkl', 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

app = FastAPI()

# Define request body schema
class Query(BaseModel):
    query: str

# Intent classification endpoint
@app.post("/classify_intent")
def classify_intent(query: Query):
    query_tfidf = tfidf_vectorizer.transform([query.query])
    intent = naive_bayes_classifier.predict(query_tfidf)[0]
    return {"intent": intent}
