import React, { useEffect, useState } from 'react';

const EventEncuesta = () => {
  const [encuestas, setEncuestas] = useState([]);

  useEffect(() => {
    const source = new EventSource("http://localhost:3000/events");

    source.addEventListener("open", () => {
      console.log("Conexión establecida con el servidor de eventos");
    });

    source.addEventListener("error", (error) => {
      console.error("Error en la conexión con el servidor de eventos:", error);
    });

    source.addEventListener("encuesta", (event) => {
      const encuesta = JSON.parse(event.data);
      setEncuestas((prevEncuestas) => [...prevEncuestas, encuesta]);
    });

    source.addEventListener("encuestaStatus", (event) => {
      const encuesta = JSON.parse(event.data);
      setEncuestas((prevEncuestas) =>
        prevEncuestas.map((e) => (e.id === encuesta.id ? encuesta : e))
      );
    });

    return () => {
      source.close();
    };
  }, []);

  const crearEncuesta = async () => {
    const response = await fetch("http://localhost:3000/crear-encuesta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        pregunta: "¿Cuál es tu color favorito?",
        respuestas: ["Rojo", "Azul", "Verde"],
      }),
    });

    if (response.ok) {
      console.log("Encuesta creada exitosamente");
    } else {
      console.error("Error al crear la encuesta:", await response.text());
    }
  };

  const cerrarEncuesta = async (encuestaId) => {
    const response = await fetch("http://localhost:3000/encuesta-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        id: encuestaId,
        status: 0,
      }),
    });

    if (response.ok) {
      console.log("Encuesta cerrada exitosamente");
    } else {
      console.error("Error al cerrar la encuesta:", await response.text());
    }
  };

  return (
    <div>
      <h1>Encuestas en Tiempo Real</h1>
      <button onClick={crearEncuesta}>Crear Encuesta</button>
      <ul>
        {encuestas.map((encuesta) => (
          <li key={encuesta.id}>
            {encuesta.pregunta} - Status: {encuesta.status === 1 ? "Abierta" : "Cerrada"}
            {encuesta.status === 1 && (
              <button onClick={() => cerrarEncuesta(encuesta.id)}>Cerrar Encuesta</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventEncuesta;
