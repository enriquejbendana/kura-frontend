// 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
export const diasSemana = [
  { id: 1, name: 'Lunes', shortName: 'Lun' },
  { id: 2, name: 'Martes', shortName: 'Mar' },
  { id: 3, name: 'Miércoles', shortName: 'Mié' },
  { id: 4, name: 'Jueves', shortName: 'Jue' },
  { id: 5, name: 'Viernes', shortName: 'Vie' },
  { id: 6, name: 'Sábado', shortName: 'Sáb' },
  { id: 0, name: 'Domingo', shortName: 'Dom' }
];

export const alianzasDescuentos = [
  // ================= BANCOS (Dependen del día) =================
  // LUNES
  { id: 'b1', category: 'bancos', dayIds: [1], bank: 'Ueno', bankColor: '#1d1d1b', bankHighlight: '#00e194', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '30%', type: 'Tarjetas de Crédito y Débito' },
  { id: 'b2', category: 'bancos', dayIds: [1], bank: 'Itaú', bankColor: '#ec7000', bankHighlight: '#ff8a00', pharmacy: 'Farmacenter', pharmacyColor: '#009639', discount: '25%', type: 'Tarjetas de Crédito' },
  // MARTES
  { id: 'b3', category: 'bancos', dayIds: [2], bank: 'Familiar', bankColor: '#00703c', bankHighlight: '#7bc143', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '30%', type: 'Tarjetas de Crédito' },
  { id: 'b4', category: 'bancos', dayIds: [2], bank: 'Basa', bankColor: '#005b82', bankHighlight: '#00b0e6', pharmacy: 'Catedral', pharmacyColor: '#e3000f', discount: '35%', type: 'Tarjetas de Crédito' },
  // MIÉRCOLES
  { id: 'b5', category: 'bancos', dayIds: [3], bank: 'SUDAMERIS', bankColor: '#003a70', bankHighlight: '#cf0a2c', pharmacy: 'Farma Total', pharmacyColor: '#002f6c', discount: '20%', type: 'Todas las tarjetas' },
  { id: 'b6', category: 'bancos', dayIds: [3], bank: 'Tigo Money', bankColor: '#00246a', bankHighlight: '#f1ab00', pharmacy: 'Farmaoliva', pharmacyColor: '#652d87', discount: '15%', type: 'Billetera Electrónica' },
  // JUEVES
  { id: 'b7', category: 'bancos', dayIds: [4], bank: 'Visión', bankColor: '#e30613', bankHighlight: '#ffffff', pharmacy: 'Farmacenter', pharmacyColor: '#009639', discount: '30%', type: 'Tarjetas de Crédito' },
  { id: 'b8', category: 'bancos', dayIds: [4], bank: 'GNB', bankColor: '#005a8b', bankHighlight: '#00b0eb', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '25%', type: 'Tarjetas de Crédito' },
  // VIERNES
  { id: 'b9', category: 'bancos', dayIds: [5], bank: 'Atlas', bankColor: '#0a365f', bankHighlight: '#f7931d', pharmacy: 'Catedral', pharmacyColor: '#e3000f', discount: '30%', type: 'Tarjetas de Crédito' },
  { id: 'b10', category: 'bancos', dayIds: [5], bank: 'Itaú', bankColor: '#ec7000', bankHighlight: '#ff8a00', pharmacy: 'Farma Total', pharmacyColor: '#002f6c', discount: '20%', type: 'Tarjetas de Débito' },
  // FIN DE SEMANA
  { id: 'b11', category: 'bancos', dayIds: [6, 0], bank: 'Ueno', bankColor: '#1d1d1b', bankHighlight: '#00e194', pharmacy: 'Farmacenter', pharmacyColor: '#009639', discount: '30%', type: 'Tarjetas de Crédito' },
  { id: 'b12', category: 'bancos', dayIds: [6, 0], bank: 'Tigo Money', bankColor: '#00246a', bankHighlight: '#f1ab00', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '15%', type: 'Billetera Electrónica' },

  // ================= SEGUROS MÉDICOS (Todos los días) =================
  { id: 's1', category: 'seguros', dayIds: [0,1,2,3,4,5,6], bank: 'Asismed', bankColor: '#00358e', bankHighlight: '#0055c4', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '30%', type: 'Carnet de Afiliado' },
  { id: 's2', category: 'seguros', dayIds: [0,1,2,3,4,5,6], bank: 'SPS', bankColor: '#007f3e', bankHighlight: '#00a854', pharmacy: 'Farma Total', pharmacyColor: '#002f6c', discount: '25%', type: 'Carnet de Afiliado' },
  { id: 's3', category: 'seguros', dayIds: [0,1,2,3,4,5,6], bank: 'Santa Clara', bankColor: '#d60b30', bankHighlight: '#ff2d55', pharmacy: 'Farmacenter', pharmacyColor: '#009639', discount: '25%', type: 'Carnet de Afiliado' },
  { id: 's4', category: 'seguros', dayIds: [0,1,2,3,4,5,6], bank: 'Promed', bankColor: '#00a3e0', bankHighlight: '#4cd2ff', pharmacy: 'Catedral', pharmacyColor: '#e3000f', discount: '20%', type: 'Carnet de Afiliado' },

  // ================= COOPERATIVAS (Todos los días) =================
  { id: 'c1', category: 'cooperativas', dayIds: [0,1,2,3,4,5,6], bank: 'Universitaria', bankColor: '#004b2b', bankHighlight: '#007644', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '20%', type: 'Tarjetas de Crédito CU' },
  { id: 'c2', category: 'cooperativas', dayIds: [0,1,2,3,4,5,6], bank: 'Coomecipar', bankColor: '#00548f', bankHighlight: '#0078cc', pharmacy: 'Catedral', pharmacyColor: '#e3000f', discount: '25%', type: 'Tarjetas de Crédito' },
  { id: 'c3', category: 'cooperativas', dayIds: [0,1,2,3,4,5,6], bank: 'Medalla Milagrosa', bankColor: '#002856', bankHighlight: '#ffd100', pharmacy: 'Farmacenter', pharmacyColor: '#009639', discount: '15% al 30%', type: 'Tarjetas de Crédito' },

  // ================= EVENTOS DE CADENAS (Días específicos) =================
  // LUNES
  { id: 'e1', category: 'eventos', dayIds: [1], bank: 'Día Verde', bankColor: '#0055a5', bankHighlight: '#009639', pharmacy: 'Punto Farma', pharmacyColor: '#0055a5', discount: '20% al 40%', type: 'Todos los medios de pago' },
  // MARTES
  { id: 'e2', category: 'eventos', dayIds: [2], bank: 'Día C', bankColor: '#e3000f', bankHighlight: '#ff2d55', pharmacy: 'Catedral', pharmacyColor: '#e3000f', discount: '15% al 35%', type: 'Efectivo o Débito' },
  // MIÉRCOLES
  { id: 'e3', category: 'eventos', dayIds: [3], bank: 'Día Farmacenter', bankColor: '#009639', bankHighlight: '#7bc143', pharmacy: 'Farmacenter', pharmacyColor: '#009639', discount: '30%', type: 'Todos los medios de pago' },
  // JUEVES
  { id: 'e4', category: 'eventos', dayIds: [4], bank: 'Día Total', bankColor: '#002f6c', bankHighlight: '#00b0eb', pharmacy: 'Farma Total', pharmacyColor: '#002f6c', discount: '25% al 45%', type: 'Todos los medios de pago' },
  // FIN DE SEMANA
  { id: 'e5', category: 'eventos', dayIds: [5, 6, 0], bank: 'Finde de Ahorro', bankColor: '#652d87', bankHighlight: '#9d4edd', pharmacy: 'Farmaoliva', pharmacyColor: '#652d87', discount: '10% al 25%', type: 'Todos los medios de pago' }
];
