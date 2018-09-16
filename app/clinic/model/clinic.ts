export class Clinic {
    Id: number;
    Name: string;
    Adress: string;
    Description: string;
    Email: string;
    Phone: string;
    Mobile: string; 
    RegionId: number;
    Schedule: string;
    OwnerId: number;
    Active: boolean;
    PaymentPlanId: number;
    SpecialtyId: number;
    Banck: number;
    DatePay: Date;
    Clinic_Specialties: Array<any>;
}
