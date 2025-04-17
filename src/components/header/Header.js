import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faTimes, faCheck, faExclamation, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/logo2.png";

const Header = ({ setActiveSection }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ws = useRef(null);
  const navigate = useRef(null);

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
        setUserProfile(data);
        localStorage.setItem("userId", data.userId);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Setup WebSocket connection after userId is available
  useEffect(() => {
    const interval = setInterval(() => {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");

      if (userId && userRole) {
        clearInterval(interval);
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
              isRead: n.read === true ? true : false,
            }));
            console.log(event.data);
            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const newNotifications = formatted.filter((n) => !existingIds.has(n.id));
              return [...newNotifications, ...prev];
            });
            setNotificationCount(formatted.filter((n) => !n.isRead).length);
          
          } catch (e) {
            console.error("Invalid notification format", e);
          }
        };

        ws.current.onclose = () => console.log("WebSocket closed");
        ws.current.onerror = (e) => console.error("WebSocket error", e);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (ws.current) ws.current.close();
    };
  }, []);

  const convertArrayToDate = (arr) => {
    if (!Array.isArray(arr)) return new Date();
    const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = arr;
    return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1_000_000));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfilePopup) setShowProfilePopup(false);
  };

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
    if (showNotifications) setShowNotifications(false);
  };

  const markAsRead = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(
        `/api/v1/notification/mark-as-read/${userId}/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setNotificationCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(
        `/api/v1/notification/mark-all-as-read/${userId}/${userRole}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
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

  const handleNotificationClick = (notification) => {
    if (setActiveSection) {
      setActiveSection('request');
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      setShowNotifications(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      localStorage.clear();
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const notificationContainer = document.querySelector(".notification-container");
      const profileContainer = document.querySelector(".profile-container");
      
      if (showNotifications && notificationContainer && !notificationContainer.contains(e.target)) {
        setShowNotifications(false);
      }
      if (showProfilePopup && profileContainer && !profileContainer.contains(e.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showProfilePopup]);

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-logo-container">
          <img src={Logo} alt="logo" className="header-logo" />
          <h1 className="header-company-name">Flourish HR Automation</h1>
        </div>

        <div className="header-right-section">
          <div className="notification-container">
            <div className="header-notification-icon" onClick={toggleNotifications}>
              <FontAwesomeIcon icon={faBell} />
              {notificationCount > 0 && (
                <span className="notification-count">
                  {notificationCount}
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
                    disabled={notifications.every((n) => n.isRead) || notifications.length === 0}
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
                        <div 
                          key={n.id} 
                          className={`notification-item ${n.isRead ? "read" : "unread"}`} 
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className="notification-icon-container">{getNotificationIcon(n.type)}</div>
                          <div className="notification-content">
                            <p className="notification-message">{n.message}</p>
                            <small className="notification-time">{formatNotificationTime(n.createdAt)}</small>
                          </div>
                          {!n.isRead && (
                            <button 
                              className="mark-as-read" 
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(n.id);
                              }}
                            >
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

          <div className="profile-container">
            <div 
              className="user-initials-circle" 
              onClick={toggleProfilePopup}
            >
              {userProfile?.initials || "?"}
            </div>

            {showProfilePopup && userProfile && (
              <div className="profile-popup">
                <div className="profile-info">
                  <div className="profile-name">{userProfile.fullName}</div>
                  <div className="profile-email">{userProfile.email}</div>
                </div>
                <div className="profile-divider"></div>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoggingOut && (
          <div className="logout-overlay">
            <div className="logout-spinner"></div>
            <div className="logout-message">Logging out...</div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;