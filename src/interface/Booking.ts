export interface IBookingChildren {
    id: string;
    currentNumber: string;
    maxNumber: string;
    startTime: string;
    endTime: string;
    date: string;
    statusValue: string;
    status: number;
    isEditable: number;
    isDeletable: number;
}

export interface IBooking {
    id: string;
    date: string;
    schedules: IBookingChildren;
}