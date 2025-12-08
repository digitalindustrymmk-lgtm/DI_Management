// Smart Search Normalizer
export const normalizeString = (str) => {
    if (!str) return '';
    return String(str).toLowerCase().replace(/\s+/g, '');
};

export const safeString = (str) => {
    return str ? String(str) : '';
};

// Constants (Moved from main file imports)
export const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
export const GENERATIONS = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5'];
export const GENDER_OPTIONS = ['ប្រុស', 'ស្រី'];