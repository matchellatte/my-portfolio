/**
 * This is a coarse heuristic used ONLY to label analytics events
 * (e.g. "languages used" in the dashboard). It does not affect how the
 * chatbot responds — the model detects and matches the visitor's actual
 * language itself, per the system prompt.
 */
export function guessLanguageHint(text: string): string {
  if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(text)) return "ja";
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  if (/[\uac00-\ud7af]/.test(text)) return "ko";
  if (/\b(ang|mga|hindi|paano|salamat|kamusta|kumusta)\b/i.test(text)) return "fil";
  if (/[ñáéíóúü¿¡]/i.test(text) || /\b(hola|gracias|cómo|qué)\b/i.test(text)) return "es";
  if (/\b(bonjour|merci|comment|pourquoi)\b/i.test(text)) return "fr";
  if (/[äöüß]/i.test(text) || /\b(danke|warum|guten)\b/i.test(text)) return "de";
  return "en";
}
