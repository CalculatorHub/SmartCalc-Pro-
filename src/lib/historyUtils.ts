export interface HistoryEntry {
  type: string;
  value: string; // The primary result value (e.g. "₹5,400.00")
  date: string;  // Localized date & time string e.g., "6/7/2026, 3:51 PM"
  details?: string; // Optional helper details like inputs used
  id: string; // Unique GUID or timestamp-based ID
}

export function saveHistory(type: string, value: string | number, details?: string) {
  try {
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
    const entry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      type,
      value: formattedValue,
      date: new Date().toLocaleString(),
      details
    };

    const old: HistoryEntry[] = JSON.parse(localStorage.getItem("history") || "[]");
    localStorage.setItem("history", JSON.stringify([entry, ...old]));
    
    // Trigger storage event manually to notify sibling tabs/components if they listen
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem("history") || "[]");
  } catch (e) {
    console.error("Failed to read history", e);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem("history");
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}
