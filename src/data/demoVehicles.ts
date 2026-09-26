export type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  title: string;
  priceEur: number;
  firstRegistration: `${number}/${number}`;
  mileageKm: number;
  fuel: "Benzin" | "Diesel";
  transmission: "Schaltung" | "Automatik";
  powerPs: number;
  powerKw: number;
  bodyType: string;
  taxStatus: "differenz" | "regel";
  features: string[];
  images: string[];
  status: "verfuegbar" | "reserviert" | "verkauft";
  isHighlight: boolean;
  isDemo: true;
};

export const demoVehicles: Vehicle[] = [
  {
    id: "demo-1", slug: "vw-golf-viii-style", brand: "VW", model: "Golf VIII Lim. Style", title: "VW Golf VIII Lim. Style", priceEur: 16999,
    firstRegistration: "10/2020", mileageKm: 84000, fuel: "Benzin", transmission: "Schaltung", powerPs: 150, powerKw: 110,
    bodyType: "Limousine", taxStatus: "differenz", features: ["1. Hand", "Navigation", "LED", "DAB", "Massagesitze", "8-fach bereift"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/25/251dabcd-18ff-4808-9b4d-7a47099b4a41?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-2", slug: "kia-sportage-gt-line-4wd", brand: "Kia", model: "Sportage GT-Line 4WD", title: "Kia Sportage GT-Line 4WD", priceEur: 17999,
    firstRegistration: "07/2018", mileageKm: 63000, fuel: "Benzin", transmission: "Automatik", powerPs: 177, powerKw: 130,
    bodyType: "SUV", taxStatus: "regel", features: ["4WD", "AHK", "Panoramadach", "CarPlay", "DAB"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/a5/a5f4a4de-c923-432e-80a6-de6dfb62d9de?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-3", slug: "vw-touran-2-0-tdi-7-sitzer", brand: "VW", model: "Touran 2.0 TDI 7-Sitzer", title: "VW Touran 2.0 TDI 7-Sitzer", priceEur: 21999,
    firstRegistration: "01/2022", mileageKm: 75000, fuel: "Diesel", transmission: "Schaltung", powerPs: 122, powerKw: 90,
    bodyType: "Van", taxStatus: "regel", features: ["7-Sitzer", "TÜV & Service neu", "8-fach bereift"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/05/05e6211a-948b-4b27-85a9-309ab24c1fc6?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-4", slug: "seat-ateca-fr-4drive", brand: "Seat", model: "Ateca FR 4Drive", title: "Seat Ateca FR 4Drive", priceEur: 19999,
    firstRegistration: "10/2020", mileageKm: 125000, fuel: "Diesel", transmission: "Automatik", powerPs: 150, powerKw: 110,
    bodyType: "SUV", taxStatus: "differenz", features: ["FR", "4Drive", "AHK", "Navigation", "Kamera", "ACC"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/71/7163354d-f6c1-404c-9f3e-69f09e425a27?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-5", slug: "bmw-120d-edition-m-sport", brand: "BMW", model: "120d Edition M Sport Shadow", title: "BMW 120d Edition M Sport Shadow", priceEur: 16999,
    firstRegistration: "04/2019", mileageKm: 163000, fuel: "Diesel", transmission: "Automatik", powerPs: 190, powerKw: 140,
    bodyType: "Limousine", taxStatus: "differenz", features: ["M Sport", "LED", "Navigation", "Sitzheizung", "PDC"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/7f/7ff0c624-a274-4c29-b179-f992e470e49b?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-6", slug: "mercedes-vito-camper-4x4", brand: "Mercedes-Benz", model: "Vito Camper 4x4 116 CDI", title: "Mercedes-Benz Vito Camper 4x4 116 CDI", priceEur: 24999,
    firstRegistration: "02/2013", mileageKm: 105000, fuel: "Diesel", transmission: "Automatik", powerPs: 163, powerKw: 120,
    bodyType: "Camper", taxStatus: "differenz", features: ["4x4", "Bettfunktion", "AHK", "extralang"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/de/de1dc43a-a013-4e53-a5bc-cd3dac97fbf1?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-7", slug: "audi-r8-coupe-4-2-fsi-quattro", brand: "Audi", model: "R8 Coupé 4.2 FSI quattro", title: "Audi R8 Coupé 4.2 FSI quattro", priceEur: 48999,
    firstRegistration: "08/2010", mileageKm: 121900, fuel: "Benzin", transmission: "Automatik", powerPs: 420, powerKw: 309,
    bodyType: "Coupé", taxStatus: "differenz", features: ["quattro", "Kamera", "TÜV & Service neu"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/37/37cb9a67-af05-48a8-aa73-cf055badd95d?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
  {
    id: "demo-8", slug: "vw-t6-caravelle-lang-9-sitzer", brand: "VW", model: "T6 Caravelle lang 9-Sitzer DSG", title: "VW T6 Caravelle lang 9-Sitzer DSG", priceEur: 24999,
    firstRegistration: "09/2019", mileageKm: 150000, fuel: "Diesel", transmission: "Automatik", powerPs: 150, powerKw: 110,
    bodyType: "Bus", taxStatus: "differenz", features: ["9-Sitzer", "DSG", "PDC", "AHK"],
    images: ["https://img.classistatic.de/api/v1/mo-prod/images/c7/c711beba-55e1-444d-b9b2-d368c6dbe8f3?rule=mo-1600"], status: "verfuegbar", isHighlight: true, isDemo: true,
  },
];