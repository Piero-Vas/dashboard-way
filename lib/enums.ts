export enum StatusDriverRequirement {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ActionModalDialog {
  CREATE = "Crear",
  EDIT = "Editar",
  VIEW = "Ver",
}

export enum StatusRegisterDriver {
  INIT_VEHICLE = "INIT_VEHICLE",
  INIT_DOCUMENTS = "INIT_DOCUMENTS",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
  NO_VEHICLE = "NO_VEHICLE",
  SUSPENDED = "SUSPENDED",
  CANCELED = "CANCELED",
}


export enum Role {
  DRIVER = "driver",
  PASSENGER = "passenger",
  ADMIN = "admin",
}
