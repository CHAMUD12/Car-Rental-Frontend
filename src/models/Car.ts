export class Car {
    CarID: number;
    LicensePlateNum: string;
    Type: string;
    Brand: string;
    Availability: string;
    Price: number;

    constructor(CarID: number, LicensePlateNum: string, Type: string, Brand: string, Availability: string, Price: number) {
        this.CarID = CarID;
        this.LicensePlateNum = LicensePlateNum;
        this.Type = Type;
        this.Brand = Brand;
        this.Availability = Availability;
        this.Price = Price;
    }
}
