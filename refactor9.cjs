const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(filePath, 'utf8');

const target = `              </>
            ) : (
              <div className="no-results" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>`;

const replacement = `              </>
            )}
            
            {results.length === 0 && !isLoading && hasSearched && (
              <div className="no-results" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(filePath, code);
  console.log('Fixed syntax error!');
} else {
  console.log('Target not found!');
}
