import React from 'react';
import './AnatomyMap.css';

const AnatomyMap = ({ onPartClick, selectedPart }) => {
  return (
    <div className="anatomy-map-container">
      <svg 
        viewBox="0 0 200 400" 
        className="anatomy-svg" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Glow effect filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cuerpo Base (Skin / Derma) - Representa todo el contorno */}
        <path 
          className={`body-part ${selectedPart === 'derma' ? 'active' : ''}`}
          onClick={() => onPartClick('derma')}
          d="M100 20 C 120 20, 130 50, 130 70 
             C 140 75, 170 80, 180 120 C 185 140, 170 180, 170 200 
             C 165 210, 155 210, 150 200 C 145 180, 140 150, 135 140 
             C 130 170, 135 230, 130 260 
             C 130 310, 135 360, 135 380 C 135 390, 115 390, 110 380
             C 105 340, 105 280, 100 250 
             C 95 280, 95 340, 90 380 C 85 390, 65 390, 65 380 
             C 65 360, 70 310, 70 260 
             C 65 230, 70 170, 65 140 C 60 150, 55 180, 50 200 
             C 45 210, 35 210, 30 200 C 30 180, 15 140, 20 120 
             C 30 80, 60 75, 70 70 
             C 70 50, 80 20, 100 20 Z"
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Cabeza (Neuro) */}
        <g 
          className={`body-part overlay-part ${selectedPart === 'neuro' ? 'active' : ''}`}
          onClick={() => onPartClick('neuro')}
        >
          <circle cx="100" cy="45" r="22" className="part-shape" />
          <text x="100" y="50" className="part-label" textAnchor="middle" fontSize="16">🧠</text>
        </g>

        {/* Pecho (Resp / Cardio) */}
        <g 
          className={`body-part overlay-part ${selectedPart === 'neumo' ? 'active' : ''}`}
          onClick={() => onPartClick('neumo')}
        >
          <path d="M75 90 Q100 110 125 90 Q125 115 100 135 Q75 115 75 90 Z" className="part-shape" />
          <text x="100" y="115" className="part-label" textAnchor="middle" fontSize="16">🫁</text>
        </g>

        {/* Estómago (Gastro) */}
        <g 
          className={`body-part overlay-part ${selectedPart === 'gastro' ? 'active' : ''}`}
          onClick={() => onPartClick('gastro')}
        >
          <ellipse cx="100" cy="160" rx="20" ry="18" className="part-shape" />
          <text x="100" y="165" className="part-label" textAnchor="middle" fontSize="16">🩺</text>
        </g>

        {/* Articulaciones (Reuma - Rodillas/Codos) */}
        <g 
          className={`body-part overlay-part ${selectedPart === 'reuma' ? 'active' : ''}`}
          onClick={() => onPartClick('reuma')}
        >
          {/* Codos */}
          <circle cx="35" cy="140" r="12" className="part-shape" />
          <circle cx="165" cy="140" r="12" className="part-shape" />
          {/* Rodillas */}
          <circle cx="75" cy="285" r="14" className="part-shape" />
          <circle cx="125" cy="285" r="14" className="part-shape" />
          <text x="75" y="290" className="part-label" textAnchor="middle" fontSize="14">🦵</text>
          <text x="125" y="290" className="part-label" textAnchor="middle" fontSize="14">🦵</text>
        </g>
      </svg>
    </div>
  );
};

export default AnatomyMap;
