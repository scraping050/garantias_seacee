import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

try:
    print("Attempting to import app.main...")
    from app.main import app
    print("SUCCESS: app.main imported correctly.")
except Exception as e:
    import traceback
    print("ERROR: Failed to import app.main")
    traceback.print_exc()
