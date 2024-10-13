import React, { useState } from 'react';
import { Bell, AlertTriangle, CloudLightning, Droplets } from 'lucide-react';
import styles from './Styles/NotificationSettings.module.css';

const NotifSettings = () => {
  const [settings, setSettings] = useState({
    generalAlerts: true,
    weatherAlerts: true,
    evacuationOrders: true,
    floodWarnings: false,
  });

  const toggleSetting = (key) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key]
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notification Settings</h1>
      <p className={styles.description}>Customize the types of alerts you'd like to receive</p>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Bell className={styles.icon} />
            <span>General Alerts</span>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.generalAlerts}
              onChange={() => toggleSetting('generalAlerts')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <CloudLightning className={styles.icon} />
            <span>Weather Alerts</span>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.weatherAlerts}
              onChange={() => toggleSetting('weatherAlerts')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <AlertTriangle className={styles.icon} />
            <span>Evacuation Orders</span>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.evacuationOrders}
              onChange={() => toggleSetting('evacuationOrders')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Droplets className={styles.icon} />
            <span>Flood Warnings</span>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.floodWarnings}
              onChange={() => toggleSetting('floodWarnings')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <p className={styles.note}>Note: Certain critical alerts may be sent regardless of these settings.</p>
    </div>
  );
};

export default NotifSettings;