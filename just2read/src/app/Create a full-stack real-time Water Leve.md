Create a full-stack real-time Water Level Detection and Monitoring Web Application.

The system should receive live water level data from IoT devices (ESP32 / NodeMCU) using REST API or Firebase and display it on a modern, responsive web dashboard.

Features:
- Real-time water level visualization with animated tank UI
- Display percentage filled, depth in cm, and volume in liters
- Color-based status indicators (Safe, Warning, Danger, Overflow)
- Live updating graphs (daily, weekly, monthly)
- Motor control (ON/OFF) through web interface
- Automatic motor cutoff when tank is full
- Alert system using email, SMS or WhatsApp when water reaches critical levels
- User authentication (admin and normal users)
- Cloud database for historical data
- Mobile-friendly UI with dark and light mode
- Multi-tank support

Backend:
- API endpoint to receive sensor data from ESP32
- Store readings in database
- Real-time updates using WebSockets or Firebase

Frontend:
- Modern UI with charts, gauges, and animations
- Dashboard style similar to smart home apps

Provide full project with:
- Frontend code
- Backend code
- Database schema
- ESP32 sample code to send water level data
- Deployment instructions
- Security and API key protection
