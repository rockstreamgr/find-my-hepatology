import { useState } from "react";
import { Heart, MapPin, Phone, Navigation, Loader2, AlertCircle, Cross, Search, Baby } from "lucide-react";
import { hospitals, cities, Hospital, City } from "@/data/hospitals";
import { haversineDistance } from "@/lib/haversine";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { Switch } from "@/components/ui/switch";

type AppState = "welcome" | "loading" | "result" | "error" | "cityResults";

const Index = () => {
  const [state, setState] = useState<AppState>("welcome");
  const [nearest, setNearest] = useState<(Hospital & { distance: number }) | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPediatric, setIsPediatric] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | "">("");
  const [cityHospitals, setCityHospitals] = useState<Hospital[]>([]);

  const getFilteredHospitals = () => {
    if (isPediatric) {
      return hospitals.filter((h) => h.isPediatric);
    }
    return hospitals.filter((h) => !h.isPediatric);
  };

  const findNearest = () => {
    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Η τοποθεσία δεν υποστηρίζεται από τον browser σας.");
      return;
    }

    setState("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const filtered = getFilteredHospitals();
        let minDist = Infinity;
        let closest: Hospital = filtered[0];

        for (const h of filtered) {
          const d = haversineDistance(latitude, longitude, h.lat, h.lng);
          if (d < minDist) {
            minDist = d;
            closest = h;
          }
        }

        setNearest({ ...closest, distance: minDist });
        setState("result");
      },
      (err) => {
        setState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg(
            "Η πρόσβαση στην τοποθεσία απορρίφθηκε. Παρακαλώ ενεργοποιήστε την τοποθεσία στις ρυθμίσεις του browser σας και δοκιμάστε ξανά."
          );
        } else {
          setErrorMsg("Δεν ήταν δυνατός ο εντοπισμός της τοποθεσίας σας. Δοκιμάστε ξανά.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    const filtered = getFilteredHospitals().filter((h) => h.city === city);
    setCityHospitals(filtered);
    setState("cityResults");
  };

  const getCallablePhone = (hospital: Hospital) => {
    // Prefer local landline (phone2 or phone if it's not a short code)
    if (hospital.phone2) return hospital.phone2;
    if (hospital.phone.length > 5) return hospital.phone;
    return hospital.phone;
  };

  const HospitalCard = ({ hospital, distance }: { hospital: Hospital; distance?: number }) => (
    <div className="bg-card rounded-2xl shadow-sm p-5 space-y-4 border border-border">
      <h3 className="text-base font-bold text-foreground leading-snug">{hospital.name}</h3>

      <div className="flex items-start gap-3 text-muted-foreground">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <span className="text-sm">{hospital.address}</span>
      </div>

      {distance !== undefined && (
        <p className="text-xs text-muted-foreground pl-7">
          {distance.toFixed(1)} km απόσταση
        </p>
      )}

      {/* Click-to-call primary action */}
      <a
        href={`tel:${getCallablePhone(hospital)}`}
        className="w-full bg-primary text-primary-foreground font-semibold text-base py-3.5 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Phone className="w-5 h-5" />
        Κλήση: {getCallablePhone(hospital)}
      </a>

      {/* Navigation link */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-secondary text-secondary-foreground font-semibold text-sm py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Navigation className="w-4 h-4" />
        Οδηγίες Πλοήγησης
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-5 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Cross className="w-7 h-7" />
          <h1 className="text-xl font-bold tracking-tight">Hepatitis GR</h1>
        </div>
        <p className="text-sm opacity-90">Ηπατολογικά Κέντρα Ελλάδας</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-8 gap-6 max-w-lg mx-auto w-full">
        {state === "welcome" && (
          <>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Βρείτε το κοντινότερο Ηπατολογικό Κέντρο
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Εντοπίστε γρήγορα το πλησιέστερο εξειδικευμένο κέντρο ηπατολογίας και λάβετε
                οδηγίες πλοήγησης.
              </p>
            </div>

            {/* Pediatric toggle */}
            <div className="w-full bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
              <Baby className="w-5 h-5 text-primary shrink-0" />
              <label htmlFor="pediatric-toggle" className="flex-1 text-sm text-foreground leading-snug cursor-pointer">
                Αναζήτηση για παιδιατρικό περιστατικό (Παιδιά/Εφήβους)
              </label>
              <Switch
                id="pediatric-toggle"
                checked={isPediatric}
                onCheckedChange={setIsPediatric}
              />
            </div>

            {/* GPS find button */}
            <button
              onClick={findNearest}
              className="w-full bg-primary text-primary-foreground font-semibold text-lg py-4 rounded-2xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <MapPin className="w-5 h-5" />
              Βρες το κοντινότερο κέντρο
            </button>

            {/* Manual city search */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-medium uppercase tracking-wider">Ή επίλεξε πόλη</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="bg-card border border-border text-foreground text-sm font-medium py-3 rounded-xl hover:bg-secondary hover:text-secondary-foreground active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {state === "loading" && (
          <div className="text-center space-y-4 py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground font-medium">Εντοπισμός τοποθεσίας…</p>
          </div>
        )}

        {state === "error" && (
          <div className="w-full space-y-5">
            <div className="bg-card rounded-2xl shadow-sm p-6 text-center space-y-3 border border-border">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
              <p className="text-foreground font-medium">{errorMsg}</p>
            </div>
            <button
              onClick={() => setState("welcome")}
              className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-all"
            >
              Πίσω
            </button>
          </div>
        )}

        {state === "result" && nearest && (
          <div className="w-full space-y-5">
            <p className="text-sm text-muted-foreground text-center font-medium">
              Το κοντινότερο κέντρο ({nearest.distance.toFixed(1)} km)
            </p>
            <HospitalCard hospital={nearest} distance={nearest.distance} />
            <button
              onClick={() => setState("welcome")}
              className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-all"
            >
              Νέα Αναζήτηση
            </button>
          </div>
        )}

        {state === "cityResults" && (
          <div className="w-full space-y-5">
            <p className="text-sm text-muted-foreground text-center font-medium">
              Κέντρα στην περιοχή: <span className="text-foreground font-semibold">{selectedCity}</span>
              {isPediatric && <span className="text-primary"> (Παιδιατρικά)</span>}
            </p>

            {cityHospitals.length === 0 ? (
              <div className="bg-card rounded-2xl shadow-sm p-6 text-center space-y-3 border border-border">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-foreground font-medium">
                  Δεν βρέθηκαν {isPediatric ? "παιδιατρικά " : ""}κέντρα στην περιοχή {selectedCity}.
                </p>
              </div>
            ) : (
              cityHospitals.map((h) => <HospitalCard key={h.id} hospital={h} />)
            )}

            <button
              onClick={() => setState("welcome")}
              className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-all"
            >
              Νέα Αναζήτηση
            </button>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4 space-y-1">
        <div><PrivacyPolicyModal /></div>
        <p>© 2026 Hepatitis GR - Πληροφορίες Ηπατολογικών Κέντρων</p>
      </footer>
    </div>
  );
};

export default Index;
