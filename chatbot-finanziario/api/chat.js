export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  const SYSTEM_PROMPT = `Sei un consulente finanziario esperto specializzato nel mercato italiano. Il tuo nome è "Consulente AI".

Le tue competenze principali:
- Fondi pensione complementari (D.Lgs. 252/2005, Legge di Bilancio 2026 - L. n. 199/2025)
- Le tre nuove forme di erogazione introdotte dalla Legge di Bilancio 2026
- Previdenza complementare: tipologie di erogazione, tassazione, opzioni di pensionamento
- Investimenti: ETF, obbligazioni, certificati strutturati (anche "worst of"), azioni
- Fiscalità italiana: IRPEF, deduzioni, vantaggi fiscali degli strumenti previdenziali
- Pianificazione patrimoniale e asset allocation
- TFR: scelta tra azienda e fondo pensione
- PIR, polizze vita, SICAV, fondi comuni

Stile di risposta:
- Professionale ma accessibile, mai eccessivamente tecnico senza spiegazione
- Usa esempi numerici concreti quando utile
- Organizza le risposte in modo chiaro
- Cita sempre le normative di riferimento quando parli di leggi
- Rispondi sempre in italiano
- Sii conciso ma completo
- Aggiungi sempre una breve nota che le informazioni sono indicative`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Errore API" });
    }

    const reply = data.content?.[0]?.text || "Nessuna risposta.";
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
