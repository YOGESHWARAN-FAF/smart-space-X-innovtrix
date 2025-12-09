import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Terminal, Cpu, Wifi } from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

const DocsPage = () => {
    const { addToast } = useSmartSpace();

    const espCode = `
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);

// Define your device pins here
const int PIN_LIGHT = 2; // Built-in LED usually
const int PIN_FAN = 4;

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_LIGHT, OUTPUT);
  pinMode(PIN_FAN, OUTPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Define Endpoints
  server.on("/ping", HTTP_GET, []() {
    server.send(200, "text/plain", "pong");
  });

  server.on("/device", HTTP_GET, handleDeviceControl);

  server.begin();
}

void loop() {
  server.handleClient();
}

void handleDeviceControl() {
  if (!server.hasArg("name")) {
    server.send(400, "application/json", "{\\"error\\":\\"Missing name\\"}");
    return;
  }

  String deviceName = server.arg("name");
  String state = server.arg("state"); // "on" or "off"
  String value = server.arg("value"); // "0" to "100"

  // Simple routing logic
  int pin = -1;
  if (deviceName == "light") pin = PIN_LIGHT;
  else if (deviceName == "fan") pin = PIN_FAN;

  if (pin != -1) {
    if (state != "") {
      digitalWrite(pin, state == "on" ? HIGH : LOW);
    } else if (value != "") {
      // For PWM/Dimming (0-255 for 8-bit resolution)
      int pwmValue = map(value.toInt(), 0, 100, 0, 255);
      analogWrite(pin, pwmValue);
    }
    
    server.send(200, "application/json", "{\\"status\\":\\"success\\"}");
  } else {
    server.send(404, "application/json", "{\\"error\\":\\"Device not found\\"}");
  }
}
`;

    const copyCode = () => {
        navigator.clipboard.writeText(espCode);
        addToast('Code copied to clipboard!', 'success');
    };

    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="docs-header"
            >
                <h2>Documentation</h2>
                <p>Follow these steps to connect your ESP32 to Smart Space.</p>
            </motion.div>

            <div className="docs-content">
                <section className="docs-section">
                    <h3><Cpu size={20} /> 1. Hardware Setup</h3>
                    <p>Connect your devices (LEDs, Relays) to the ESP32 GPIO pins.</p>
                    <ul>
                        <li><strong>Light</strong>: GPIO 2 (Built-in LED)</li>
                        <li><strong>Fan</strong>: GPIO 4</li>
                    </ul>
                </section>

                <section className="docs-section">
                    <h3><Terminal size={20} /> 2. Flash ESP32</h3>
                    <p>Upload the following code using Arduino IDE. Make sure to update <code>ssid</code> and <code>password</code>.</p>

                    <div className="code-block-container">
                        <button className="copy-btn" onClick={copyCode}>
                            <Copy size={16} /> Copy
                        </button>
                        <pre className="code-block">
                            <code>{espCode.trim()}</code>
                        </pre>
                    </div>
                </section>

                <section className="docs-section">
                    <h3><Wifi size={20} /> 3. Connect App</h3>
                    <ol>
                        <li>Open Serial Monitor (115200 baud) to see the ESP32 IP address.</li>
                        <li>Go to <strong>Settings</strong> in this app.</li>
                        <li>Enter the IP address and Port (default 80).</li>
                        <li>Click <strong>Check Connection</strong>.</li>
                    </ol>
                </section>
            </div>
        </div>
    );
};

export default DocsPage;
