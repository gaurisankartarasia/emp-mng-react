
// Helper function to create a clean, time-stripped date in UTC.
const getUTCDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

export const calculateWorkingDays = (startDate, endDate, holidays = []) => {
    const start = getUTCDate(startDate);
    const end = getUTCDate(endDate);

    if (!start || !end || start > end) return 0;

    let count = 0;
    const holidayDates = new Set(holidays.map(h => h.date));
    let currentDate = new Date(start);

    while (currentDate <= end) {
        const dayOfWeek = currentDate.getUTCDay(); // Use getUTCDay() for consistency
        const isoDate = currentDate.toISOString().split('T')[0];

        if (dayOfWeek !== 0 && !holidayDates.has(isoDate)) {
            count++;
        }
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Use setUTCDate()
    }
    return count;
};