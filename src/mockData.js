export const PHARMACIES = {
  PUNTO_FARMA: { id: 'punto-farma', name: 'Punto Farma', class: 'badge-punto-farma', logo: '/logos/punto-farma.png' },
  FARMACENTER: { id: 'farmacenter', name: 'Farmacenter', class: 'badge-farmacenter', logo: '/logos/farmacenter.png' },
  CATEDRAL: { id: 'catedral', name: 'Farmacias Catedral', class: 'badge-catedral', logo: '/logos/catedral.png' },
  FARMAOLIVA: { id: 'farmaoliva', name: 'Farmaoliva', class: 'badge-farmaoliva', logo: '/logos/farmaoliva.png' },
  FARMATOTAL: { id: 'farmatotal', name: 'Farmatotal', class: 'badge-farmatotal', logo: '/logos/farmatotal.png' },
};

export const MOCK_PRODUCTS = [
  // Paracetamol
  {
    id: 1,
    composition: 'Paracetamol 500mg',
    commercialName: 'Kitadol',
    laboratory: 'Lasca',
    details: 'Caja x 20 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 15500 },
      { pharmacy: PHARMACIES.CATEDRAL, price: 16000 },
      { pharmacy: PHARMACIES.FARMACENTER, price: 15000 },
      { pharmacy: PHARMACIES.FARMAOLIVA, price: 16500 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 14500 },
    ]
  },
  {
    id: 5,
    composition: 'Paracetamol 500mg',
    commercialName: 'Kitadol Forte',
    laboratory: 'Lasca',
    details: 'Caja x 100 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.CATEDRAL, price: 45000 },
      { pharmacy: PHARMACIES.FARMACENTER, price: 43000 },
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 44000 },
    ]
  },
  {
    id: 6,
    composition: 'Paracetamol 500mg',
    commercialName: 'Z-mol',
    laboratory: 'Quimfa',
    details: 'Caja x 20 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 12000 },
      { pharmacy: PHARMACIES.FARMAOLIVA, price: 13500 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 13000 },
    ]
  },
  {
    id: 7,
    composition: 'Paracetamol 750mg',
    commercialName: 'Tylenol',
    laboratory: 'Johnson & Johnson',
    details: 'Caja x 20 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.CATEDRAL, price: 35000 },
      { pharmacy: PHARMACIES.FARMACENTER, price: 34500 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 35500 },
    ]
  },
  
  // Ibuprofeno
  {
    id: 2,
    composition: 'Ibuprofeno 400mg',
    commercialName: 'Actron',
    laboratory: 'Bayer',
    details: 'Caja x 10 cápsulas blandas',
    prices: [
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 28000 },
      { pharmacy: PHARMACIES.FARMACENTER, price: 29500 },
      { pharmacy: PHARMACIES.CATEDRAL, price: 27500 },
      { pharmacy: PHARMACIES.FARMAOLIVA, price: 28500 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 30000 },
    ]
  },
  {
    id: 8,
    composition: 'Ibuprofeno 600mg',
    commercialName: 'Ibupirac',
    laboratory: 'Pfizer',
    details: 'Caja x 10 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.CATEDRAL, price: 18000 },
      { pharmacy: PHARMACIES.FARMACENTER, price: 17500 },
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 18500 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 17000 },
    ]
  },

  // Losartan
  {
    id: 3,
    composition: 'Losartán 50mg',
    commercialName: 'Losacor',
    laboratory: 'Roemmers',
    details: 'Caja x 30 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.FARMACENTER, price: 45000 },
      { pharmacy: PHARMACIES.FARMAOLIVA, price: 42000 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 44000 },
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 43500 },
      { pharmacy: PHARMACIES.CATEDRAL, price: 41500 },
    ]
  },
  {
    id: 9,
    composition: 'Losartán 50mg',
    commercialName: 'Carvas',
    laboratory: 'Saval',
    details: 'Caja x 30 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.FARMACENTER, price: 39000 },
      { pharmacy: PHARMACIES.FARMAOLIVA, price: 38500 },
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 39500 },
    ]
  },

  // Loratadina
  {
    id: 4,
    composition: 'Loratadina 10mg',
    commercialName: 'Alernix',
    laboratory: 'Elea',
    details: 'Caja x 10 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.FARMATOTAL, price: 18000 },
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 19500 },
      { pharmacy: PHARMACIES.CATEDRAL, price: 18500 },
      { pharmacy: PHARMACIES.FARMACENTER, price: 20000 },
      { pharmacy: PHARMACIES.FARMAOLIVA, price: 17500 },
    ]
  },
  {
    id: 10,
    composition: 'Loratadina 10mg',
    commercialName: 'Loratadina Quimfa',
    laboratory: 'Quimfa',
    details: 'Caja x 10 comprimidos',
    prices: [
      { pharmacy: PHARMACIES.FARMACENTER, price: 12000 },
      { pharmacy: PHARMACIES.FARMATOTAL, price: 11500 },
      { pharmacy: PHARMACIES.PUNTO_FARMA, price: 12500 },
    ]
  }
];

export const formatGs = (amount) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(amount);
};
