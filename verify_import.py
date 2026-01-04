
import sys
import os

# Create a mock 'app' package context if needed, but since we are in the root, it should work.
try:
    print("Attempting to import app.routers.exports...")
    from app.routers import exports
    print("Successfully imported app.routers.exports")

    print("Attempting to import app.main...")
    from app import main
    print("Successfully imported app.main")
except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
