import requests

def geocode_location(location_text):
    """
    "Kozhikode" → (11.2588, 76.2144)
    "Calicut"   → (11.2588, 76.2144)  same result!
    """
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': f"{location_text}, Kerala, India",
        'format': 'json',
        'limit': 1
    }
    headers = {'User-Agent': 'PrimeJob/1.0'}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        data = response.json()
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
    except Exception:
        pass
    return None, None