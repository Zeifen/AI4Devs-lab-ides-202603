import React, { useState } from 'react';
import { AddCandidateForm } from './components/AddCandidateForm';
import './App.css';

function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">LTI Talent Tracking System</p>
          <h1>Dashboard de reclutamiento</h1>
        </div>
        <button className="primary-action" type="button" onClick={() => setIsFormVisible(true)}>
          Anadir candidato
        </button>
      </header>

      <main className="dashboard-main">
        <section className="summary-panel" aria-labelledby="candidate-workspace-title">
          <div>
            <h2 id="candidate-workspace-title">Candidatos</h2>
            <p>Gestiona el alta inicial de candidatos y registra su informacion clave para el proceso de seleccion.</p>
          </div>
        </section>

        {isFormVisible && (
          <section className="form-panel" aria-labelledby="add-candidate-title">
            <div className="section-heading">
              <h2 id="add-candidate-title">Anadir candidato</h2>
              <p>Completa los datos principales del candidato. Los campos marcados como obligatorios se validan antes del envio.</p>
            </div>
            <AddCandidateForm />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
