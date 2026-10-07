export const PHARMACIES = {
  PUNTO_FARMA: { id: 'punto-farma', name: 'Punto Farma', class: 'badge-punto-farma', logo: '/logos/punto-farma.png' },
  FARMACENTER: { id: 'farmacenter', name: 'Farmacenter', class: 'badge-farmacenter', logo: '/logos/farmacenter.png' },
  CATEDRAL: { id: 'catedral', name: 'Farmacias Catedral', class: 'badge-catedral', logo: '/logos/catedral.png' },
  FARMAOLIVA: { id: 'farmaoliva', name: 'Farmaoliva', class: 'badge-farmaoliva', logo: '/logos/farmaoliva.png' },
  FARMATOTAL: { id: 'farmatotal', name: 'Farmatotal', class: 'badge-farmatotal', logo: '/logos/farmatotal.png' },
};

export const MOCK_PRODUCTS = [];

export const formatGs = (amount) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(amount);
};
