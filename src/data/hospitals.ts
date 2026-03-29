export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Γ.Ν.Α. «ΛΑΪΚΟ»",
    address: "Αγ. Θωμά 17, Τ.Κ.:11527, Αθήνα",
    phone: "1566",
    lat: 37.9836,
    lng: 23.7668,
  },
  {
    id: 2,
    name: "Γ.Ν.Α. «Ο ΕΥΑΓΓΕΛΙΣΜΟΣ»",
    address: "Υψηλάντου 45-47, Τ.Κ.:10676, Αθήνα",
    phone: "2132045167",
    lat: 37.976,
    lng: 23.748,
  },
  {
    id: 3,
    name: "Π.Γ.Ν.Θ. «ΑΧΕΠΑ»",
    address: "Στ. Κυριακίδη 1, Τ.Κ.: 54636, Θεσσαλονίκη",
    phone: "14970",
    lat: 40.63,
    lng: 22.956,
  },
];
