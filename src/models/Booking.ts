export default class Booking {
    BookingID!: number;
    CustomerID!: number;
    CustomerName?: string;
    BookingDate!: Date;
    BookingDetails!: BookingDetails[];
    TotalAmount?: number;
}

export class BookingDetails {
    BookingDetailsID!: number;
    BookingID!: number;
    CarID!: number;
    Price!: number;

    LicensePlateNum?: string;
    Type?: string;
    Brand?: string;
}

export class Customer {
    CustomerID!: number;
    Name!: string;
    Email?: string;
    Phone?: string;
}

export class CartItem {
    CarID: number;
    LicensePlateNum: string;
    Type: string;
    Brand: string;
    Price: number;

    constructor(CarID: number, LicensePlateNum: string, Type: string, Brand: string, Price: number) {
        this.CarID = CarID;
        this.LicensePlateNum = LicensePlateNum;
        this.Type = Type;
        this.Brand = Brand;
        this.Price = Price;
    }
}