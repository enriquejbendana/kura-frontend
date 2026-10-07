const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(filePath, 'utf8');

const index = code.indexOf('{isLoading ? (');
const end = code.indexOf('const exactMatches =');

if (index !== -1 && end !== -1) {
  const targetStr = code.substring(index, end);
  
  const replacementStr = `{isLoading && (
              <div className="loading-container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)' }}>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                  Consultando punto de venta {scannedPharmacies || 1}...
                </h3>
                
                <div style={{ position: 'relative', height: '60px', marginBottom: '1.5rem', width: '100%', overflow: 'hidden' }}>
                  <p className={\`animated-loading-text \${loadingMessageIdx === 0 ? 'visible' : 'hidden'}\`}>
                    Nos estamos tomando tiempo para buscar los mejores precios en las mejores farmacias.
                  </p>
                  <p className={\`animated-loading-text \${loadingMessageIdx === 1 ? 'visible' : 'hidden'}\`}>
                    Sos nuestro visitante número {visitCount} a nuestra página en la semana. ¡Gracias!
                  </p>
                </div>

                <div style={{ background: 'var(--background)', borderRadius: '999px', height: '10px', width: '250px', margin: '0 auto', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', background: 'var(--primary)', width: \`\${(scannedPharmacies / 5) * 100}%\`, transition: 'width 0.8s ease-in-out', borderRadius: '999px' }}></div>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                  Analizando... {scannedPharmacies} farmacias listas
                </p>
                <style>{\`@keyframes spin { 100% { transform: rotate(360deg); } }\`}</style>
              </div>
            )}
            
            {results.length > 0 && (
              <>
                {backendErrors.length > 0 && (
                  <div className="error-banner" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Aviso importante:</strong>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {backendErrors.map((err, idx) => (
                        <li key={idx}>El sistema de farmacia <strong>{err.pharmacy.name}</strong> está caído y no responde en este momento.</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="results-grid">
                  {(() => {
                    `;

  code = code.replace(targetStr, replacementStr);
  
  // Let's also remove the trailing `isLiveSearching` bottom spinner!
  const trailingSpinner = `                  {isLiveSearching && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{liveLoadingMessage}</p>
                    </div>
                  )}`;
  if (code.includes(trailingSpinner)) {
    code = code.replace(trailingSpinner, '');
  }

  // And let's fix the punto-farma mapping again just in case the backup still has it
  code = code.split("'punto-farma'").join("'punto_farma'");

  // Let's remove the remaining state variables (loadingMessage, etc) at the top
  code = code.replace(/const \[loadingMessage, setLoadingMessage\].*?\n/g, '');
  code = code.replace(/const \[isLiveSearching, setIsLiveSearching\].*?\n/g, '');
  code = code.replace(/const \[liveLoadingMessage, setLiveLoadingMessage\].*?\n/g, '');

  fs.writeFileSync(filePath, code);
  console.log('JSX layout successfully decoupled for progressive loading.');
} else {
  console.log('Failed to find target block in JSX.');
}
