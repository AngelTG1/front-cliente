import React, { useState } from "react";

function CrearEncuesta({ token, obtenerEncuestas }) {
  const [pregunta, setPregunta] = useState("");
  const [respuestas, setRespuestas] = useState("");

  const crearEncuesta = async () => {
    try {
      const response = await fetch("http://localhost:3000/crear-encuesta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pregunta,
          respuestas: respuestas.split(",").map((respuesta) => respuesta.trim()),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Encuesta creada con éxito");
        setPregunta("");
        setRespuestas("");
        obtenerEncuestas(token);
      } else {
        alert(`Error al crear encuesta: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al crear encuesta:", error);
      alert("Error al crear encuesta. Inténtalo nuevamente.");
    }
  };

  return (
    <div>
      <h2>Crear Encuesta</h2>
      <div className="form-group">
        <label htmlFor="pregunta">Pregunta:</label>
        <input
          type="text"
          id="pregunta"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Escribe tu pregunta"
        />
      </div>
      <div className="form-group">
        <label htmlFor="respuestas">Respuestas (separadas por comas):</label>
        <textarea
          id="respuestas"
          value={respuestas}
          onChange={(e) => setRespuestas(e.target.value)}
          placeholder="Respuesta 1, Respuesta 2, Respuesta 3"
        ></textarea>
      </div>
      <button onClick={crearEncuesta}>Crear Encuesta</button>
    </div>
  );
}

export default CrearEncuesta;
