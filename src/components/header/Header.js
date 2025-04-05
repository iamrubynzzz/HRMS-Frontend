import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faTimes, faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/logo.png";
const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [userInitials, setUserInitials] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const ws = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/requests/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUserInitials(data.initials || "?");
        localStorage.setItem("userId", data.userId);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    ws.current = new WebSocket(`ws://localhost:8091/?userId=${userId}&role=${userRole}`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const formatted = parsed.map((n) => ({
          ...n,
          createdAt: convertArrayToDate(n.createdAt),
          isRead: false,
        }));
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newNotifications = formatted.filter((n) => !existingIds.has(n.id));
          return [...newNotifications, ...prev];
        });
      } catch (e) {
        console.error("Invalid notification format", e);
      }
    };

    ws.current.onclose = () => console.log("WebSocket closed");
    ws.current.onerror = (e) => console.error("WebSocket error", e);

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Convert Java array to JS Date
  const convertArrayToDate = (arr) => {
    if (!Array.isArray(arr)) return new Date();
    const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = arr;
    return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1_000_000));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "APPROVAL":
        return <FontAwesomeIcon icon={faCheck} className="notification-icon approval" />;
      case "TASK":
      case "REMINDER":
        return <FontAwesomeIcon icon={faExclamation} className="notification-icon task" />;
      default:
        return <FontAwesomeIcon icon={faBell} className="notification-icon default" />;
    }
  };

  const formatNotificationTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const container = document.querySelector(".notification-container");
      if (showNotifications && container && !container.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-logo-container">
          <img src={Logo} alt="logo" className="header-logo" />
          <h1 className="header-company-name">Flourish HR Automation</h1>
        </div>

        <div className="header-search-container">
          <div className="header-search-box">
            <input type="text" placeholder="Search..." className="header-search-input" />
            <button className="header-search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <div className="header-right-section">
          <div className="notification-container">
            <div className="header-notification-icon" onClick={toggleNotifications}>
              <FontAwesomeIcon icon={faBell} />
              {notifications.some((n) => !n.isRead) && (
                <span className="notification-count">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </div>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button
                    className="mark-all-read"
                    onClick={markAllAsRead}
                    disabled={notifications.every((n) => n.isRead)}
                  >
                    Mark all as read
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="notification-empty">No notifications</div>
                ) : (
                  <div className="notification-list-container">
                    <div className="notification-list">
                      {notifications.map((n) => (
                        <div key={n.id} className={`notification-item ${n.isRead ? "read" : "unread"}`}>
                          <div className="notification-icon-container">{getNotificationIcon(n.type)}</div>
                          <div className="notification-content">
                            <p className="notification-message">{n.message}</p>
                            <small className="notification-time">{formatNotificationTime(n.createdAt)}</small>
                          </div>
                          {!n.isRead && (
                            <button className="mark-as-read" onClick={() => markAsRead(n.id)}>
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="user-initials-circle">{userInitials}</div>
        </div>
      </header>
    </div>
  );
};

export default Header;
