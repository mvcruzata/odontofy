export class Consultation {
    Id: number;
    Payment: number;
    Procedures: string;
    Prescriptions: string;
    Observations: string;
    DateExecute: Date;
    Diagnosis_PlanId: number;
    DoctorExecuteId: number;
    DiagnosisPlanStatus: string;
    Invoiced: boolean;
    PaymentMethodsId: number;
    InvoicedNumber: string;
}
