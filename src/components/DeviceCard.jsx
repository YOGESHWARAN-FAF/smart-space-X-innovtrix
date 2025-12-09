import React, { useState, useEffect } from 'react';
import { Trash2, Power, Sun } from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import { useDebounce } from '../utils/useDebounce';
import { motion } from 'framer-motion';

const DeviceCard = ({ venueId, device }) => {
  const { deleteDevice, updateDeviceLocal, sendCommand, addToast } = useSmartSpace();
  const [localValue, setLocalValue] = useState(device.value || 0);
  const debouncedValue = useDebounce(localValue, 500);

  // Handle Slider Change (Regulatable)
  useEffect(() => {
    if (device.type === 'REGULATABLE' && debouncedValue !== device.value) {
      const sync = async () => {
        try {
          updateDeviceLocal(venueId, device.id, { value: debouncedValue });
          await sendCommand(venueId, device.name, { value: debouncedValue });
        } catch (error) {
          addToast(`Failed to set value: ${error.message}`, 'error');
        }
      };

      if (debouncedValue !== device.value) {
        sync();
      }
    }
  }, [debouncedValue, device.type, device.name, venueId, addToast, device.value, updateDeviceLocal, sendCommand]);

  // Sync local state if props change
  useEffect(() => {
    if (device.type === 'REGULATABLE') {
      setLocalValue(device.value);
    }
  }, [device.value, device.type]);


  const handleToggle = async () => {
    const newState = device.state === 'on' ? 'off' : 'on';
    try {
      // Optimistic update
      updateDeviceLocal(venueId, device.id, { state: newState });
      await sendCommand(venueId, device.name, { state: newState });
    } catch (error) {
      // Revert on failure
      updateDeviceLocal(venueId, device.id, { state: device.state }); // revert
      addToast(`Failed to toggle: ${error.message}`, 'error');
    }
  };

  const handleSliderChange = (e) => {
    setLocalValue(parseInt(e.target.value, 10));
  };

  const handleDelete = () => {
    if (window.confirm(`Delete device "${device.name}"?`)) {
      deleteDevice(venueId, device.id);
    }
  };

  return (
    <div className="card device-card">
      <div className="device-header">
        <div className="device-icon">
          {device.type === 'NORMAL' ? <Power size={20} /> : <Sun size={20} />}
        </div>
        <div className="device-info">
          <h4>{device.name}</h4>
          <span className="device-type">{device.type}</span>
        </div>
        <button className="btn-icon danger sm" onClick={handleDelete}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="device-controls">
        {device.type === 'NORMAL' ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`btn-toggle ${device.state === 'on' ? 'active' : ''}`}
            onClick={handleToggle}
          >
            {device.state === 'on' ? 'ON' : 'OFF'}
          </motion.button>
        ) : (
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={localValue}
              onChange={handleSliderChange}
              className="slider"
            />
            <span className="slider-value">{localValue}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
