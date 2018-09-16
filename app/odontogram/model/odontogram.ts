export class Odontogram {
    Id: number;
    ToothNumber: number;
    PatientId: number;
    TreatmentId: string;
    ToothStatusId: number;
    Active: boolean;
    Cuadrant: string;
    Face: string;
    Tooth: { Top: { Color: string, Diagnostic: string }, Bottom: { Color: string, Diagnostic: string }, Left: { Color: string, Diagnostic: string }, Right: { Color: string, Diagnostic: string }, Center: { Color: string, Diagnostic: string }, Shape: string };
    ToothDetails: string;
    Teeth: any;
}
