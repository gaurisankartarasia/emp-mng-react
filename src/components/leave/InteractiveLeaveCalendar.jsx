// import React from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import { isSunday, parseISO, format } from 'date-fns';

// import { Card, CardContent } from '@/components/ui/card'; 

// const InteractiveLeaveCalendar = ({ holidays, existingLeaves, selectedDates, setSelectedDates }) => {
//     // --- 1. Define Modifiers ---
//     const today = new Date();

//     const holidayDates = holidays.map(h => parseISO(h.date));

//     const approvedLeaveRanges = existingLeaves
//         .filter(l => l.status === 'approved')
//         .map(l => ({ from: parseISO(l.start_date), to: parseISO(l.end_date) }));
        
//     const pendingLeaveRanges = existingLeaves
//         .filter(l => l.status === 'pending')
//         .map(l => ({ from: parseISO(l.start_date), to: parseISO(l.end_date) }));

//     const disabledDays = [
//         ...holidayDates,
//         ...approvedLeaveRanges,
//         ...pendingLeaveRanges,
//         { before: today, after: new Date(1900,1,1) },
//         (date) => isSunday(date)
//     ];

//    const modifierStyles = {
//     holiday: {
//         backgroundColor: '#ffb09c',
//         color: 'black',
//     },
//     approved: {
//         backgroundColor: 'green',
//         color: 'white',
//     },
//     pending: {
//         backgroundColor: 'yellow',
//         color: 'white',
//     },
//     sunday: {
//         color: 'gray',
//     },
// };



//     // --- 3. Footer Logic (This is where 'format' is used) ---
//     let footer = <p className="text-sm p-2 text-muted-foreground">Please select the start and end date for your leave.</p>;
//     if (selectedDates?.from) {
//         if (!selectedDates.to) {
//             footer = <p className="text-sm p-2">{format(selectedDates.from, 'PPP')} – (Select end date)</p>;
//         } else if (selectedDates.to) {
//             footer = <p className="text-sm p-2">{format(selectedDates.from, 'PPP')} – {format(selectedDates.to, 'PPP')}</p>;
//         }
//     }

//     return (
//         <Card className="w-full">
//             <CardContent>
//             <DayPicker
//                 numberOfMonths={2}
//                 mode="range"
//                 selected={selectedDates}
//                 onSelect={setSelectedDates}
//                 disabled={disabledDays}
//                 modifiers={{
//                     holiday: holidayDates,
//                     approved: approvedLeaveRanges,
//                     pending: pendingLeaveRanges,
//                     sunday: (date) => isSunday(date),
//                 }}
//                 modifiersStyles={modifierStyles}
//                 footer={footer}
//                 className="w-full"
//                 classNames={{
//                     months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
//                     caption: 'flex justify-center pt-1 relative items-center',
//                 }}
//             />
//             </CardContent>
//         </Card>
//     );
// };

// export default InteractiveLeaveCalendar;



import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { isSunday, parseISO, format } from 'date-fns';

import { Card, CardContent } from '@/components/ui/card'; // Corrected import

const InteractiveLeaveCalendar = ({ holidays, existingLeaves, selectedDates, setSelectedDates }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- THIS IS THE CORRECTED LOGIC ---

    // 1. Keep the array of single dates for styling with MODIFIERS.
    const holidayDatesForStyling = holidays.map(h => parseISO(h.date));

    // 2. Create a NEW array of single-day RANGES for DISABLING.
    const holidayRangesForDisabling = holidayDatesForStyling.map(date => ({
        from: date,
        to: date
    }));

    // --- END OF CORRECTION ---

    const approvedLeaveRanges = existingLeaves
        .filter(l => l.status === 'approved')
        .map(l => ({ from: parseISO(l.start_date), to: parseISO(l.end_date) }));
        
    const pendingLeaveRanges = existingLeaves
        .filter(l => l.status === 'pending')
        .map(l => ({ from: parseISO(l.start_date), to: parseISO(l.end_date) }));

    // The disabledDays array now has a consistent structure of range objects.
    const disabledDays = [
        ...holidayRangesForDisabling, // Use the new range-based array
        ...approvedLeaveRanges,
        ...pendingLeaveRanges,
        { before: today },
        (date) => isSunday(date)
    ];

   const modifierStyles = {
        holiday: { backgroundColor: '#ffb09c', color: 'black' },
        approved: { backgroundColor: 'green', color: 'white' },
        pending: { backgroundColor: 'yellow', color: 'black' }, // Changed text to black for better visibility
        sunday: { color: 'gray' },
    };

    let footer = <p className="text-sm p-2 text-muted-foreground">Please select the start and end date for your leave.</p>;
    if (selectedDates?.from) {
        if (!selectedDates.to) {
            footer = <p className="text-sm p-2">{format(selectedDates.from, 'PPP')} – (Select end date)</p>;
        } else if (selectedDates.to) {
            footer = <p className="text-sm p-2">{format(selectedDates.from, 'PPP')} – {format(selectedDates.to, 'PPP')}</p>;
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="p-4 flex justify-center">
                <DayPicker
                    numberOfMonths={2}
                    mode="range"
                    selected={selectedDates}
                    onSelect={setSelectedDates}
                    disabled={disabledDays}
                    modifiers={{
                        holiday: holidayDatesForStyling, // Use the original array for styling
                        approved: approvedLeaveRanges,
                        pending: pendingLeaveRanges,
                        sunday: (date) => isSunday(date),
                    }}
                    modifiersStyles={modifierStyles}
                    footer={footer}
                    className="w-full"
                    classNames={{
                        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                        caption: 'flex justify-center pt-1 relative items-center',
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default InteractiveLeaveCalendar;