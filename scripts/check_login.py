import requests
import json
import sys

def test_login(url, name):
    print(f"Testing {name} at {url}...")
    headers = {'Content-Type': 'application/json'}
    data = {"id_corporativo": "test_user", "password": "wrong_password"}
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=5)
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response Body (JSON): {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response Body (Text): {response.text[:200]}...")
            
        if response.status_code in [401, 400, 422]:
            print("Server is REACHABLE and handling logic (even if 401).")
        elif response.status_code == 200:
            print("Server is REACHABLE and login success (unexpected for dummy creds).")
        else:
            print(f"Server returned status {response.status_code}.")
            
    except requests.exceptions.ConnectionError:
        print(f"CONNECTION ERROR: Could not connect to {url}")
    except Exception as e:
        print(f"ERROR: {e}")
    print("-" * 30)

if __name__ == "__main__":
    # Test Backend Directly
    test_login("https://back.mcqs-jcq.cloud/api/auth/login", "Direct Backend (8000)")
    
    # Test Frontend Proxy
    test_login("https://mcqs-jcq.cloud/api/auth/login", "Frontend Proxy (3000)")
