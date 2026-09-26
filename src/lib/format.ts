const priceFormatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const numberFormatter = new Intl.NumberFormat("de-DE");

export const formatPrice = (eur: number) => priceFormatter.format(eur);
export const formatKm = (km: number) => `${numberFormatter.format(km)} km`;

/** "2020-10-01" → "10/2020" */
export function formatFirstRegistration(date: string) {
  const [year, month] = date.split("-");
  return year && month ? `${month}/${year}` : date;
}

export const fuelLabels = { benzin: "Benzin", diesel: "Diesel", hybrid: "Hybrid", elektro: "Elektro", gas: "Gas" } as const;
export const transmissionLabels = { schaltung: "Schaltung", automatik: "Automatik" } as const;
export const formatFuel = (fuel: keyof typeof fuelLabels) => fuelLabels[fuel] ?? fuel;
export const formatTransmission = (t: keyof typeof transmissionLabels) => transmissionLabels[t] ?? t;
