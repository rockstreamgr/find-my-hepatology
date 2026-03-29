import { useState } from "react";
import { Heart, MapPin, Phone, Navigation, Loader2, AlertCircle, Cross } from "lucide-react";
import { hospitals, Hospital } from "@/data/hospitals";
import { haversineDistance } from "@/lib/haversine";

type AppState = "welcome" | "loading" | "result" | "error";

const Index = () => {
  const [state, setState] = useState<AppState>("welcome");
  const [nearest, setNearest] = useState<(Hospital & { distance: number }) | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

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
        let minDist = Infinity;
        let closest: Hospital = hospitals[0];

        for (const h of hospitals) {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-5 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Cross className="w-7 h-7" />
          <h1 className="text-xl font-bold tracking-tight">Ηπατολογικά Κέντρα</h1>
        </div>
        <p className="text-sm opacity-90">Ελλάδα</p>
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

            <button
              onClick={findNearest}
              className="w-full bg-primary text-primary-foreground font-semibold text-lg py-4 rounded-2xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <MapPin className="w-5 h-5" />
              Βρες το κοντινότερο κέντρο
            </button>
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

            <div className="bg-card rounded-2xl shadow-sm p-6 space-y-4 border border-border">
              <h3 className="text-lg font-bold text-foreground">{nearest.name}</h3>

              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <span className="text-sm">{nearest.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-primary" />
                <a
                  href={`tel:${nearest.phone}`}
                  className="text-sm text-primary font-semibold underline-offset-2 hover:underline"
                >
                  {nearest.phone}
                </a>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-primary-foreground font-semibold text-lg py-4 rounded-2xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Navigation className="w-5 h-5" />
              Οδηγίες Πλοήγησης
            </a>

            <button
              onClick={() => setState("welcome")}
              className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-all"
            >
              Νέα Αναζήτηση
            </button>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4">
        © {new Date().getFullYear()} Ηπατολογικά Κέντρα Ελλάδας
      </footer>
    </div>
  );
};

export default Index;
