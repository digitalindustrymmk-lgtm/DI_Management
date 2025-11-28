export const ACADEMIC_YEARS = ['ឆ្នាំទី១', 'ឆ្នាំទី២', 'ឆ្នាំទី៣', 'ឆ្នាំទី៤'];
export const GENERATIONS = Array.from({length: 14}, (_, i) => `ទី${i + 1}`);
export const GENDER_OPTIONS = ['ប្រុស', 'ស្រី'];

export const safeString = (val) => val === null || val === undefined || typeof val === 'object' ? '' : String(val);