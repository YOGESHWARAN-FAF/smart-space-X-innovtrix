
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartSpace } from '../context/SmartSpaceContext';
import { Wifi, Save, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const ConnectPage = () => {
  const navigate = useNavigate();
  const { espConfig, setEspConfig, addToast, setIsConnected, safeFetch } = useSmartSpace();
  const [ip, setIp] = useState(espConfig.ip || '');
  const [port, setPort] = useState(espConfig.port || '80');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const savedIp = localStorage.getItem('lastIp');
    const savedPort = localStorage.getItem('lastPort');
    if (savedIp) setIp(savedIp);
    if (savedPort) setPort(savedPort);
  }, []);

  useEffect(() => {
    if (espConfig.ip) setIp(espConfig.ip);
    if (espConfig.port) setPort(espConfig.port);
  }, [espConfig]);

  const handleConnect = async () => {
    if (!ip || !port) {
      addToast('Please enter IP and Port', 'error');
      return;
    }

    setLoading(true);
    setStatusMessage('Checking connection...');

    const cleanIP = ip.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const cleanPort = port.toString().replace(/[^0-9]/g, '');
    const url = `http://${cleanIP}:${cleanPort}/ping`;

    const res = await safeFetch(url);

    if (res === 'pong' || (res && res.message === 'pong')) {
      // Success
      addToast('Connection successful!', 'success');
      setStatusMessage('Connected! ✔');
      setIsConnected(true);

      localStorage.setItem('lastIp', ip);
      localStorage.setItem('lastPort', port);

      setEspConfig({
        ...espConfig,
        ip: cleanIP,
        port: cleanPort,
        isOnline: true,
        lastCheckedAt: new Date().toISOString()
      });
    } else {
      setStatusMessage('Connection failed');
      setIsConnected(false);
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!ip || !port) {
      addToast('Please enter IP and Port', 'error');
      return;
    }

    const cleanIP = ip.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const cleanPort = port.toString().replace(/[^0-9]/g, '');

    setEspConfig({ ...espConfig, ip: cleanIP, port: cleanPort });
    addToast('Configuration saved', 'success');
    navigate('/');
  };

  return (
    <div className="page connect-page">
      <div className="container">
        <header className="page-header">
          <h1>Connect to Space</h1>
          <p>Enter your ESP32 configuration</p>
        </header>

        <div className="card form-card">
          <div className="form-group">
            <label>ESP32 IP Address</label>
            <input
              type="text"
              placeholder="e.g. 192.168.1.100 or localhost"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Port</label>
            <input
              type="text"
              placeholder="e.g. 80 or 3000"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>

          {statusMessage && (
            <div className={`status-message ${statusMessage.includes('Error') ? 'error' : 'success'}`} style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', background: statusMessage.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: statusMessage.includes('Error') ? '#ef4444' : '#10b981' }}>
              {statusMessage}
            </div>
          )}

          <div className="button-group">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary"
              onClick={handleConnect}
              disabled={loading}
            >
              <Wifi size={18} />
              {loading ? 'Checking...' : 'Check Connection'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={handleSave}
            >
              <Save size={18} />
              Save & Continue
            </motion.button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#6b7280' }}>
          <p><strong>Testing Locally?</strong></p>
          <p>1. Run mock server: <code>node mock-esp.cjs</code></p>
          <p>2. Enter IP: <code>localhost</code>, Port: <code>3000</code></p>
          <p>3. If using HTTPS, ensure mixed content is allowed or run dev server with HTTP.</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
