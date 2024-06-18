import React, { useEffect, useState } from 'react';

function Events() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      const source = new EventSource("http://localhost:3000/events");
  
      source.addEventListener("notificacion", (event) => {
        const notificacion = JSON.parse(event.data);
        setNotificaciones((prevNotificaciones) => [...prevNotificaciones, notificacion.message]);
      });
  
      source.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message.message]);
      });
  
      return () => {
        source.close();
      };
    }, []);
  
    return (
      <div>
        <div>
          <h1>Notificaciones</h1>
          <ul id="notificaciones">
            {notificaciones.map((notificacion, index) => (
              <li key={index}>{notificacion}</li>
            ))}
          </ul>
        </div>
  
        <div>
          <h1>Messages</h1>
          <ul id="messages">
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

export default Events