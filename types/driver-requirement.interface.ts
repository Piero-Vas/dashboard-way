import { StatusDriverRequirement } from "@/lib/enums";

export interface DriverRequirement {
    id: number;
    idUser: number;
    mobile: string;
    email: string;
    firstName: string;
    lastName: string;
    vehicleType: string;
    vehicleTypeStatus: boolean;
    licensePlate: string;
    licensePlateStatus: boolean;
    brand: string;
    brandStatus: boolean;
    model: string;
    modelStatus: boolean;
    color: string;
    colorStatus: boolean;
    yearManufacture: string;
    yearManufactureStatus: boolean;
    profilePictureUrl: string;
    documentNumber: string;
    documentNumberStatus: boolean;
    licensePath: string;
    licensePathStatus: boolean;
    criminalRecordPath: string;
    criminalRecordPathStatus: boolean;
    vehiclePhotoPath: string;
    vehiclePhotoPathStatus: boolean;
    insuranceTrafficAccidentsPath: string;
    insuranceTrafficAccidentsPathStatus: boolean;
    status: StatusDriverRequirement;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}