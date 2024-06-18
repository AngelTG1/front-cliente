import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import CrearEncuesta from "./components/CrearEncuesta";
import EncuestasDisponibles from "./components/EncuestasDisponibles";
import Events from "./pages/Events";
import EventSourceComponent from "./pages/EventSourceComponent";
import NuevoEvents from "./pages/NuevoEvents";

function App() {
  // const [encuestas, setEncuestas] = useState([]);
  // const [votos, setVotos] = useState({});
  // const [token, setToken] = useState("");

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //     obtenerEncuestas(storedToken);
  //     connectWebSocket(storedToken);
  //     fetchSurveysByState(storedToken, 0); // Obtener encuestas cerradas
  //     fetchSurveysByState(storedToken, 1); // Obtener encuestas abiertas
  //   }
  // }, []);

  // const obtenerEncuestas = async (token) => {
  //   try {
  //     const response = await fetch("http://localhost:3000/ver-encuestas", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.json();
  //     setEncuestas(data.encuestas);
  //   } catch (error) {
  //     console.error("Error al obtener encuestas:", error);
  //   }
  // };

  // const fetchSurveysByState = async (token, estado) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/encuestas-estado?estado=${estado}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log(`Encuestas ${estado === 0 ? 'cerradas' : 'abiertas'}:`, data.encuestas);

  //     setEncuestas((prevEncuestas) => {
  //       const updatedEncuestas = prevEncuestas.map((encuesta) =>
  //         data.encuestas.some((survey) => survey.id === encuesta.id)
  //           ? { ...encuesta, status: estado }
  //           : encuesta
  //       );
  //       const nuevasEncuestas = data.encuestas.filter(
  //         (survey) =>
  //           !prevEncuestas.some((encuesta) => encuesta.id === survey.id)
  //       );
  //       return [...updatedEncuestas, ...nuevasEncuestas];
  //     });
  //   } catch (error) {
  //     console.error(`Error al obtener encuestas ${estado === 0 ? 'cerradas' : 'abiertas'}:`, error);
  //   } finally {
  //     setTimeout(() => fetchSurveysByState(token, estado), 5000);
  //   }
  // };

  // const connectWebSocket = () => {
  //   const ws = new WebSocket("ws://localhost:3000");

  //   ws.onopen = () => {
  //     console.log("Conexión WebSocket abierta");
  //     ws.send(JSON.stringify({ action: "getEncuestas" }));
  //   };

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("Received from server:", data);

  //     switch (data.event) {
  //       case "getEncuestas":
  //         setEncuestas(data.data);
  //         break;

  //       case "nuevaEncuesta":
  //         setEncuestas((prevEncuestas) => [...prevEncuestas, data.data]);
  //         break;

  //       case "actualizacionVotos":
  //         const { encuestaId, conteoVotos } = data.data;
  //         setVotos((prevVotos) => ({
  //           ...prevVotos,
  //           [encuestaId]: conteoVotos,
  //         }));
  //         break;

  //       default:
  //         break;
  //     }
  //   };

  //   ws.onclose = () => {
  //     console.log("Conexión WebSocket cerrada");
  //   };

  //   ws.onerror = (error) => {
  //     console.error("Error en WebSocket:", error);
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // };

  // const handleLogin = (token) => {
  //   setToken(token);
  //   localStorage.setItem("token", token);
  //   obtenerEncuestas(token);
  //   connectWebSocket(token);
  //   fetchSurveysByState(token, 0); // Obtener encuestas cerradas
  //   fetchSurveysByState(token, 1); // Obtener encuestas abiertas
  // };

  // const handleLogout = () => {
  //   setToken("");
  //   localStorage.removeItem("token");
  // };

  // const enviarRespuesta = async (encuestaId, respuesta) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/enviar-respuesta/${encuestaId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ respuesta }),
  //       }
  //     );

  //     const data = await response.json();
  //     if (data.success) {
  //       alert("Respuesta enviada con éxito");
  //     } else {
  //       if (data.message === "No se puede responder a una encuesta cerrada") {
  //         alert(
  //           "Esta encuesta no se puede responder porque su estado cambió a cerrado."
  //         );
  //       } else {
  //         alert(`Error: ${data.message}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error al enviar respuesta:", error);
  //     alert("Error al enviar respuesta. Inténtalo nuevamente.");
  //   }
  // };

  // const cambiarEstadoEncuesta = async (encuestaId, nuevoEstado) => {
  //   try {
  //     const response = await fetch("http://localhost:3000/encuesta-status", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         id: encuestaId,
  //         status: nuevoEstado,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       setEncuestas((prevEncuestas) =>
  //         prevEncuestas.map((encuesta) =>
  //           encuesta.id === encuestaId ? { ...encuesta, status: nuevoEstado } : encuesta
  //         )
  //       );
  //       alert(
  //         nuevoEstado === 1
  //           ? "Encuesta abierta con éxito"
  //           : "Encuesta cerrada con éxito"
  //       );
  //     } else {
  //       alert(`Error al cambiar el estado de la encuesta: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error al cambiar el estado de la encuesta:", error);
  //     alert("Error al cambiar el estado de la encuesta. Inténtalo nuevamente.");
  //   }
  // };

  return (
    // <div className="container">
    //   {token ? (
    //     <>
    //       <div className="header">
    //         <h1>Encuestas en Tiempo Real</h1>
    //         <button onClick={handleLogout}>Cerrar Sesión</button>
    //       </div>
    //       <CrearEncuesta token={token} obtenerEncuestas={obtenerEncuestas} />
    //       <EncuestasDisponibles
    //         encuestas={encuestas}
    //         enviarRespuesta={enviarRespuesta}
    //         cambiarEstadoEncuesta={cambiarEstadoEncuesta}
    //         votos={votos}
    //       />
          
    //     </>
    //   ) : (
    //     <Login onLogin={handleLogin} />
    //   )}
    // </div>
    <>
      {/* <Events/> */}
      {/* <EventSourceComponent/> */}
      <NuevoEvents/>
    </>
  );
}

export default App;
