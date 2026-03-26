// ─────────────────────────────────────────────────────────────────
// HOOK — Timer de expiração de reservas
// Roda na montagem do componente e a cada 60s.
// Libera automaticamente lotes cujo reservado_ate < agora.
// ─────────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { ts } from "../utils/format";

export function useReservaTimer(setLots, setNots, setSel, triggerDbRefetch) {
  useEffect(() => {
    const checkExpirations = () => {
      setLots(prev => {
        let needsRefetch = false;
        
        prev.forEach(l => {
          if (l.status === "Reservado" && l.reservaVenceEm) {
            const expiraTime = new Date(l.reservaVenceEm).getTime();
            if (Date.now() >= expiraTime) {
              needsRefetch = true; // Timer estourou silenciosamente
            }
          }
        });
        
        if (needsRefetch) {
          setNots(n => [{
            id: Date.now(), msg: "⏰ Houve expiração no mapa. Sincronizando com o Servidor...", lida: false, em: ts()
          }, ...n]);
          
          if (triggerDbRefetch) triggerDbRefetch();
        }
        return prev;
      });
    };

    checkExpirations();
    const id = setInterval(checkExpirations, 60_000);
    return () => clearInterval(id);
  }, [triggerDbRefetch]);
}
