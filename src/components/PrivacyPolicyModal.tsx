import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicyModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-primary hover:underline underline-offset-2 transition-colors">
          Πολιτική Απορρήτου
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <DialogTitle className="text-lg font-bold text-foreground">
              Πολιτική Απορρήτου & Εμπιστευτικότητας
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed mt-2">
          <section>
            <h3 className="font-semibold text-foreground mb-1">Σεβασμός στην Ιδιωτικότητά σας</h3>
            <p>
              Η εφαρμογή "Invisible Chess: Master Void" δημιουργήθηκε με γνώμονα την απόλυτη
              προστασία των προσωπικών σας δεδομένων και την ιατρική εμπιστευτικότητα.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-1">
              Δεν Αποθηκεύουμε Δεδομένα (No Data Storage)
            </h3>
            <p>
              Η εφαρμογή δεν απαιτεί δημιουργία λογαριασμού, δεν συλλέγει προσωπικά στοιχεία
              (όπως όνομα, email ή ιατρικό ιστορικό) και δεν αποθηκεύει καμία πληροφορία σε
              εξωτερικούς διακομιστές (servers). Η χρήση της εφαρμογής είναι εντελώς ανώνυμη.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-1">
              Δεδομένα Τοποθεσίας (Geolocation)
            </h3>
            <p>
              Για τον εντοπισμό του πλησιέστερου κέντρου, η εφαρμογή ζητά πρόσβαση στην τοποθεσία
              σας. Η επεξεργασία του στίγματος (GPS) γίνεται αποκλειστικά τοπικά στη συσκευή σας.
              Η τοποθεσία σας δεν καταγράφεται και δεν αποστέλλεται σε καμία βάση δεδομένων.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-1">
              Εμπιστευτικότητα & Google Maps
            </h3>
            <p>
              Η πλοήγηση μέσω Google Maps αποτελεί εξωτερική υπηρεσία. Η εφαρμογή διασφαλίζει
              ότι καμία ιατρική πληροφορία δεν μεταφέρεται κατά τη μετάβαση στην υπηρεσία χαρτών.
            </p>
          </section>
        </div>

        <DialogClose asChild>
          <button className="w-full mt-4 bg-primary text-primary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition-all">
            Κλείσιμο
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
