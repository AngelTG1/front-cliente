import React, { useState, useEffect } from "react";

function NuevoEvents() {
  const [pregunta, setPregunta] = useState("");
  const [respuestas, setRespuestas] = useState("");
  const [encuestas, setEncuestas] = useState([]);
  const [votos, setVotos] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      obtenerEncuestas(storedToken);
      connectSSE(storedToken);
    }
  }, []);

  const obtenerEncuestas = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/ver-encuestas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEncuestas(data.encuestas);
    } catch (error) {
      console.error("Error al obtener encuestas:", error);
    }
  };

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

  const enviarRespuesta = async (encuestaId, respuesta) => {
    try {
      const response = await fetch(`http://localhost:3000/enviar-respuesta/${encuestaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ respuesta }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Respuesta enviada con éxito");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      alert("Error al enviar respuesta. Inténtalo nuevamente.");
    }
  };

  const cambiarEstadoEncuesta = async (encuestaId, nuevoEstado) => {
    try {
      const response = await fetch("http://localhost:3000/encuesta-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: encuestaId,
          status: nuevoEstado,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEncuestas((prevEncuestas) =>
          prevEncuestas.map((encuesta) =>
            encuesta.id === encuestaId ? { ...encuesta, status: nuevoEstado } : encuesta
          )
        );
        alert(nuevoEstado === 1 ? "Encuesta abierta con éxito" : "Encuesta cerrada con éxito");
      } else {
        alert(`Error al cambiar el estado de la encuesta: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la encuesta:", error);
      alert("Error al cambiar el estado de la encuesta. Inténtalo nuevamente.");
    }
  };

  const connectSSE = (token) => {
    const source = new EventSource("http://localhost:3000/events");

    source.addEventListener("nuevaEncuesta", (event) => {
      const nuevaEncuesta = JSON.parse(event.data);
      setEncuestas((prevEncuestas) => [...prevEncuestas, nuevaEncuesta]);
    });

    source.addEventListener("actualizacionVotos", (event) => {
      const { encuestaId, conteoVotos } = JSON.parse(event.data);
      setVotos((prevVotos) => ({
        ...prevVotos,
        [encuestaId]: conteoVotos,
      }));
    });

    source.onerror = (error) => {
      console.error("Error en SSE:", error);
    };
  };

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    obtenerEncuestas(token);
    connectSSE(token);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div className="container">
      {token ? (
        <>
          <h1>Encuestas en Tiempo Real</h1>
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
          <div>
            <h2>Encuestas Disponibles</h2>
            <div id="encuestas">
              {encuestas.map((encuesta) => (
                <div key={encuesta.id} className="encuesta">
                  <h3>{encuesta.pregunta}</h3>
                  {encuesta.status === 0 ? (
                    <>
                      <p>Esta encuesta está cerrada.</p>
                      <button onClick={() => cambiarEstadoEncuesta(encuesta.id, 1)}>Reabrir Encuesta</button>
                    </>
                  ) : (
                    <>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          enviarRespuesta(encuesta.id, e.target.elements.respuesta.value);
                        }}
                      >
                        {encuesta.respuestas.map((respuesta, index) => (
                          <div key={index}>
                            <input
                              type="radio"
                              id={`respuesta-${encuesta.id}-${index}`}
                              name="respuesta"
                              value={respuesta}
                            />
                            <label htmlFor={`respuesta-${encuesta.id}-${index}`}>{respuesta}</label>
                          </div>
                        ))}
                        <button type="submit">Enviar Respuesta</button>
                      </form>
                      {votos[encuesta.id] && (
                        <div className="votos">
                          <h4>Resultados:</h4>
                          <ul>
                            {encuesta.respuestas.map((respuesta, index) => (
                              <li key={index}>
                                {respuesta}: {votos[encuesta.id][respuesta] || 0} votos
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button onClick={() => cambiarEstadoEncuesta(encuesta.id, 0)}>Cerrar Encuesta</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (data.success) {
        onLogin(data.token);
      } else {
        alert("Inicio de sesión fallido. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <div className="form-group">
        <label htmlFor="name">Nombre de usuario:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de usuario"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
      </div>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default NuevoEvents;
