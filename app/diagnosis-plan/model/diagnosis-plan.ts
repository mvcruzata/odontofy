export class Diagnosis_Plan {
    Id: number;
    Status: string;
    DiagnosticsAndComplications: string;
    Procedures: string;
    Prescriptions: string;
    DateCreate: Date;
    DatePlan: Date;
    PatientId: number;
    DoctorDiagnosticId: number;
    DoctorExecuteId: number;
    TreatmentId: number;
    TreatmentAmount: number;
    Payment: number;
    PercentDiscountStablished: number;
    PercentSpecialDiscount: number;
    ValueType: number;
    Pay: number;
    Tooth: string;
    Invoiced: boolean;
    PaymentMethodsId: number;
    SpecialitieTypeId: number;
    InvoicedNumber: string;
}
