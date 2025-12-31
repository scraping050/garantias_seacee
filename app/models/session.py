from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("usuarios.id"))
    id_corporativo = Column(String(255))          # ID corporativo del usuario
    token_hash = Column(String(255), index=True)  # Para identificar/revocar el token
    ip_address = Column(String(45))               # IPv4 o IPv6
    user_agent = Column(String(255))              # "Chrome en Windows", etc.
    device_type = Column(String(50))              # "Desktop", "Mobile"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    last_active = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates="sessions")
