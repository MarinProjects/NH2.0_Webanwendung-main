// Example of calculateAdjustedPension function
export function calculateAdjustedPension(oldPension: number, indicesPct: number, steigungssatzPct: number): number {
    const adjustedPension = oldPension * (1 + indicesPct / 100) * (1 + steigungssatzPct / 100);
    return adjustedPension;
}