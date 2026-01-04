import requests
import json

url = "http://localhost:8000/api/export"
payload = {
    "format": "csv",
    "ids": [],
    "all_matches": True,
    "filters": {}
}
try:
    print(f"Sending POST to {url}...")
    r = requests.post(url, json=payload, stream=True)
    print(f"Status Code: {r.status_code}")
    print(f"Headers: {r.headers}")
    if r.status_code == 200:
        print("Success! Content length:", len(r.content))
    else:
        print("Error Response:", r.text)
except Exception as e:
    print(f"Request failed: {e}")
