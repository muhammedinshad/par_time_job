import random
import json
from django.core.cache import cache  
from rest_framework_simplejwt.tokens import RefreshToken

def generate_and_store_otp(email: str, role: str) -> str:
    otp = str(random.randint(100000, 999999))
    
    key = f"otp:{email}"
    
    payload = {
        "otp_code": otp,
        "role":     role,
    }
    
    # 5 minutes TTL — automatic expired 
    cache.set(key, json.dumps(payload), timeout=300)
    
    return otp


def verify_otp(email: str, otp_code: str):
    """
    Returns role if valid, None if invalid/expired
    """
    key = f"otp:{email}"
    raw = cache.get(key)
    
    if raw is None:
        return None
    
    payload = json.loads(raw)
    
    if payload["otp_code"] != otp_code:
        return None
    
    cache.delete(key)
    
    return payload["role"]



def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    
    # add role and email in token
    refresh['role']  = user.role
    refresh['email'] = user.email
    
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }