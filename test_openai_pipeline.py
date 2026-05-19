import requests
import time
import os
import json

API_URL = "http://localhost:8000/api/v1"
FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_doc.txt")

def test_upload_and_pipeline():
    print(f"Uploading {FILE_PATH}...")
    with open(FILE_PATH, "rb") as f:
        files = {"files": (os.path.basename(FILE_PATH), f, "text/plain")}
        res = requests.post(f"{API_URL}/upload", files=files)
    
    if res.status_code != 200:
        print(f"Failed to upload: {res.text}")
        return
    
    data = res.json()
    project_id = data["project_id"]
    print(f"Upload successful. Project ID: {project_id}")
    print("Polling dashboard status...")

    while True:
        dash_res = requests.get(f"{API_URL}/dashboard/{project_id}")
        if dash_res.status_code != 200:
            print(f"Failed to get dashboard: {dash_res.text}")
            break
            
        dash_data = dash_res.json()
        status = dash_data.get("status")
        
        if status == "completed":
            print("\nPipeline completed successfully!")
            print(json.dumps(dash_data, indent=2))
            
            # Test chat endpoint
            print("\nTesting chat endpoint...")
            chat_res = requests.post(f"{API_URL}/chat", json={
                "project_id": project_id,
                "session_id": "test-session",
                "question": "What is the main requirement?"
            })
            if chat_res.status_code == 200:
                print("\nChat response:")
                print(chat_res.json())
            else:
                print(f"Chat failed: {chat_res.text}")
            break
        elif status == "failed":
            print(f"\nPipeline failed: {dash_data.get('error_message')}")
            break
        else:
            print(f"Status: {status}... waiting 3 seconds.")
            time.sleep(3)

if __name__ == "__main__":
    test_upload_and_pipeline()
