import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

const useWebSocket = () => {
  const [stompClient, setStompClient] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to notifications
        client.subscribe("/topic/notifications", (message) => {
          const notification = JSON.parse(message.body);
          
          // Check if the notification is for admin
          if (notification.recipientRole === "ADMIN") {
            toast.info(notification.message);
            setNotifications((prev) => [...prev, notification]);
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (error) => {
        console.error("WebSocket Error: ", error);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return { notifications };
};

export default useWebSocket;
