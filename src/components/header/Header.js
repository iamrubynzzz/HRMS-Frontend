import React, { useEffect, useState } from 'react';
import './Header.css';
/*import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';*/

const Header = () => {
  const [notifications, setNotifications] = useState([]);
 /* const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Use SockJS for WebSocket connection
    const socket = new SockJS('/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log('WebSocket Connected');

      // Subscribe to the notification topic
      client.subscribe('/topic/notifications', (message) => {
        const request = JSON.parse(message.body);
        console.log('New Request Notification:', request);
      });
    });

    // Save client reference for cleanup
    setStompClient(client);

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.disconnect(() => {
          console.log('WebSocket Disconnected');
        });
      }
    };
  }, []);*/

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-logo-container">
          <img src="null" alt="" className="header-logo" />
          <h1 className="header-company-name">Flourish HR Automation</h1>
        </div>
        <div className="header-search-container">
          <div className="header-search-box">
            <input type="text" placeholder="Search..." className="header-search-input" />
            <button className="header-search-btn">🔍</button>
          </div>
        </div>
        <div className="header-notification-icon">
          🔔
          {notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}
          <div className="notification-dropdown">
            {notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification}
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
