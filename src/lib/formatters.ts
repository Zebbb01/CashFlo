export function formatCurrency(amount: number): string {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return "₱0.00";
    }

    // Use 'en-PH' for Philippine Peso formatting
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNumber(amount: number): string {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return "0.00";
    }
    return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
