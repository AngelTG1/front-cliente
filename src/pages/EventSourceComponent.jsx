import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventSourceComponent = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    const source = new EventSource("http://localhost:3000/events");

    source.addEventListener('allEncuestas', function(event) {
      const data = JSON.parse(event.data);
      setEncuestas(data);
    });

    source.addEventListener('encuesta', function(event) {
      const data = JSON.parse(event.data);
      console.log("Nueva encuesta creada:", data);
      setEncuestas(prevEncuestas => [...prevEncuestas, data]);
    });

    source.addEventListener('encuestaStatus', function(event) {
      const data = JSON.parse(event.data);
      console.log("Estado de encuesta actualizado:", data);
      setEncuestas(prevEncuestas =>
        prevEncuestas.map(encuesta =>
          encuesta.id === data.id ? { ...encuesta, status: data.status } : encuesta
        )
      );
    });

    source.addEventListener('respuestaRecibida', function(event) {
      const data = JSON.parse(event.data);
      console.log("Respuesta recibida para encuesta:", data);
      // Aquí podrías manejar la lógica para mostrar que se ha recibido una nueva respuesta
    });

    return () => {
      source.close();
    };
  }, []);

  const handleCrearEncuesta = async () => {
    try {
      const nuevaEncuesta = {
        pregunta,
        respuestas,
      };
      const response = await axios.post('http://localhost:3000/crear-encuesta', nuevaEncuesta);
      console.log("Encuesta creada:", response.data);
      setPregunta('');
      setRespuestas([]);
    } catch (error) {
      console.error('Error al crear encuesta:', error);
    }
  };

  const handleChangeStatus = async (id, nuevoStatus) => {
    try {
      const response = await axios.patch('http://localhost:3000/encuesta-status', { id, status: nuevoStatus });
      console.log("Estado de encuesta actualizado:", response.data);
    } catch (error) {
      console.error('Error al cambiar estado de encuesta:', error);
    }
  };

  const handleRespuesta = async (encuestaId, respuesta) => {
    try {
      const response = await axios.post(`http://localhost:3000/enviar-respuesta/${encuestaId}`, { respuesta });
      console.log("Respuesta enviada:", response.data);
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    }
  };

  return (
    <div>
      <h2>Crear Encuesta</h2>
      <input type="text" placeholder="Pregunta" value={pregunta} onChange={(e) => setPregunta(e.target.value)} />
      <br />
      <input type="text" placeholder="Respuestas (separadas por coma)" value={respuestas} onChange={(e) => setRespuestas(e.target.value.split(','))} />
      <br />
      <button onClick={handleCrearEncuesta}>Crear Encuesta</button>

      <h2>Encuestas:</h2>
      <ul>
        {encuestas.map(encuesta => (
          <li key={encuesta.id}>
            {encuesta.pregunta} - Estado: {encuesta.status === 1 ? 'Abierta' : 'Cerrada'}
            <br />
            <button onClick={() => handleChangeStatus(encuesta.id, encuesta.status === 1 ? 0 : 1)}>
              {encuesta.status === 1 ? 'Cerrar Encuesta' : 'Abrir Encuesta'}
            </button>
            <br />
            <input type="text" placeholder="Tu respuesta" onChange={(e) => handleRespuesta(encuesta.id, e.target.value)} />
            <button onClick={() => handleRespuesta(encuesta.id, 'Tu respuesta aquí')}>Enviar Respuesta</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventSourceComponent;
