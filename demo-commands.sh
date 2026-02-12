
# Demo Script for API Testing
# Copy these commands to use during your Loom recording

# 1. Register User (run once)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "name": "Demo User"
  }'

# 2. Login User (get JWT token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'

# 3. Create Device (replace YOUR_JWT_TOKEN)
curl -X POST http://localhost:3000/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Demo IoT Device",
    "type": "ESP32",
    "description": "Temperature and humidity sensor"
  }'

# 4. Submit Telemetry (replace DEVICE_API_KEY)
curl -X POST http://localhost:3000/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "DEVICE_API_KEY",
    "temperature": 25.5,
    "humidity": 60.2,
    "data": {
      "pressure": 1013,
      "light": 450
    }
  }'

# 5. Get Telemetry Data (replace YOUR_JWT_TOKEN and DEVICE_ID)
curl -X GET "http://localhost:3000/telemetry/device/DEVICE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
