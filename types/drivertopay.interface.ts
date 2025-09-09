export interface PayoutDriversResponse {
    id:          string;
    target:      string;
    userId:      number;
    status:      string;
    createdAt:   Date;
    updatedAt:   Date;
    payoutTrips: PayoutTrip[];
}

export interface PayoutTrip {
    id:            string;
    payoutId:      string;
    tripId:        string;
    paymentMethod: string;
    tripAmount:    string;
    earning:       string;
    amountToPay:   string;
    trip:          Trip;
}

export interface Trip {
    status: string;
    data:   Data;
}

export interface Data {
    id:                     string;
    userId:                 number;
    user:                   User;
    driverUserId:           number;
    driverUser:             User;
    vehicle:                Vehicle;
    pickupLocation:         Location;
    dropoffLocations:       Location[];
    paymentMethod:          string;
    requestType:            string;
    offer:                  number;
    amount:                 number;
    tripDetail:             string;
    roomId:                 string;
    tripType:               string;
    tripClass:              string;
    tripState:              string;
    senderMobile:           string;
    receiverMobile:         string;
    moreThanFourPassengers: boolean;
    carryPet:               boolean;
    babyChair:              boolean;
    paidDriver:             boolean;
    requestNote:            null;
    createdAt:              AtedAt;
}

export interface AtedAt {
}

export interface User {
    id:                     number;
    mobile:                 string;
    email:                  string;
    firstName:              string;
    lastName:               string;
    latitude:               number | null;
    longitude:              number | null;
    userRoles:              string[];
    ratingAveragePassenger: number;
    ratingAverageDriver:    number;
    profilePictureUrl:      string;
}

export interface Location {
    lat:      number;
    lng:      number;
    name:     string;
    sequence: number;
}

export interface Vehicle {
    id:                           number;
    userId:                       number;
    vehicleColor:                 string;
    vehicleType:                  string;
    vehicleModelId:               number;
    vehicleMakeId:                number;
    year:                         number;
    vehiclePhotoUrl:              string;
    sideVehiclePhotoUrl:          null;
    backVehiclePhotoUrl:          null;
    insuranceTrafficAccidentsUrl: string;
    plateNumber:                  string;
    tripClasses:                  string[];
    state:                        string;
    createUid:                    number;
    writeUid:                     number;
    createdAt:                    AtedAt;
    updatedAt:                    AtedAt;
    vehicleModel:                 VehicleM;
    vehicleMake:                  VehicleM;
}

export interface VehicleM {
    id:        number;
    name:      string;
    createUid: number;
    writeUid:  number;
    createdAt: AtedAt;
    updatedAt: AtedAt;
    makeId?:   number;
}
