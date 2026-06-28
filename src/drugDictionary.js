export const drugDictionary = [
  {
    category: "Analgésicos y Antipiréticos",
    description: "Medicamentos utilizados para aliviar el dolor y reducir la fiebre.",
    drugs: [
      { name: "Paracetamol", action: "Analgésico y antipirético. Seguro para estómago.", warnings: "No exceder dosis máxima para evitar daño hepático." },
      { name: "Ibuprofeno", action: "Antiinflamatorio no esteroideo (AINE). Alivia dolor, fiebre e inflamación.", warnings: "Tomar con comidas. Precaución en hipertensos o problemas gástricos." },
      { name: "Diclofenac", action: "AINE potente. Útil para dolores articulares y musculares fuertes.", warnings: "Uso corto plazo. Riesgo de irritación gástrica." },
      { name: "Ketorolaco", action: "Analgésico muy potente para dolores severos o postoperatorios.", warnings: "No usar por más de 5 días seguidos." },
      { name: "Dipirona", action: "Analgésico y antiespasmódico.", warnings: "Precaución por riesgo (muy bajo) de agranulocitosis." }
    ]
  },
  {
    category: "Antiácidos y Protectores Gástricos",
    description: "Ayudan a reducir o neutralizar el ácido del estómago, aliviando agruras y gastritis.",
    drugs: [
      { name: "Omeprazol", action: "Inhibidor de la bomba de protones. Reduce la producción de ácido.", warnings: "Tomar en ayunas, 30 minutos antes de desayunar." },
      { name: "Pantoprazol", action: "Similar al Omeprazol, a menudo usado cuando el primero no hace efecto.", warnings: "Tomar en ayunas." },
      { name: "Lansoprazol", action: "Protector gástrico de acción prolongada.", warnings: "Tragar entero, no masticar." },
      { name: "Domperidona", action: "Alivia náuseas y pesadez estomacal acelerando el vaciado gástrico.", warnings: "No usar en problemas cardíacos graves." }
    ]
  },
  {
    category: "Antialérgicos (Antihistamínicos)",
    description: "Bloquean la histamina para aliviar síntomas de alergias como rinitis, picazón y estornudos.",
    drugs: [
      { name: "Loratadina", action: "Antialérgico de segunda generación. Generalmente no da sueño.", warnings: "Uso seguro en la mayoría de las personas." },
      { name: "Cetirizina", action: "Antialérgico eficaz y rápido.", warnings: "Puede causar ligera somnolencia en algunas personas." },
      { name: "Desloratadina", action: "Evolución de la Loratadina, efecto más largo y potente.", warnings: "Tomar una sola vez al día." },
      { name: "Clorfeniramina", action: "Antialérgico clásico y potente. Útil en gripes.", warnings: "Causa mucha somnolencia. Ideal para tomar de noche." }
    ]
  },
  {
    category: "Antihipertensivos",
    description: "Utilizados para controlar y reducir la presión arterial alta.",
    drugs: [
      { name: "Losartán", action: "Relaja los vasos sanguíneos para que la sangre fluya más fácilmente.", warnings: "No suspender bruscamente sin indicación médica." },
      { name: "Enalapril", action: "Inhibidor de la ECA. Baja la presión y protege el riñón.", warnings: "Puede causar una tos seca molesta como efecto secundario común." },
      { name: "Amlodipina", action: "Relajante muscular de los vasos sanguíneos.", warnings: "Puede causar hinchazón leve en los tobillos." }
    ]
  },
  {
    category: "Antibióticos (De uso común)",
    description: "Combaten infecciones bacterianas. NO sirven para virus (como la gripe). Requieren receta.",
    drugs: [
      { name: "Amoxicilina", action: "Penicilina de amplio espectro para infecciones respiratorias y de garganta.", warnings: "Completar todo el esquema aunque te sientas mejor. Alergia a penicilina es contraindicación." },
      { name: "Azitromicina", action: "Antibiótico potente, usualmente recetado en dosis de 3 a 5 días.", warnings: "Tomar lejos de los antiácidos." },
      { name: "Cefalexina", action: "Usado frecuentemente para infecciones de piel o urinarias leves.", warnings: "Respetar horario estricto." }
    ]
  },
  {
    category: "Metabolismo y Tiroides",
    description: "Reguladores hormonales y metabólicos crónicos.",
    drugs: [
      { name: "Levotiroxina", action: "Hormona sintética para tratar el hipotiroidismo.", warnings: "Tomar en ayunas estricta, esperar al menos 40 min para desayunar." },
      { name: "Metformina", action: "Controla el nivel de azúcar en sangre (Diabetes tipo 2 y resistencia a la insulina).", warnings: "Tomar junto con las comidas para evitar malestar estomacal." }
    ]
  },
  {
    category: "Salud Mental y Sueño",
    description: "Medicamentos de control estricto (receta archivada).",
    drugs: [
      { name: "Clonazepam", action: "Ansiolítico y sedante. Ayuda en ataques de pánico.", warnings: "Genera dependencia. No mezclar jamás con alcohol." },
      { name: "Alprazolam", action: "Ansiolítico de acción rápida.", warnings: "Solo usar bajo estricto control psiquiátrico." },
      { name: "Sertralina", action: "Antidepresivo ISRS.", warnings: "El efecto real se nota recién a las 2 o 3 semanas de uso." }
    ]
  }
];
