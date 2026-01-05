"""
Notifications Router - API endpoints for file-based notifications (JSON)
Bypasses DB/ORM to ensure functionality without schema changes.
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import datetime
import logging

# --- Configuration ---
DATA_FILE = "data/notifications.json"
router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

# Ensure data directory exists
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

# Initialize file if not exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

# --- Models ---
class Notification(BaseModel):
    id: int
    user_id: int = 1
    type: str = "system"
    priority: str = "low"
    title: str
    message: str
    link: Optional[str] = None
    metadata: Optional[dict] = {}
    is_read: bool = False
    created_at: str
    expires_at: Optional[str] = None

class NotificationList(BaseModel):
    notifications: List[Notification]
    total: int
    unread_count: int

class UnreadCountResponse(BaseModel):
    count: int

# --- Helpers ---
def load_data():
    if not os.path.exists(DATA_FILE): return []
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)


def create_notification_internal(title: str, message: str, type: str = "system", priority: str = "low", link: str = None, metadata: dict = None):
    """
    Internal function to be called by other modules (like licitaciones_raw)
    """
    notifs = load_data()
    
    new_id = 1
    if notifs:
        new_id = max(n.get('id', 0) for n in notifs) + 1
        
    new_notif = {
        "id": new_id,
        "user_id": 1, 
        "type": type,
        "priority": priority,
        "title": title,
        "message": message,
        "link": link,
        "metadata": metadata or {},  # Store metadata
        "is_read": False,
        "created_at": datetime.datetime.now().replace(microsecond=0).isoformat(),
        "expires_at": None
    }
    
    # Prepend to list
    notifs.insert(0, new_notif)
    if len(notifs) > 500: notifs = notifs[:500]
    save_data(notifs)
    return new_notif

# --- Endpoints ---

@router.get("/", response_model=NotificationList)
def get_notifications(
    unread_only: bool = False,
    limit: int = 50,
    offset: int = 0
):
    all_notifs = load_data()
    
    # Filter
    filtered = all_notifs
    if unread_only:
        filtered = [n for n in all_notifs if not n.get('is_read')]
        
    # Stats
    total = len(filtered)
    unread_count = len([n for n in all_notifs if not n.get('is_read')])
    
    # Pagination
    paginated = filtered[offset : offset + limit]
    
    return {
        "notifications": paginated,
        "total": total,
        "unread_count": unread_count
    }

@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count():
    all_notifs = load_data()
    count = len([n for n in all_notifs if not n.get('is_read')])
    return {"count": count}

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int):
    notifs = load_data()
    found = False
    for n in notifs:
        if n.get('id') == notification_id:
            n['is_read'] = True
            found = True
            break
            
    if found:
        save_data(notifs)
        return {"success": True}
    raise HTTPException(status_code=404, detail="Notification not found")

@router.put("/read-all")
def mark_all_as_read():
    notifs = load_data()
    count = 0
    for n in notifs:
        if not n.get('is_read'):
            n['is_read'] = True
            count += 1
            
    save_data(notifs)
    return {"message": f"{count} notifications marked as read"}

@router.delete("/{notification_id}")
def delete_notification(notification_id: int):
    notifs = load_data()
    initial_len = len(notifs)
    notifs = [n for n in notifs if n.get('id') != notification_id]
    
    if len(notifs) < initial_len:
        save_data(notifs)
        return {"success": True}
        
    raise HTTPException(status_code=404, detail="Notification not found")
