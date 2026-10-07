const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldStr = `                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', flexShrink: 0 }}>
                    <button type="submit" className="search-button">Buscar</button>
                  </div>
                </form>
              </div>`;

const newStr = `                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', flexShrink: 0 }}>
                    <button type="submit" className="search-button">Buscar</button>
                  </div>
                </form>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "10px", fontSize: "0.9rem", color: "var(--text-main)", cursor: "pointer", userSelect: "none", width: "fit-content" }}>
                  <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} style={{ cursor: "pointer" }} />
                  Buscar coincidencia exacta
                </label>
              </div>`;

c = c.replace(oldStr, newStr);
fs.writeFileSync('src/App.jsx', c);
console.log("Patched App.jsx successfully");
