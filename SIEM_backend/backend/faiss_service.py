import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import logging

# Configure basic logger to the console
logger = logging.getLogger(__name__)

# This class represents the semantic similarity checker
class FaissService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        # singleton: only one instance
        if cls._instance is None:
            cls._instance = super(FaissService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # Load embedding model (CPU)
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

        # Set vector dimension
        self.dim = 384  # MiniLM output dimension

        # Initialize FAISS index
        self.index_path = "faiss_index.index"
        self.index = faiss.IndexFlatIP(self.dim)

        # If you want persistent IDs
        self.index = faiss.IndexIDMap(self.index)

        # Load existing index if it exists
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            logger.info("FAISS index loaded.")
        else:
            logger.info("FAISS index created from scratch.")

        # Keep track of IDs
        self.next_id = 0 if self.index.ntotal == 0 else self.index.ntotal

    # Add new articles
    def add_article(self, text, article_id=None):
        vec = self.model.encode(text)
        vec = np.array([vec], dtype="float32")
        if article_id is None:
            article_id = self.next_id
            self.next_id += 1
        self.index.add_with_ids(vec, np.array([article_id]))
        return article_id

    # Query duplicates
    def is_duplicate(self, text, threshold=0.85, k=1):
        vec = self.model.encode(text)
        vec = np.array([vec], dtype="float32")
        if self.index.ntotal == 0:
            return False
        D, I = self.index.search(vec, k)
        similarity = 1 - D[0][0]  # inner product => cosine similarity
        return similarity >= threshold

    # Save index
    def save_index(self):
        faiss.write_index(self.index, self.index_path)
        print("FAISS index saved.")

# singleton instance
faiss_service = FaissService()