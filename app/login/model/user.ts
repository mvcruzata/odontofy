export class User {
    Id: string;
    Email: string;
    EmailConfirmed: boolean;
    PasswordHash: string;
    SecurityStamp: string;
    PhoneNumber: string; 
    PhoneNumberConfirmed: boolean;
    TwoFactorEnabled: boolean;
    LockoutEndDateUtc: Date;
    LockoutEnabled: boolean;
    AccessFailedCount: number;
    Username: string;
    Password: string;
    ConfirmPassword: string;
    grant_type: string;  
    IHaveClinic: boolean;
    ImProfesional: boolean;
    LicenseAgreement: boolean; 
    Name: string;
    LastNames: string;
    KeepConnected: boolean;
    PaymentPlanId: number;
    ClinicSpecialtyId: number;
}
