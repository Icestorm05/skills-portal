export interface IProfile {
    Biography: string;
    Company: string;
    Director: string;
    EmailAddress: string;
    EmployeeId: number;
    FirstLineReporting: string;
    FullName: string;
    JobTitle: string;
    KnownAs: string;
    MainStaffNumber: string;
    SecondLineReporting: string;
    Surname: string;
    children: IProfile[];
}