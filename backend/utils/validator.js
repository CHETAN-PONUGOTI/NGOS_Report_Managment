const validateReport = (data) => {
    const { ngo_id, month, people_helped, events_conducted, funds_utilized } = data;
    const errors = [];

    if (!ngo_id || typeof ngo_id !== 'string') {
        errors.push('ngo_id must be a non-empty string.');
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        errors.push('month must be in YYYY-MM format.');
    }
    if (people_helped === undefined || people_helped < 0 || !Number.isInteger(people_helped)) {
        errors.push('people_helped must be a non-negative integer.');
    }
    if (events_conducted === undefined || events_conducted < 0 || !Number.isInteger(events_conducted)) {
        errors.push('events_conducted must be a non-negative integer.');
    }
    if (funds_utilized === undefined || funds_utilized < 0 || typeof funds_utilized !== 'number') {
        errors.push('funds_utilized must be a non-negative number.');
    }

    return errors.length > 0 ? errors : null;
};

module.exports = { validateReport };