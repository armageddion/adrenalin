# Adrenalin Deployment Guide

## Components

Adrenalin is a single integrated executable that includes:

1. **Desktop GUI Application** - Main interface for gym management
2. **Built-in Web Server** - Serves responsive registration interface for mobile devices
3. **REST API** - Handles member registration from web browsers

## Installation

### Linux
1. Download `Adrenalin.x86_64.AppImage`
2. Make it executable: `chmod +x Adrenalin.x86_64.AppImage`
3. Run: `./Adrenalin.x86_64.AppImage`

### Windows
1. Download `Adrenalin.x64.exe` (installer)
2. Run the installer
3. Launch Adrenalin from Start Menu or desktop shortcut

## Running the Application

Simply start the Adrenalin application. The API server starts automatically in the background.

**Default Configuration:**
- **API Server**: `http://localhost:8080`
- **API Key**: `default-api-key-change-in-production`

## Configuration

Configure the API server using environment variables:

```bash
# Set API port (default: 8080)
export ADRENALIN_API_PORT=8080

# Set API key for authentication
export ADRENALIN_API_KEY=your-secret-key

# Then run the application
./Adrenalin.x86_64.AppImage
```

Or configure through the Settings UI in the application.

## Mobile Device Registration

Any device with a web browser can register members by navigating to:
- **URL**: `http://[YOUR_IP_ADDRESS]:8080` (e.g., `http://192.168.1.100:8080`)
- **No app installation required** - works on phones, tablets, laptops
- **Automatic authentication** - API key handled internally by web interface

## Network Setup

1. **Find your computer's IP address:**
    ```bash
    # Linux
    ip addr show | grep "inet " | grep -v 127.0.0.1

    # Windows
    ipconfig
    ```

2. **Ensure firewall allows connections on port 8080**

3. **Connect mobile devices to same WiFi network**

4. **Share the URL**: `http://[YOUR_IP]:8080` with registration staff

## Web Interface

Access the registration interface at: `http://[YOUR_IP]:8080`

**Features:**
- Mobile-responsive design works on phones, tablets, and desktops
- Real-time form validation and error feedback
- Touch-friendly controls optimized for mobile use
- Automatic API authentication (no manual key entry needed)

## API Endpoints

### POST /api/members
Register a new member from web interface.

**Headers:**
```
Authorization: Bearer {api_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "cardId": "CARD123",
  "yearOfBirth": 1990,
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "id": 123,
  "message": "Member registered successfully"
}
```

### GET / (and other static files)
Serves the web registration interface and assets.

## Troubleshooting

### Web Interface Not Accessible
- Verify the desktop app is running (web server starts automatically)
- Check IP address and port configuration
- Ensure firewall isn't blocking port 8080
- Confirm devices are on the same WiFi network
- Try accessing from the host computer first: `http://localhost:8080`

### Port Already in Use
- Change the port: `ADRENALIN_API_PORT=8081`
- Check what's using the port: `netstat -tlnp | grep :8080`

### Registration Form Issues
- Clear browser cache and reload the page
- Check browser console for JavaScript errors
- Verify the API key is configured correctly
- Ensure SQLite database has write permissions

### Database Issues
- SQLite database is automatically created in the user profile directory
- Ensure the application has write permissions to its data directory

## Security Notes

- Change the default API key before deploying to production
- Use strong, unique API keys for authentication
- Keep API keys secure and don't commit them to version control
- Consider using HTTPS in production environments
- Web interface validates all input on both client and server side
- API endpoints require authentication for all operations

## Architecture

The integrated architecture provides:
- **Single executable** - No separate server process to manage
- **Automatic startup** - Web server starts with the desktop app
- **Shared database** - Both GUI and web interface use the same SQLite database
- **Real-time sync** - Registrations made via web are immediately visible in GUI
- **Cross-platform web access** - Any device with a browser can register members
- **Zero-installation** - No mobile apps to deploy or update
