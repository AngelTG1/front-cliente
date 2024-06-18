import React from "react";

function EncuestasDisponibles({
  encuestas,
  enviarRespuesta,
  cambiarEstadoEncuesta,
  votos,
}) {
  return (
    <div>
      <h2>Encuestas Disponibles</h2>
      <div id="encuestas">
        {encuestas.map((encuesta) => (
          <div key={encuesta.id} className="encuesta">
            <h3>{encuesta.pregunta}</h3>
            {encuesta.status === 0 ? (
              <>
                <p>Esta encuesta está cerrada.</p>
                <button onClick={() => cambiarEstadoEncuesta(encuesta.id, 1)}>
                  Reabrir Encuesta
                </button>
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
                      <label htmlFor={`respuesta-${encuesta.id}-${index}`}>
                        {respuesta}
                      </label>
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
                <button className="btn-cerrar" onClick={() => cambiarEstadoEncuesta(encuesta.id, 0)}>
                  Cerrar Encuesta
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EncuestasDisponibles;
