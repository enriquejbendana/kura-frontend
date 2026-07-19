export const diccionarioAnatomico = [
  {
    id: 'neuro',
    name: 'Sistema Nervioso y Psiquiatría',
    description: 'Sedantes, anticonvulsivantes y antidepresivos.',
    iconPath: '/assets/neuro_icon.png',
    colorHex: '#e0e7ff',
    iconColor: '#4f46e5',
    drugs: [
      {
        name: 'Clonazepam',
        accion: 'Agente ansiolítico, anticonvulsivante y miorrelajante perteneciente a la familia de las benzodiazepinas. Deprime el SNC al unirse a receptores GABA-A.',
        indicaciones: 'Indicado como terapia de primera línea en trastornos de pánico (con o sin agorafobia), trastornos de ansiedad generalizada, crisis epilépticas (ausencias, mioclonías) y síndromes de piernas inquietas.',
        efectos: 'Somnolencia diurna, fatiga, debilidad muscular, mareos, ataxia (problemas de coordinación), alteración de la concentración y memoria anterógrada. Riesgo de dependencia física y psicológica.',
        contraindicaciones: 'Glaucoma de ángulo cerrado, miastenia gravis, insuficiencia respiratoria grave (EPOC avanzado), apnea del sueño, insuficiencia hepática grave y antecedentes de abuso de sustancias.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Alprazolam',
        accion: 'Benzodiazepina de acción corta/intermedia con potentes efectos ansiolíticos. Facilita la acción inhibidora del neurotransmisor GABA en el cerebro.',
        indicaciones: 'Tratamiento agudo de los trastornos de ansiedad, ataques de pánico repentinos y ansiedad asociada a síntomas depresivos. No recomendado para uso crónico prolongado.',
        efectos: 'Sedación pronunciada, letargo, alteraciones de la memoria, boca seca, estreñimiento. Puede generar un rápido desarrollo de tolerancia y alta dependencia.',
        contraindicaciones: 'Hipersensibilidad a las benzodiazepinas, miastenia gravis, insuficiencia hepática y respiratoria severa. No consumir simultáneamente con alcohol u otros depresores del SNC.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Ergotamina',
        accion: 'Alcaloide del cornezuelo de centeno. Provoca vasoconstricción directa del lecho vascular craneal, reduciendo la pulsación responsable del dolor de la migraña.',
        indicaciones: 'Tratamiento agudo de las crisis de migraña con o sin aura y cefaleas en racimos. Especialmente útil en dolores de cabeza intensos y pulsátiles.',
        efectos: 'Náuseas y vómitos son muy frecuentes. El uso excesivo puede causar "ergotismo" (espasmos vasculares severos) y dolor de cabeza de rebote.',
        contraindicaciones: 'Enfermedad vascular periférica, cardiopatía isquémica, hipertensión severa, embarazo y lactancia.',
        embarazo: 'Absolutamente contraindicado en el embarazo. Puede causar contracciones uterinas y aborto.'
      },
      {
        name: 'Sumatriptán',
        accion: 'Agonista selectivo de los receptores de serotonina (5-HT1B/1D) en los vasos sanguíneos intracraneales. Produce constricción de los vasos dilatados durante la migraña.',
        indicaciones: 'Alivio sintomático rápido de las crisis agudas de migraña (con o sin aura). No está indicado como tratamiento preventivo.',
        efectos: 'Sensación de hormigueo, pesadez o presión en el pecho y cuello, mareos, debilidad temporal y rubor facial.',
        contraindicaciones: 'Antecedentes de infarto de miocardio, angina de pecho, hipertensión arterial no controlada y uso reciente de ergotamina.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Sertralina',
        accion: 'Antidepresivo inhibidor selectivo de la recaptación de serotonina (ISRS). Aumenta los niveles de serotonina disponibles en el espacio sináptico del cerebro.',
        indicaciones: 'Tratamiento de la depresión mayor, trastorno obsesivo-compulsivo (TOC), trastorno de pánico, trastorno de estrés postraumático (TEPT) y fobia social.',
        efectos: 'Frecuentemente causa insomnio o somnolencia, náuseas, pérdida de apetito, temblor leve, sequedad bucal y disfunción sexual (retraso eyaculatorio, anorgasmia). El efecto terapéutico completo demora 3-4 semanas.',
        contraindicaciones: 'Uso concomitante o reciente (en los últimos 14 días) con inhibidores de la monoaminooxidasa (IMAO) debido al riesgo de síndrome serotoninérgico fatal.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'reuma',
    name: 'Reumatología y Analgésicos',
    description: 'Analgésicos, antiinflamatorios (AINEs) y miorrelajantes musculares.',
    iconPath: '/assets/reuma_icon.png',
    colorHex: '#ffedd5',
    iconColor: '#f97316',
    drugs: [
      {
        name: 'Paracetamol',
        accion: 'Analgésico y antipirético de acción central. Actúa inhibiendo la síntesis de prostaglandinas a nivel del sistema nervioso central.',
        indicaciones: 'Indicado para el tratamiento sintomático del dolor de intensidad leve a moderada, como cefaleas, dolores musculares, dolores de espalda, dolor dental y alivio de estados febriles.',
        efectos: 'En general es bien tolerado. Raramente puede producir reacciones cutáneas alérgicas (erupciones, prurito), alteraciones sanguíneas o malestar general. A dosis muy elevadas existe riesgo grave de hepatotoxicidad.',
        contraindicaciones: 'Contraindicado en pacientes con hipersensibilidad conocida al paracetamol, insuficiencia hepática grave, hepatitis vírica aguda y en pacientes con alcoholismo crónico.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Ibuprofeno',
        accion: 'Antiinflamatorio no esteroideo (AINE). Posee potentes propiedades analgésicas, antipiréticas y antiinflamatorias al inhibir la enzima ciclooxigenasa (COX) periférica.',
        indicaciones: 'Tratamiento del dolor leve a moderado de origen articular, muscular o dental. Eficaz en el tratamiento de la dismenorrea primaria, cuadros inflamatorios agudos y reducción de la fiebre.',
        efectos: 'Frecuentemente causa molestias gastrointestinales como dispepsia, ardor de estómago, náuseas y vómitos. El uso prolongado aumenta el riesgo de úlceras pépticas, sangrado gástrico y mareos.',
        contraindicaciones: 'Antecedentes de úlcera péptica activa o hemorragia gastrointestinal, insuficiencia cardíaca grave, insuficiencia renal o hepática severa, y pacientes con asma exacerbado por aspirina u otros AINEs.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Diclofenac',
        accion: 'Antiinflamatorio no esteroideo (AINE) con potente actividad analgésica y antiinflamatoria sistémica. Inhibe la biosíntesis de prostaglandinas.',
        indicaciones: 'Manejo agudo y crónico de artritis reumatoide, osteoartritis, espondilitis anquilosante, dolor postraumático, cólico renal, ataques agudos de gota y cuadros de inflamación severa.',
        efectos: 'Dolor epigástrico, náuseas, diarrea, cefaleas, mareos. Riesgo aumentado de eventos cardiovasculares trombóticos y toxicidad gastrointestinal con uso prolongado a dosis altas.',
        contraindicaciones: 'Hipersensibilidad a los AINEs, úlcera gástrica o duodenal activa, insuficiencia cardíaca congestiva (clases II-IV NYHA), cardiopatía isquémica y enfermedad arterial periférica.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Ketorolaco',
        accion: 'AINE con potente y rápida acción analgésica sistémica, pero con actividad antiinflamatoria moderada. Bloquea la síntesis de prostaglandinas.',
        indicaciones: 'Tratamiento a corto plazo (máximo 5 días) del dolor agudo de intensidad moderada a severa, especialmente en el contexto postoperatorio o traumatológico.',
        efectos: 'Alto riesgo de toxicidad gastrointestinal severa, hemorragias digestivas, insuficiencia renal aguda, retención de líquidos, mareos y dolor de cabeza intenso.',
        contraindicaciones: 'Uso prolongado (>5 días). Antecedentes de úlcera péptica, sangrado gastrointestinal, insuficiencia renal moderada a severa, diátesis hemorrágica y en el preoperatorio inmediato.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Dipirona',
        accion: 'Analgésico, antipirético y potente antiespasmódico del grupo de las pirazolonas. Actúa a nivel central y periférico.',
        indicaciones: 'Tratamiento del dolor agudo intenso, dolores de tipo cólico (biliar, renal), dolor tumoral, y como antipirético de rescate en fiebre alta que no responde a otras medidas convencionales.',
        efectos: 'Reacciones de hipersensibilidad cutánea, hipotensión arterial transitoria. En casos muy raros pero graves puede producir agranulocitosis (disminución de glóbulos blancos) de origen inmunoalérgico.',
        contraindicaciones: 'Alergia conocida a las pirazolonas, porfiria hepática aguda, déficit de glucosa-6-fosfato deshidrogenasa, y alteraciones previas de la médula ósea o sistema hematopoyético.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'cardio',
    name: 'Cardiología',
    description: 'Antihipertensivos, estatinas para el colesterol, diuréticos y antiarrítmicos.',
    iconPath: '/assets/cardio_icon.png',
    colorHex: '#ffe4e6',
    iconColor: '#e11d48',
    drugs: [
      {
        name: 'Losartán',
        accion: 'Agente antihipertensivo antagonista de los receptores de angiotensina II (ARA II). Produce vasodilatación y reduce la secreción de aldosterona.',
        indicaciones: 'Control a largo plazo de la hipertensión arterial, reducción del riesgo de accidente cerebrovascular en pacientes con hipertrofia ventricular izquierda, y protección renal en nefropatía diabética tipo 2.',
        efectos: 'Suele ser excelentemente tolerado. Puede causar mareos ocasionales, hipotensión ortostática, fatiga y, en menor frecuencia, niveles elevados de potasio en sangre (hiperpotasemia).',
        contraindicaciones: 'Insuficiencia hepática grave. No debe utilizarse en combinación con medicamentos que contengan aliskireno en pacientes diabéticos.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Enalapril',
        accion: 'Antihipertensivo perteneciente al grupo de los inhibidores de la enzima convertidora de angiotensina (IECA). Disminuye la resistencia vascular periférica.',
        indicaciones: 'Tratamiento de la hipertensión arterial en todos sus grados, insuficiencia cardíaca sintomática y prevención de insuficiencia cardíaca en pacientes con disfunción ventricular izquierda asintomática.',
        efectos: 'El efecto secundario más característico es una tos seca persistente y no productiva. También puede inducir hipotensión pronunciada (especialmente en la primera dosis), mareos y alteraciones del gusto.',
        contraindicaciones: 'Antecedentes previos de angioedema (hinchazón de cara, labios, lengua o glotis) asociado a tratamientos previos con inhibidores de la ECA. Estenosis bilateral de las arterias renales.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Amlodipina',
        accion: 'Antihipertensivo y antianginoso del grupo de los bloqueadores de los canales de calcio dihidropiridínicos. Relaja y ensancha las paredes musculares de los vasos sanguíneos.',
        indicaciones: 'Hipertensión arterial esencial y tratamiento profiláctico de la angina de pecho crónica estable y angina vasoespástica (de Prinzmetal).',
        efectos: 'Frecuentemente causa edema periférico (hinchazón de tobillos y piernas sin retención de líquidos sistémica), rubor facial, dolores de cabeza, palpitaciones y sensación de calor.',
        contraindicaciones: 'Hipotensión severa preexistente, shock cardiogénico, obstrucción del tracto de salida del ventrículo izquierdo e insuficiencia cardíaca inestable tras un infarto agudo de miocardio.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Atorvastatina',
        accion: 'Fármaco hipolipemiante, inhibidor competitivo y selectivo de la HMG-CoA reductasa. Reduce drásticamente la síntesis de colesterol a nivel hepático.',
        indicaciones: 'Tratamiento de la hipercolesterolemia primaria y prevención de eventos cardiovasculares (infarto de miocardio, ACV) en pacientes adultos con factores de riesgo múltiples o enfermedad cardíaca establecida.',
        efectos: 'Mialgias (dolores musculares), dolor en las articulaciones, trastornos gastrointestinales (estreñimiento, flatulencia). Rara vez puede causar miopatía grave o elevación significativa de las enzimas hepáticas.',
        contraindicaciones: 'Pacientes con enfermedad hepática activa o con elevaciones persistentes e inexplicables de las transaminasas. Hipersensibilidad a las estatinas.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'gastro',
    name: 'Gastroenterología',
    description: 'Protectores gástricos, digestivos, antiespasmódicos, laxantes y antidiarreicos.',
    iconPath: '/assets/gastro_icon.png',
    colorHex: '#fef3c7',
    iconColor: '#d97706',
    drugs: [
      {
        name: 'Omeprazol',
        accion: 'Agente antisecretor gástrico, inhibidor específico de la bomba de protones (IBP) en la célula parietal del estómago. Detiene de forma prolongada la producción de ácido gástrico.',
        indicaciones: 'Cicatrización de úlceras duodenales y gástricas benignas, tratamiento de la esofagitis por reflujo (ERGE), profilaxis de úlceras por AINEs y como parte de la terapia de erradicación de Helicobacter pylori.',
        efectos: 'Suele ser muy seguro, pero puede causar dolor de cabeza, dolor abdominal inespecífico, diarrea, estreñimiento o flatulencia. Su uso crónico a muy largo plazo se asocia a déficit de vitamina B12 y riesgo de fracturas óseas.',
        contraindicaciones: 'Hipersensibilidad demostrada. No debe administrarse conjuntamente con nelfinavir o clopidogrel (puede restar eficacia a este último).',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Pantoprazol',
        accion: 'Inhibidor de la bomba de protones de nueva generación. Logra una reducción rápida y duradera del ácido gástrico con menos interacciones farmacológicas a nivel hepático que el omeprazol.',
        indicaciones: 'Tratamiento del reflujo gastroesofágico severo, úlceras pépticas crónicas y síndrome de Zollinger-Ellison. Recomendado para pacientes polimedicados por su bajo perfil de interacciones.',
        efectos: 'Cefalea, mareos ocasionales, alteraciones gastrointestinales leves (náuseas, vómitos, meteorismo, diarrea). Rara vez se observan reacciones alérgicas cutáneas.',
        contraindicaciones: 'Pacientes con disfunción hepática severa requieren ajuste de dosis. Hipersensibilidad al principio activo o a los benzimidazoles sustituidos.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Lansoprazol',
        accion: 'Potente inhibidor de la secreción ácida gástrica (IBP) de acción prolongada y muy alta eficacia cicatrizante en mucosas erosionadas.',
        indicaciones: 'Manejo intensivo del reflujo ácido, prevención de úlceras sangrantes en pacientes de alto riesgo y tratamiento agudo de esofagitis erosiva severa. Las cápsulas no deben masticarse ni triturarse.',
        efectos: 'Alteraciones del ritmo intestinal (predominantemente diarrea o heces sueltas), dolor abdominal, sequedad bucal y, ocasionalmente, elevación transitoria de enzimas hepáticas.',
        contraindicaciones: 'Alergia conocida al lansoprazol. Uso simultáneo con atazanavir (medicamento antiviral).',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Domperidona',
        accion: 'Fármaco antiemético y procinético gastrointestinal. Bloquea los receptores dopaminérgicos periféricos, acelerando el vaciamiento gástrico y aumentando la presión del esfínter esofágico inferior.',
        indicaciones: 'Alivio agudo de los síntomas de náuseas y vómitos de cualquier etiología, sensación de plenitud gástrica postprandial, distensión abdominal y regurgitación de contenido gástrico.',
        efectos: 'Sequedad de boca y alteraciones endocrinas transitorias (aumento de prolactina que puede causar galactorrea o amenorrea). En dosis excesivamente altas existe un riesgo raro pero severo de arritmias cardíacas (prolongación del intervalo QT).',
        contraindicaciones: 'Prolactinoma (tumor pituitario), sospecha de hemorragia o perforación gastrointestinal mecánica, insuficiencia hepática moderada/grave, y pacientes con prolongación existente de los intervalos de conducción cardíaca.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'neumo',
    name: 'Respiratorio y Alergias',
    description: 'Broncodilatadores, antialérgicos, corticoides y tratamientos para el asma.',
    iconPath: '/assets/neumo_icon.png',
    colorHex: '#e0f2fe',
    iconColor: '#0ea5e9',
    drugs: [
      {
        name: 'Salbutamol',
        accion: 'Broncodilatador simpaticomimético de acción rápida y corta duración. Actúa como agonista selectivo de los receptores beta-2 adrenérgicos en el músculo liso bronquial.',
        indicaciones: 'Medicamento de rescate vital para el alivio inmediato del broncoespasmo agudo en crisis de asma bronquial, bronquitis crónica, enfisema y enfermedad pulmonar obstructiva crónica (EPOC).',
        efectos: 'Temblores finos en las manos, taquicardia refleja, palpitaciones, nerviosismo generalizado, cefaleas e hipopotasemia (niveles bajos de potasio) si se usan dosis masivas repetidas.',
        contraindicaciones: 'Hipersensibilidad severa al salbutamol. Se requiere extrema precaución en pacientes con cardiopatía isquémica severa, arritmias graves no controladas o tirotoxicosis activa.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Loratadina',
        accion: 'Antihistamínico tricíclico de segunda generación. Bloquea de manera potente, duradera y selectiva los receptores periféricos H1 de la histamina, sin cruzar la barrera hematoencefálica (no deprime el SNC).',
        indicaciones: 'Alivio rápido de los síntomas asociados a la rinitis alérgica estacional o perenne (estornudos, rinorrea, picazón nasal y ocular) y tratamiento de la urticaria crónica idiopática.',
        efectos: 'Presenta un excelente perfil de tolerabilidad. Rara vez puede provocar somnolencia leve (a diferencia de los antihistamínicos clásicos), sequedad de boca, fatiga o dolor de cabeza transitorio.',
        contraindicaciones: 'Hipersensibilidad o idiosincrasia a la loratadina. Se debe ajustar la dosis en pacientes con insuficiencia hepática grave ya que su metabolismo se ve comprometido.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Cetirizina',
        accion: 'Antagonista potente y muy selectivo de los receptores H1 de histamina (segunda generación). Tiene también propiedades antialérgicas al inhibir la migración de células inflamatorias.',
        indicaciones: 'Tratamiento sintomático prolongado de rinitis alérgica perenne, fiebre del heno, conjuntivitis alérgica estacional, y urticaria aguda o crónica acompañadas de picor severo.',
        efectos: 'A pesar de ser de segunda generación, puede causar un grado de somnolencia mayor que la loratadina en pacientes susceptibles. También se reporta mareos, faringitis y fatiga vespertina.',
        contraindicaciones: 'Pacientes con insuficiencia renal en etapa terminal o que se encuentren bajo diálisis. Contraindicado en niños menores de 6 meses.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Desloratadina',
        accion: 'Principal metabolito activo de la loratadina. Es un antihistamínico de nueva generación con acción prolongada y sin efectos sedantes, bloqueando de forma no competitiva el receptor H1.',
        indicaciones: 'Alivio constante durante 24 horas de síntomas de alergias respiratorias (incluyendo congestión nasal) y urticarias crónicas. Su potencia permite usar dosis muy bajas (5mg al día).',
        efectos: 'Sequedad de boca persistente, mialgia, fatiga excesiva. En muy escasas ocasiones, se han reportado casos de taquicardia o palpitaciones.',
        contraindicaciones: 'No utilizar en caso de alergia conocida a la desloratadina o a la loratadina original. Pacientes con insuficiencia renal severa.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Clorfeniramina',
        accion: 'Antihistamínico clásico (primera generación) derivado de la alquilamina. Atraviesa fácilmente la barrera del cerebro, generando un potente efecto antagonista H1 tanto periférico como central.',
        indicaciones: 'Alergias severas agudas, reacciones de hipersensibilidad a medicamentos o picaduras, picazón intensa sistémica. Muy utilizado en formulaciones antigripales por su capacidad de secar las secreciones (efecto anticolinérgico).',
        efectos: 'Depresión profunda del sistema nervioso central resultando en somnolencia intensa, letargo, disminución de los reflejos motores, sequedad extrema de mucosas, retención urinaria y visión borrosa.',
        contraindicaciones: 'Absolutamente contraindicado en personas que deban manejar vehículos o maquinaria peligrosa, pacientes con glaucoma de ángulo estrecho, hipertrofia prostática sintomática y durante ataques agudos de asma.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'infeccioso',
    name: 'Infecciosos (Antibióticos)',
    description: 'Combaten infecciones bacterianas severas. Requieren prescripción estricta y NO combaten virus.',
    iconPath: '/assets/infeccioso_icon.png',
    colorHex: '#fce7f3',
    iconColor: '#db2777',
    drugs: [
      {
        name: 'Amoxicilina',
        accion: 'Antibiótico betalactámico, bactericida de la familia de las aminopenicilinas. Actúa inhibiendo la síntesis de la pared celular bacteriana, provocando la destrucción del microorganismo.',
        indicaciones: 'Fármaco de primera línea para infecciones respiratorias altas y bajas (amigdalitis, bronquitis, neumonía), infecciones de oído medio, sinusitis aguda, infecciones de la piel e infecciones dentales bacterianas.',
        efectos: 'Trastornos gastrointestinales muy frecuentes como diarrea o dolor estomacal (por alteración de la flora intestinal). Puede provocar erupciones cutáneas, candidiasis secundaria y vómitos. Completar todo el esquema es obligatorio.',
        contraindicaciones: 'Totalmente contraindicado en pacientes con antecedentes de alergia, hipersensibilidad o shock anafiláctico a la penicilina o a cualquier antibiótico betalactámico (cefalosporinas).',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Azitromicina',
        accion: 'Antibiótico macrólido de amplio espectro. Se acumula intracelularmente y bloquea la síntesis de proteínas en la bacteria al unirse a la subunidad ribosomal 50S, frenando su reproducción.',
        indicaciones: 'Infecciones respiratorias atípicas, neumonías adquiridas en la comunidad, exacerbaciones bacterianas de EPOC, infecciones genitourinarias (Chlamydia) y como alternativa principal en alérgicos a la penicilina. Posee un ciclo corto de dosificación (3 a 5 días).',
        efectos: 'Dolor y calambres abdominales intensos, náuseas severas. Riesgo de alteraciones cardíacas por prolongación del intervalo QT del electrocardiograma en pacientes predispuestos. Debe tomarse separado de antiácidos.',
        contraindicaciones: 'Antecedentes de alteraciones o toxicidad hepática asociada al uso previo de azitromicina, disfunción hepática grave o arritmias cardíacas preexistentes.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Cefalexina',
        accion: 'Antibiótico bactericida del grupo de las cefalosporinas de primera generación. Similar a las penicilinas, rompe la integridad de la pared bacteriana hasta lograr su lisis.',
        indicaciones: 'Muy eficaz para infecciones del tracto urinario (cistitis no complicadas), infecciones bacterianas de la piel (celulitis, abscesos), heridas infectadas e infecciones óseas menores.',
        efectos: 'Malestar digestivo general, náuseas, diarrea leve, vaginitis (infección por hongos debido a la eliminación de bacterias protectoras). Raramente, anomalías hepáticas reversibles.',
        contraindicaciones: 'Hipersensibilidad a cefalosporinas. Existe un riesgo de reacción cruzada (del 5% al 10%) en pacientes con alergia grave comprobada a la penicilina, debiendo usarse con extrema precaución.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  },
  {
    id: 'metabolico',
    name: 'Metabolismo y Tiroides',
    description: 'Reguladores hormonales y tratamientos para patologías metabólicas crónicas (Diabetes, Hipotiroidismo).',
    iconPath: '/assets/metabolico_icon.png',
    colorHex: '#ecfdf5',
    iconColor: '#059669',
    drugs: [
      {
        name: 'Levotiroxina',
        accion: 'Hormona tiroidea sintética de reemplazo. Actúa exactamente igual que la hormona T4 producida naturalmente por la glándula tiroides, regulando el metabolismo basal del cuerpo.',
        indicaciones: 'Terapia de reemplazo hormonal vitalicia en casos de hipotiroidismo (deficiencia tiroidea), tiroiditis de Hashimoto, bocio simple y post-extirpación quirúrgica de la glándula tiroides. Requiere estricta toma en ayunas (40 a 60 minutos antes del desayuno).',
        efectos: 'En dosis correctas no presenta efectos adversos. Una sobredosificación prolongada (hipertiroidismo inducido) produce taquicardia severa, palpitaciones, pérdida de peso, ansiedad extrema, sudoración y temblores.',
        contraindicaciones: 'Infarto agudo de miocardio reciente, insuficiencia suprarrenal no corregida y tirotoxicosis o hipertiroidismo no diagnosticado ni tratado.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      },
      {
        name: 'Metformina',
        accion: 'Fármaco antidiabético oral del grupo de las biguanidas. Reduce drásticamente la producción de glucosa en el hígado y mejora de forma significativa la sensibilidad periférica a la insulina.',
        indicaciones: 'Tratamiento de primera elección a nivel mundial para la Diabetes Mellitus Tipo 2, especialmente en pacientes con sobrepeso. También se receta para el Síndrome de Ovario Poliquístico (SOP) y resistencia grave a la insulina.',
        efectos: 'Efectos adversos gastrointestinales muy frecuentes al inicio del tratamiento: diarrea explosiva, dolor abdominal, náuseas y sabor metálico. Estos síntomas disminuyen drásticamente si se toma durante o justo después de las comidas fuertes.',
        contraindicaciones: 'Insuficiencia renal crónica o aguda (riesgo de acidosis láctica fatal), insuficiencia cardíaca severa, alcoholismo crónico, deshidratación grave y cetoacidosis diabética.',
        embarazo: 'Para uso en embarazo y lactancia se debe consultar previamente con un profesional médico.'
      }
    ]
  }
];
