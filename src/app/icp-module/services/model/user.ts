export class Doctor {
    public doctorId: string;
    public doctorCode: string;
    public doctorType: string;
    public doctorName: string;
    public doctorSurname: string;
    public doctorEmail: string;
    public doctorDescription: string;
    public districts: District[];
    public wards: Ward[];
}

export class District {
    public districtId: string;
    public districtCode: string;
    public districtName: string;
    public districtAsl: string;
}

export class Ward {
    public wardId: string;
    public wardName: string;
}

export class Patient{
    public name:string;
    public surname:string;
    public uuid:string;
}

export class GeneralDoctor{
    
}
