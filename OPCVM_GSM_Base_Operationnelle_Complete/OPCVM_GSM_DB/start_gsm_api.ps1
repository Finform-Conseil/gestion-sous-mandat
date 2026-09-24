$env:GSM_ADMIN_KEY = 'change-me-now'
python -m uvicorn gsm_api:app --host 127.0.0.1 --port 8001 --reload
