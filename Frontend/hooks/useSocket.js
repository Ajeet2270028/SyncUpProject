// // hooks/useSocket.js
// // Custom React hook to manage Socket.IO connection
// // Handles: connect, disconnect, reconnect — all in one place

// import { useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// const BACKEND_URL = "http://localhost:4000";

// /**
//  * useSocket — connect to the backend Socket.IO server
//  *
//  * @param {string} eventName - the event to listen for (e.g. "new_feed")
//  * @param {function} onEvent  - callback function called when event fires
//  *
//  * Usage:
//  *   useSocket("new_feed", (data) => setFeeds(prev => [data, ...prev]));
//  */
// export function useSocket(eventName, onEvent) {
//   // useRef keeps a stable reference to the socket across renders
//   // (unlike useState, changing a ref doesn't cause a re-render)
//   const socketRef = useRef(null);

//   useEffect(() => {
//     // Create socket connection when component mounts
//     const socket = io(BACKEND_URL, {
//       // Reconnection settings (bonus requirement)
//       reconnection: true,          // auto-reconnect if connection drops
//       reconnectionAttempts: 5,     // try 5 times before giving up
//       reconnectionDelay: 2000,     // wait 2s between attempts
//       transports: ["websocket"],   // use WebSocket directly (skip long-polling)
//     });

//     socketRef.current = socket;

//     // Connection events (useful for debugging)
//     socket.on("connect", () => {
//       console.log("🔌 Socket connected:", socket.id);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });

//     socket.on("reconnect", (attempt) => {
//       console.log(`✅ Reconnected after ${attempt} attempts`);
//     });

//     socket.on("reconnect_failed", () => {
//       console.error("❌ Socket reconnection failed after max attempts");
//     });

//     // Listen for the specific event the caller wants
//     if (eventName && onEvent) {
//       socket.on(eventName, onEvent);
//     }

//     // Cleanup: disconnect socket when component unmounts
//     // This prevents memory leaks and duplicate event listeners
//     return () => {
//       console.log("🧹 Cleaning up socket connection");
//       socket.disconnect();
//     };
//   }, []); // empty array = run only once when component mounts

//   return socketRef; // expose socket ref in case caller needs it
// }


import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:4000";

export function useSocket(eventName, onEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    if (eventName && onEvent) {
      socket.on(eventName, onEvent);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}