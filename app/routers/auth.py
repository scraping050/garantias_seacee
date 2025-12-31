"""
Authentication router for user login, registration, and PIN verification.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
import hashlib
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User, UserRole
from app.models.session import UserSession
from app.auth_schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    PinVerification,
    PinVerificationResponse
)
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_admin_pin
)
from app.utils.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Register a new user (admin only).
    Only administrators can create new user accounts.
    """
    # Check if id_corporativo already exists
    existing_user = db.query(User).filter(User.id_corporativo == user_data.id_corporativo).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID Corporativo ya está registrado"
        )
    
    # Check if email already exists
    if user_data.email:
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email ya está registrado"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        id_corporativo=user_data.id_corporativo,
        nombre=user_data.nombre,
        email=user_data.email,
        password_hash=hashed_password,
        perfil=user_data.perfil,
        job_title=user_data.job_title,
        activo=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user



@router.post("/login", response_model=Token)
def login(
    credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Login with id_corporativo and password.
    Returns JWT access token.
    """
    # Find user by id_corporativo
    user = db.query(User).filter(User.id_corporativo == credentials.id_corporativo).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.id_corporativo, "role": user.perfil.value if hasattr(user.perfil, 'value') else user.perfil}
    )
    
    # Create User Session
    user_agent = request.headers.get('user-agent')
    ip_address = request.client.host
    
    # Get next available ID (since AUTO_INCREMENT is not set in DB)
    max_id_result = db.query(func.max(UserSession.id)).scalar()
    next_id = (max_id_result or 0) + 1
    
    new_session = UserSession(
        id=next_id,  # Manually set ID
        user_id=user.id,
        token_hash=hashlib.sha256(access_token.encode()).hexdigest(), # Store token hash
        ip_address=ip_address,
        user_agent=user_agent,
        device_type="Desktop" if "Windows" in str(user_agent) or "Macintosh" in str(user_agent) else "Mobile",
        is_active=True
    )
    db.add(new_session)
    db.commit()
    
    # Convert perfil to string properly
    perfil_value = str(user.perfil) if user.perfil else "COLABORADOR"
    
    # Debug logging
    print(f"\n=== DEBUG LOGIN ===")
    print(f"User: {user.id_corporativo}")
    print(f"Perfil from DB: {user.perfil} (type: {type(user.perfil)})")
    print(f"Perfil converted: {perfil_value}")
    print(f"Job Title from DB: {user.job_title}")
    
    # Create UserResponse object from the User model
    user_response = UserResponse(
        id=user.id,
        id_corporativo=user.id_corporativo,
        nombre=user.nombre,
        email=user.email,
        perfil=perfil_value,
        activo=user.activo,
        job_title=user.job_title,
        avatar_url=user.avatar_url
    )
    
    print(f"User response object: {user_response.model_dump()}")
    print("===================\n")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }


@router.post("/verify-pin", response_model=PinVerificationResponse)
def verify_pin(
    pin_data: PinVerification,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Verify user's PIN for elevated access.
    Only users with a configured PIN can use this feature.
    The PIN must match the one stored in the user's database record.
    """
    # Check if the current user has a PIN configured
    if not current_user.pin_hash:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have PIN access configured"
        )
    
    # Verify the provided PIN against the user's stored PIN hash
    is_valid = verify_password(pin_data.pin, current_user.pin_hash)
    
    if is_valid:
        return {
            "valid": True,
            "message": "PIN verified successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid PIN"
        )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    """
    return current_user


@router.get("/users", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    List all users (admin only).
    """
    users = db.query(User).all()
    return users
