export const diccionarioAnatomico = [
  {
    id: 'neuro',
    name: 'Sistema Nervioso y Psiquiatría',
    description: 'Sedantes, antidepresivos, antiepilépticos y antimigrañosos.',
    iconPath: '/assets/neuro_icon.png',
    colorHex: '#e0e7ff',
    iconColor: '#4f46e5',
    drugs: [
      {
        name: 'Clonazepam',
        accion: 'Benzodiazepina ansiolítica y anticonvulsivante.',
        indicaciones: 'Trastornos de pánico, ansiedad generalizada, crisis epilépticas.',
        efectos: 'Somnolencia, fatiga, ataxia, dependencia física.',
        contraindicaciones: 'Glaucoma, miastenia gravis, insuficiencia respiratoria.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Alprazolam',
        accion: 'Benzodiazepina de acción corta.',
        indicaciones: 'Trastornos de ansiedad agudos, ataques de pánico.',
        efectos: 'Sedación, alteraciones de la memoria, boca seca.',
        contraindicaciones: 'Miastenia gravis, insuficiencia hepática severa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Sertralina',
        accion: 'Antidepresivo inhibidor selectivo de la recaptación de serotonina (ISRS).',
        indicaciones: 'Depresión mayor, TOC, trastorno de pánico, fobia social.',
        efectos: 'Insomnio, náuseas, disfunción sexual.',
        contraindicaciones: 'Uso con IMAO.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Ergotamina',
        accion: 'Vasoconstrictor craneal (alcaloide del cornezuelo).',
        indicaciones: 'Crisis agudas de migraña con o sin aura.',
        efectos: 'Náuseas, vómitos, espasmos vasculares.',
        contraindicaciones: 'Cardiopatía isquémica, hipertensión severa.',
        embarazo: 'Contraindicado absolutamente.'
      },
      {
        name: 'Sumatriptán',
        accion: 'Agonista selectivo de receptores de serotonina (5-HT1B/1D).',
        indicaciones: 'Alivio rápido de crisis agudas de migraña.',
        efectos: 'Presión en el pecho, mareos, rubor facial.',
        contraindicaciones: 'Antecedentes de infarto, angina de pecho.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Pregabalina',
        accion: 'Análogo del GABA, neuromodulador.',
        indicaciones: 'Dolor neuropático, fibromialgia, trastorno de ansiedad generalizada.',
        efectos: 'Mareos, somnolencia, aumento de peso.',
        contraindicaciones: 'Hipersensibilidad conocida.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Amitriptilina',
        accion: 'Antidepresivo tricíclico.',
        indicaciones: 'Depresión severa, prevención de migrañas, dolor neuropático.',
        efectos: 'Sequedad bucal, estreñimiento, visión borrosa.',
        contraindicaciones: 'Infarto de miocardio reciente.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Zolpidem',
        accion: 'Hipnótico no benzodiazepínico.',
        indicaciones: 'Tratamiento a corto plazo del insomnio severo.',
        efectos: 'Amnesia anterógrada, alucinaciones, somnolencia diurna.',
        contraindicaciones: 'Apnea del sueño, miastenia gravis.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Fluoxetina',
        accion: 'Antidepresivo ISRS.',
        indicaciones: 'Depresión, bulimia nerviosa, TOC.',
        efectos: 'Pérdida de apetito, insomnio, nerviosismo.',
        contraindicaciones: 'Uso con IMAO.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Escitalopram',
        accion: 'Antidepresivo ISRS altamente selectivo.',
        indicaciones: 'Depresión mayor, trastorno de ansiedad generalizada.',
        efectos: 'Náuseas, alteraciones del sueño, disfunción sexual.',
        contraindicaciones: 'Uso con IMAO.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Betahistina',
        accion: 'Análogo de la histamina, mejora la microcirculación en el oído interno.',
        indicaciones: 'Síndrome de Ménière, vértigo, zumbidos (tinnitus).',
        efectos: 'Malestar gástrico, dolor de cabeza.',
        contraindicaciones: 'Úlcera péptica activa, feocromocitoma.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Carbamazepina',
        accion: 'Anticonvulsivante y estabilizador del ánimo.',
        indicaciones: 'Epilepsia, neuralgia del trigémino, trastorno bipolar.',
        efectos: 'Mareos, somnolencia, alteraciones hematológicas.',
        contraindicaciones: 'Bloqueo auriculoventricular, depresión de médula ósea.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Ácido Valproico',
        accion: 'Anticonvulsivante de amplio espectro.',
        indicaciones: 'Epilepsia, manía bipolar, profilaxis de migraña.',
        efectos: 'Aumento de peso, temblor, toxicidad hepática.',
        contraindicaciones: 'Hepatopatía previa.',
        embarazo: 'Alto riesgo de malformaciones congénitas.'
      },
      {
        name: 'Paracetamol',
        accion: 'Analgésico y antipirético de acción central.',
        indicaciones: 'Dolor leve a moderado, cefaleas, fiebre.',
        efectos: 'Generalmente bien tolerado. Hepatotoxicidad en sobredosis.',
        contraindicaciones: 'Insuficiencia hepática grave.',
        embarazo: 'Seguro bajo supervisión médica.'
      },
      {
        name: 'Ibuprofeno',
        accion: 'Antiinflamatorio no esteroideo (AINE).',
        indicaciones: 'Dolor de cabeza tensional, migraña leve, fiebre.',
        efectos: 'Molestias gástricas, acidez.',
        contraindicaciones: 'Úlcera gástrica activa, asma severo.',
        embarazo: 'Consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'reuma',
    name: 'Reumatología y Analgésicos',
    description: 'Analgésicos, antiinflamatorios (AINEs), miorrelajantes y antigotosos.',
    iconPath: '/assets/reuma_icon.png',
    colorHex: '#ffedd5',
    iconColor: '#f97316',
    drugs: [
      {
        name: 'Diclofenac',
        accion: 'Potente antiinflamatorio no esteroideo (AINE).',
        indicaciones: 'Artritis reumatoide, dolor postraumático, dolor agudo.',
        efectos: 'Acidez, riesgo cardiovascular en uso prolongado.',
        contraindicaciones: 'Úlcera gástrica, insuficiencia cardíaca.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Ketorolaco',
        accion: 'AINE con altísima potencia analgésica.',
        indicaciones: 'Dolor agudo moderado a severo (postoperatorio).',
        efectos: 'Hemorragias gástricas, insuficiencia renal.',
        contraindicaciones: 'Uso prolongado mayor a 5 días.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Dipirona',
        accion: 'Analgésico y antiespasmódico potente.',
        indicaciones: 'Fiebre alta rebelde, dolor intenso tipo cólico.',
        efectos: 'Hipotensión, agranulocitosis (muy raro).',
        contraindicaciones: 'Alergia a pirazolonas.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Meloxicam',
        accion: 'AINE inhibidor preferencial de la COX-2.',
        indicaciones: 'Artrosis, artritis reumatoide crónica.',
        efectos: 'Dolor abdominal, dispepsia.',
        contraindicaciones: 'Insuficiencia hepática severa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Piroxicam',
        accion: 'AINE de acción prolongada.',
        indicaciones: 'Enfermedades reumáticas crónicas.',
        efectos: 'Riesgo alto de toxicidad gastrointestinal.',
        contraindicaciones: 'Antecedentes de úlcera sangrante.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Celecoxib',
        accion: 'AINE inhibidor selectivo de la COX-2.',
        indicaciones: 'Dolor articular con menor riesgo gástrico.',
        efectos: 'Aumento de riesgo trombótico cardiovascular.',
        contraindicaciones: 'Enfermedad coronaria establecida, alergia a sulfas.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Ciclobenzaprina',
        accion: 'Relajante muscular de acción central.',
        indicaciones: 'Contracturas musculares agudas, espasmos.',
        efectos: 'Somnolencia pronunciada, sequedad de boca.',
        contraindicaciones: 'Uso simultáneo con antidepresivos IMAO.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Pridinol',
        accion: 'Relajante muscular central y periférico.',
        indicaciones: 'Contracturas musculares, lumbalgias, tortícolis.',
        efectos: 'Boca seca, visión borrosa, palpitaciones.',
        contraindicaciones: 'Glaucoma, hipertrofia prostática.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Alopurinol',
        accion: 'Inhibidor de la xantina oxidasa (reduce ácido úrico).',
        indicaciones: 'Tratamiento crónico de la gota y prevención de cálculos de ácido úrico.',
        efectos: 'Erupciones cutáneas, molestias gástricas.',
        contraindicaciones: 'Ataque agudo de gota (empeora el cuadro inicialmente).',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Colchicina',
        accion: 'Antiinflamatorio específico para cristales de ácido úrico.',
        indicaciones: 'Tratamiento del ataque agudo de gota.',
        efectos: 'Diarrea severa, náuseas, vómitos.',
        contraindicaciones: 'Insuficiencia renal o hepática severa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Tramadol',
        accion: 'Analgésico opioide débil.',
        indicaciones: 'Dolor moderado a severo (ej. artrosis severa, postoperatorio).',
        efectos: 'Mareos, náuseas, estreñimiento, riesgo de dependencia.',
        contraindicaciones: 'Intoxicación aguda con alcohol o psicofármacos.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Paracetamol',
        accion: 'Analgésico y antipirético de acción central.',
        indicaciones: 'Dolor articular leve, osteoartritis inicial.',
        efectos: 'Bien tolerado. Hepatotoxicidad en sobredosis.',
        contraindicaciones: 'Insuficiencia hepática grave.',
        embarazo: 'Seguro bajo supervisión médica.'
      },
      {
        name: 'Ibuprofeno',
        accion: 'Antiinflamatorio no esteroideo (AINE).',
        indicaciones: 'Dolor muscular, golpes, inflamación articular leve.',
        efectos: 'Molestias gástricas, acidez.',
        contraindicaciones: 'Úlcera gástrica activa, asma severo.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Naproxeno',
        accion: 'AINE de larga duración.',
        indicaciones: 'Dolor musculoesquelético, gota aguda, dismenorrea.',
        efectos: 'Irritación gástrica, mareos.',
        contraindicaciones: 'Hipersensibilidad, úlcera péptica activa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'cardio',
    name: 'Cardiología',
    description: 'Antihipertensivos, estatinas, diuréticos y antiarrítmicos.',
    iconPath: '/assets/cardio_icon.png',
    colorHex: '#ffe4e6',
    iconColor: '#e11d48',
    drugs: [
      {
        name: 'Losartán',
        accion: 'Antagonista de receptores de angiotensina II (ARA II).',
        indicaciones: 'Hipertensión arterial, protección renal en diabéticos.',
        efectos: 'Mareos ocasionales, hiperpotasemia.',
        contraindicaciones: 'Insuficiencia hepática grave, embarazo.',
        embarazo: 'Contraindicado absolutamente.'
      },
      {
        name: 'Valsartán',
        accion: 'Antagonista de receptores de angiotensina II (ARA II).',
        indicaciones: 'Hipertensión, insuficiencia cardíaca, post-infarto.',
        efectos: 'Hipotensión, mareos.',
        contraindicaciones: 'Embarazo, insuficiencia hepática severa.',
        embarazo: 'Contraindicado absolutamente.'
      },
      {
        name: 'Enalapril',
        accion: 'Inhibidor de la ECA.',
        indicaciones: 'Hipertensión, insuficiencia cardíaca.',
        efectos: 'Tos seca persistente, hipotensión.',
        contraindicaciones: 'Antecedentes de angioedema.',
        embarazo: 'Contraindicado absolutamente.'
      },
      {
        name: 'Amlodipina',
        accion: 'Bloqueador de canales de calcio.',
        indicaciones: 'Hipertensión, angina de pecho estable.',
        efectos: 'Edema periférico (hinchazón de tobillos), rubor facial.',
        contraindicaciones: 'Hipotensión severa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Atorvastatina',
        accion: 'Hipolipemiante (Estatina).',
        indicaciones: 'Colesterol alto, prevención cardiovascular.',
        efectos: 'Dolor muscular (mialgias), toxicidad hepática rara.',
        contraindicaciones: 'Enfermedad hepática activa.',
        embarazo: 'Contraindicado absolutamente.'
      },
      {
        name: 'Rosuvastatina',
        accion: 'Hipolipemiante (Estatina de alta potencia).',
        indicaciones: 'Hipercolesterolemia severa, prevención de infartos.',
        efectos: 'Mialgias, fatiga.',
        contraindicaciones: 'Enfermedad hepática aguda.',
        embarazo: 'Contraindicado absolutamente.'
      },
      {
        name: 'Bisoprolol',
        accion: 'Betabloqueante cardioselectivo.',
        indicaciones: 'Hipertensión, insuficiencia cardíaca crónica, angina.',
        efectos: 'Bradicardia (latidos lentos), fatiga, extremidades frías.',
        contraindicaciones: 'Asma severo, bloqueo cardíaco avanzado.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Carvedilol',
        accion: 'Betabloqueante no selectivo con acción alfa-bloqueante.',
        indicaciones: 'Insuficiencia cardíaca congestiva, hipertensión.',
        efectos: 'Hipotensión ortostática, mareos.',
        contraindicaciones: 'EPOC severo, asma bronquial.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Furosemida',
        accion: 'Diurético de asa de acción rápida.',
        indicaciones: 'Edemas (retención de líquidos) por fallo cardíaco, renal o hepático.',
        efectos: 'Pérdida de potasio (hipopotasemia), deshidratación.',
        contraindicaciones: 'Insuficiencia renal con anuria (no produce orina).',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Hidroclorotiazida',
        accion: 'Diurético tiazídico.',
        indicaciones: 'Hipertensión arterial (sola o combinada con ARA II).',
        efectos: 'Aumento de ácido úrico, hipopotasemia leve.',
        contraindicaciones: 'Gota severa, anuria.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Aspirina',
        accion: 'Antiagregante plaquetario a dosis bajas.',
        indicaciones: 'Prevención de infartos de miocardio y trombosis.',
        efectos: 'Sangrado digestivo, hematomas.',
        contraindicaciones: 'Úlcera gástrica activa, hemofilia.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Clopidogrel',
        accion: 'Antiagregante plaquetario.',
        indicaciones: 'Prevención de trombosis en pacientes con stents o infartos previos.',
        efectos: 'Sangrados prolongados.',
        contraindicaciones: 'Hemorragia patológica activa (úlcera, sangrado intracraneal).',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Amiodarona',
        accion: 'Antiarrítmico de amplio espectro.',
        indicaciones: 'Fibrilación auricular, arritmias ventriculares graves.',
        efectos: 'Toxicidad pulmonar, alteraciones tiroideas, fotosensibilidad.',
        contraindicaciones: 'Bradicardia sinusal severa, trastornos del yodo.',
        embarazo: 'Contraindicado en general.'
      }
    ]
  },
  {
    id: 'neumo',
    name: 'Respiratorio y Alergias',
    description: 'Broncodilatadores, corticoides y antialérgicos.',
    iconPath: '/assets/neumo_icon.png',
    colorHex: '#e0f2fe',
    iconColor: '#0ea5e9',
    drugs: [
      {
        name: 'Salbutamol',
        accion: 'Broncodilatador de acción rápida.',
        indicaciones: 'Rescate en asma bronquial, crisis de EPOC.',
        efectos: 'Temblores, taquicardia, nerviosismo.',
        contraindicaciones: 'Arritmias graves no controladas.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Budesonida',
        accion: 'Corticoide inhalatorio.',
        indicaciones: 'Tratamiento preventivo y crónico del asma y EPOC.',
        efectos: 'Candidiasis oral (hongos en la boca), disfonía.',
        contraindicaciones: 'Infección pulmonar no tratada.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Fluticasona',
        accion: 'Corticoide tópico o inhalatorio de alta potencia.',
        indicaciones: 'Rinitis alérgica severa, asma crónica.',
        efectos: 'Irritación nasal, hongos orales (si se inhala).',
        contraindicaciones: 'Hipersensibilidad al fármaco.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Loratadina',
        accion: 'Antihistamínico de segunda generación.',
        indicaciones: 'Alergias, rinitis, urticaria.',
        efectos: 'Generalmente no produce sueño. Sequedad bucal leve.',
        contraindicaciones: 'Insuficiencia hepática grave (ajustar dosis).',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Cetirizina',
        accion: 'Antihistamínico potente de segunda generación.',
        indicaciones: 'Alergias severas, picazón extrema.',
        efectos: 'Puede producir leve somnolencia en algunas personas.',
        contraindicaciones: 'Insuficiencia renal severa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Desloratadina',
        accion: 'Antihistamínico de acción prolongada.',
        indicaciones: 'Alergias crónicas, rinitis perenne.',
        efectos: 'Sequedad de boca, dolor de cabeza.',
        contraindicaciones: 'Hipersensibilidad conocida.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Clorfeniramina',
        accion: 'Antihistamínico de primera generación.',
        indicaciones: 'Resfriados, gripe, alergias agudas nocturnas.',
        efectos: 'Somnolencia intensa, letargo, sequedad extrema.',
        contraindicaciones: 'Glaucoma, hipertrofia prostática.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Bromhexina',
        accion: 'Mucolítico y expectorante.',
        indicaciones: 'Tos con flema espesa, bronquitis aguda.',
        efectos: 'Molestias gastrointestinales.',
        contraindicaciones: 'Úlcera gástrica activa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Ambroxol',
        accion: 'Mucolítico potente.',
        indicaciones: 'Enfermedades respiratorias con secreciones densas.',
        efectos: 'Náuseas leves.',
        contraindicaciones: 'Primer trimestre de embarazo.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Dextrometorfano',
        accion: 'Antitusivo de acción central.',
        indicaciones: 'Tos seca irritativa (sin flema).',
        efectos: 'Mareos, somnolencia, confusión en dosis altas.',
        contraindicaciones: 'Tos productiva (con flema), asma, uso de IMAO.',
        embarazo: 'Consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'gastro',
    name: 'Gastroenterología',
    description: 'Antiácidos, digestivos, antiespasmódicos y laxantes.',
    iconPath: '/assets/gastro_icon.png',
    colorHex: '#fef3c7',
    iconColor: '#d97706',
    drugs: [
      {
        name: 'Omeprazol',
        accion: 'Inhibidor de la bomba de protones (IBP).',
        indicaciones: 'Gastritis, reflujo gastroesofágico, úlceras.',
        efectos: 'Dolor de cabeza, alteraciones del ritmo intestinal.',
        contraindicaciones: 'Hipersensibilidad.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Pantoprazol',
        accion: 'IBP de nueva generación con menos interacciones.',
        indicaciones: 'Reflujo severo, pacientes polimedicados.',
        efectos: 'Náuseas, meteorismo.',
        contraindicaciones: 'Disfunción hepática severa (requiere ajuste).',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Esomeprazol',
        accion: 'IBP de máxima potencia.',
        indicaciones: 'Esofagitis erosiva por reflujo.',
        efectos: 'Diarrea, dolor abdominal.',
        contraindicaciones: 'Uso conjunto con Atazanavir.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Domperidona',
        accion: 'Antiemético y procinético.',
        indicaciones: 'Náuseas, vómitos, digestión lenta.',
        efectos: 'Aumento de prolactina, riesgo cardíaco en dosis altas.',
        contraindicaciones: 'Hemorragia gástrica, arritmias.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Metoclopramida',
        accion: 'Antiemético de acción central y periférica.',
        indicaciones: 'Vómitos severos, vaciamiento gástrico retardado.',
        efectos: 'Somnolencia, movimientos involuntarios (extrapiramidales).',
        contraindicaciones: 'Obstrucción intestinal, epilepsia.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Hioscina (Buscapina)',
        accion: 'Antiespasmódico anticolinérgico.',
        indicaciones: 'Cólicos intestinales, biliares o menstruales.',
        efectos: 'Boca seca, visión borrosa, taquicardia.',
        contraindicaciones: 'Glaucoma, hipertrofia prostática.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Trimebutina',
        accion: 'Regulador de la motilidad intestinal.',
        indicaciones: 'Síndrome de colon irritable, espasmos digestivos.',
        efectos: 'Fatiga, sequedad bucal.',
        contraindicaciones: 'Embarazo primer trimestre.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Loperamida',
        accion: 'Antidiarreico.',
        indicaciones: 'Diarrea aguda inespecífica.',
        efectos: 'Estreñimiento severo, distensión abdominal.',
        contraindicaciones: 'Diarrea infecciosa bacteriana con fiebre alta.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Bisacodilo',
        accion: 'Laxante estimulante.',
        indicaciones: 'Estreñimiento ocasional.',
        efectos: 'Dolores de tipo cólico, diarrea.',
        contraindicaciones: 'Obstrucción intestinal, apendicitis.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Lactulosa',
        accion: 'Laxante osmótico.',
        indicaciones: 'Estreñimiento crónico, encefalopatía hepática.',
        efectos: 'Gases, flatulencia excesiva.',
        contraindicaciones: 'Galactosemia.',
        embarazo: 'Consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'metabolico',
    name: 'Metabolismo y Endocrinología',
    description: 'Diabetes, tiroides, vitaminas y metabolismo.',
    iconPath: '/assets/metabolico_icon.png',
    colorHex: '#ecfdf5',
    iconColor: '#059669',
    drugs: [
      {
        name: 'Metformina',
        accion: 'Antidiabético oral (Biguanida).',
        indicaciones: 'Diabetes Tipo 2, resistencia a la insulina.',
        efectos: 'Diarrea, malestar estomacal (transitorios).',
        contraindicaciones: 'Insuficiencia renal crónica.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Empagliflozina',
        accion: 'Antidiabético (Inhibidor de SGLT2) elimina glucosa por orina.',
        indicaciones: 'Diabetes Tipo 2, protección cardíaca y renal.',
        efectos: 'Infecciones urinarias o genitales (hongos).',
        contraindicaciones: 'Diabetes Tipo 1, cetoacidosis.',
        embarazo: 'Contraindicado en segundo y tercer trimestre.'
      },
      {
        name: 'Sitagliptina',
        accion: 'Antidiabético (Inhibidor DPP-4).',
        indicaciones: 'Diabetes Tipo 2.',
        efectos: 'Dolor articular leve, dolor de cabeza.',
        contraindicaciones: 'Antecedentes de pancreatitis.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Glibenclamida',
        accion: 'Antidiabético (Sulfonilurea) estimula secreción de insulina.',
        indicaciones: 'Diabetes Tipo 2 no controlable con dieta.',
        efectos: 'Hipoglucemia severa, aumento de peso.',
        contraindicaciones: 'Insuficiencia hepática o renal severa.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Levotiroxina',
        accion: 'Hormona tiroidea sintética.',
        indicaciones: 'Hipotiroidismo crónico.',
        efectos: 'Taquicardia, ansiedad (solo en sobredosis).',
        contraindicaciones: 'Infarto agudo reciente.',
        embarazo: 'Seguro y vital durante el embarazo.'
      },
      {
        name: 'Metimazol',
        accion: 'Fármaco antitiroideo.',
        indicaciones: 'Hipertiroidismo (Enfermedad de Graves).',
        efectos: 'Alteraciones del gusto, problemas hepáticos, reducción de glóbulos blancos.',
        contraindicaciones: 'Hipersensibilidad.',
        embarazo: 'Requiere extremo cuidado médico.'
      }
    ]
  },
  {
    id: 'infeccioso',
    name: 'Infecciosos y Piel',
    description: 'Antibióticos, antivirales y antifúngicos.',
    iconPath: '/assets/infeccioso_icon.png',
    colorHex: '#fce7f3',
    iconColor: '#db2777',
    drugs: [
      {
        name: 'Amoxicilina',
        accion: 'Antibiótico betalactámico.',
        indicaciones: 'Infecciones respiratorias, de oído y dentales.',
        efectos: 'Diarrea, erupciones cutáneas.',
        contraindicaciones: 'Alergia a la penicilina.',
        embarazo: 'Generalmente seguro bajo supervisión.'
      },
      {
        name: 'Amoxicilina + Ácido Clavulánico',
        accion: 'Antibiótico de amplio espectro protegido.',
        indicaciones: 'Infecciones bacterianas resistentes, sinusitis, mordeduras.',
        efectos: 'Diarrea muy frecuente, toxicidad hepática rara.',
        contraindicaciones: 'Alergia a penicilinas, antecedentes de ictericia por el fármaco.',
        embarazo: 'Generalmente seguro bajo supervisión.'
      },
      {
        name: 'Azitromicina',
        accion: 'Antibiótico macrólido.',
        indicaciones: 'Infecciones atípicas, bronquitis, faringitis en alérgicos a penicilina.',
        efectos: 'Dolor abdominal, náuseas.',
        contraindicaciones: 'Alteraciones hepáticas severas.',
        embarazo: 'Generalmente seguro bajo supervisión.'
      },
      {
        name: 'Cefalexina',
        accion: 'Antibiótico cefalosporínico.',
        indicaciones: 'Infecciones de piel, heridas, vías urinarias leves.',
        efectos: 'Malestar digestivo, infecciones secundarias por hongos.',
        contraindicaciones: 'Hipersensibilidad severa a penicilinas o cefalosporinas.',
        embarazo: 'Generalmente seguro bajo supervisión.'
      },
      {
        name: 'Ciprofloxacina',
        accion: 'Antibiótico fluoroquinolona.',
        indicaciones: 'Infecciones urinarias complicadas, infecciones intestinales severas.',
        efectos: 'Dolor en tendones, mareos, fotosensibilidad.',
        contraindicaciones: 'Menores de 18 años, embarazo.',
        embarazo: 'Contraindicado.'
      },
      {
        name: 'Levofloxacina',
        accion: 'Antibiótico fluoroquinolona respiratorio.',
        indicaciones: 'Neumonía, sinusitis aguda severa.',
        efectos: 'Riesgo de rotura de tendón de Aquiles, insomnio.',
        contraindicaciones: 'Epilepsia, embarazo.',
        embarazo: 'Contraindicado.'
      },
      {
        name: 'Fluconazol',
        accion: 'Antifúngico oral.',
        indicaciones: 'Candidiasis vaginal persistente, hongos en uñas (onicomicosis).',
        efectos: 'Dolor de cabeza, malestar estomacal.',
        contraindicaciones: 'Enfermedad hepática activa.',
        embarazo: 'Contraindicado.'
      },
      {
        name: 'Ketoconazol',
        accion: 'Antifúngico de amplio espectro (tópico/shampoo).',
        indicaciones: 'Caspa severa, dermatitis seborreica, tiña.',
        efectos: 'Irritación local.',
        contraindicaciones: 'Hipersensibilidad.',
        embarazo: 'Consultar previamente con un profesional médico.'
      },
      {
        name: 'Aciclovir',
        accion: 'Antiviral.',
        indicaciones: 'Herpes labial, herpes zóster, varicela.',
        efectos: 'Alteración renal (con mala hidratación), náuseas.',
        contraindicaciones: 'Hipersensibilidad.',
        embarazo: 'Consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'oftalmo',
    name: 'Oftalmología y Otorrino',
    description: 'Gotas oftálmicas, lágrimas artificiales y gotas óticas.',
    iconPath: '/assets/oftalmo_icon.png',
    colorHex: '#f3e8ff',
    iconColor: '#9333ea',
    drugs: [
      {
        name: 'Lágrimas Artificiales (Hialuronato)',
        accion: 'Lubricante ocular.',
        indicaciones: 'Ojo seco, irritación por pantallas, uso de lentes de contacto.',
        efectos: 'Visión borrosa transitoria al aplicar.',
        contraindicaciones: 'Hipersensibilidad a los componentes.',
        embarazo: 'Seguro.'
      },
      {
        name: 'Tobramicina',
        accion: 'Antibiótico oftálmico.',
        indicaciones: 'Conjuntivitis bacteriana, infecciones oculares superficiales.',
        efectos: 'Ardor temporal en el ojo.',
        contraindicaciones: 'Infecciones virales o micóticas del ojo.',
        embarazo: 'Consultar previamente.'
      },
      {
        name: 'Nafazolina',
        accion: 'Descongestivo ocular.',
        indicaciones: 'Ojo rojo, irritación ocular leve (alergias, humo).',
        efectos: 'Dilatación pupilar leve, rebote si se usa en exceso.',
        contraindicaciones: 'Glaucoma de ángulo estrecho.',
        embarazo: 'Consultar previamente.'
      }
    ]
  },
  {
    id: 'gineco',
    name: 'Ginecología y Urología',
    description: 'Anticonceptivos, tratamientos hormonales y urológicos.',
    iconPath: '/assets/gineco_icon.png',
    colorHex: '#fce7f3',
    iconColor: '#be185d',
    drugs: [
      {
        name: 'Drospirenona + Etinilestradiol',
        accion: 'Anticonceptivo oral combinado.',
        indicaciones: 'Prevención del embarazo, síndrome premenstrual, acné hormonal.',
        efectos: 'Sensibilidad mamaria, náuseas, cambios de humor.',
        contraindicaciones: 'Antecedentes de trombosis, fumadoras mayores de 35 años.',
        embarazo: 'Contraindicado.'
      },
      {
        name: 'Levonorgestrel',
        accion: 'Progestágeno (Anticonceptivo de emergencia).',
        indicaciones: 'Anticoncepción de urgencia post-coital (píldora del día después).',
        efectos: 'Sangrado irregular, náuseas, dolor pélvico.',
        contraindicaciones: 'No es método de uso regular.',
        embarazo: 'Contraindicado.'
      },
      {
        name: 'Sildenafil',
        accion: 'Inhibidor de la fosfodiesterasa tipo 5.',
        indicaciones: 'Disfunción eréctil, hipertensión pulmonar.',
        efectos: 'Dolor de cabeza, rubor facial, visión azulada.',
        contraindicaciones: 'Uso concomitante con nitratos (riesgo de hipotensión fatal).',
        embarazo: 'No aplica.'
      },
      {
        name: 'Clotrimazol Óvulos',
        accion: 'Antifúngico de uso tópico/vaginal.',
        indicaciones: 'Candidiasis vaginal (infección por hongos).',
        efectos: 'Irritación local leve.',
        contraindicaciones: 'Hipersensibilidad.',
        embarazo: 'Consultar previamente.'
      }
    ]
  }
];
