import {
  ActionModalDialog,
  StatusDriverRequirement,
  StatusRegisterDriver,
} from "@/lib/enums";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  getIconModalDialog,
  getStatusClass,
  getStatusDriverRequirement,
} from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { handleUpdate } from "@/hooks/use-fetch-driver-requirement";
import { DriversRequests } from "@/types/driver-requests";

export const ModalDialog = ({
  item,
  action,
  disabled,
}: {
  item: DriversRequests;
  action: ActionModalDialog;
  disabled: boolean;
}) => {
  //   const [formData, setFormData] = useState({ ...item });

  //   const handleChange = (field: keyof DriverRequirement, value: any) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: value,
  //     }));
  //   };

  //   const handleSave = () => {
  //     handleUpdate(formData.id, formData);
  //   };

  return (
    <></>
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <DropdownMenuItem preventClose>
    //       <Icon icon={getIconModalDialog(action)} className=" h-4 w-4 mr-2 " />
    //       {action}
    //     </DropdownMenuItem>
    //   </DialogTrigger>
    //   <DialogContent className="max-h-[80vh] overflow-y-auto custom-scrollbar" aria-describedby="content">
    //     <DialogHeader>
    //       <DialogTitle className="text-center text-[25px]">{action} Formulario</DialogTitle>
    //       <form action="#" className=" space-y-5 pt-4">
    //         <div className="flex justify-between mt-6">
    //           <div className="flex flex-direction-column">
    //             <Label className="mb-4 text-[16px]">{`${item.firstName} ${item.lastName}`}</Label>
    //             <Label className="mb-4 text-[16px]">{`${item.email}`}</Label>
    //             <Label className="mb-4 text-[16px]">{`${item.mobile}`}</Label>
    //           </div>
    //           <Avatar className="rounded-lg w-28 h-28">
    //             <AvatarImage src={item.profilePictureUrl} />
    //             <AvatarFallback className="rounded-sm">AB</AvatarFallback>
    //           </Avatar>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Tipo de Vehículo</Label>
    //           <div className="flex justify-between">
    //             <select name="select"
    //               className="w-full bg-background dark:border-700 px-3 file:border-0 file:bg-transparent
    //             file:text-sm file:font-medium read-only:bg-background disabled:cursor-not-allowed
    //             disabled:opacity-50 transition duration-300 border-default-300 text-default-500
    //             focus:outline-none focus:border-primary disabled:bg-default-200
    //             placeholder:text-accent-foreground/50 border rounded-lg h-9 text-xs read-only:leading-9"
    //               value={formData.vehicleType}
    //               onChange={(e) => handleChange("vehicleType", e.target.value)}
    //               disabled={disabled}>
    //               <option value="CAR">Carro</option>
    //               <option value="MOTORCYCLE">Moto</option>
    //             </select>
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.vehicleTypeStatus}
    //                 onCheckedChange={(checked) => handleChange("vehicleTypeStatus", checked)}
    //                 id={item.vehicleType}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Placa</Label>
    //           <div className="flex justify-between">
    //             <Input placeholder="Placa" defaultValue={item.licensePlate}
    //             disabled={disabled} onChange={(e) => handleChange("licensePlate", e.target.value)} />
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.licensePlateStatus}
    //                 onCheckedChange={(checked) => handleChange("licensePlateStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Marca</Label>
    //           <div className="flex justify-between">
    //             <Input placeholder="Marca" defaultValue={item.brand} disabled={disabled}
    //             onChange={(e) => handleChange("brand", e.target.value)} />
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.brandStatus}
    //                 onCheckedChange={(checked) => handleChange("brandStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Modelo</Label>
    //           <div className="flex justify-between">
    //             <Input placeholder="Modelo" defaultValue={item.model} disabled={disabled}
    //             onChange={(e) => handleChange("model", e.target.value)} />
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.modelStatus}
    //                 onCheckedChange={(checked) => handleChange("modelStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Color</Label>
    //           <div className="flex justify-between">
    //             <Input placeholder="Color" defaultValue={item.color} disabled={disabled}
    //             onChange={(e) => handleChange("color", e.target.value)} />
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.colorStatus}
    //                 onCheckedChange={(checked) => handleChange("colorStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Año de Fabricación</Label>
    //           <div className="flex justify-between">
    //             <Input placeholder="Año de Fabricación" defaultValue={item.yearManufacture}
    //             disabled={disabled} onChange={(e) => handleChange("yearManufacture", e.target.value)} />
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.yearManufactureStatus}
    //                 onCheckedChange={(checked) => handleChange("yearManufactureStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Documento de Identidad</Label>
    //           <div className="flex justify-between">
    //             <Input placeholder="Documento de Identidad" defaultValue={item.documentNumber}
    //             disabled={disabled} onChange={(e) => handleChange("documentNumber", e.target.value)} />
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.documentNumberStatus}
    //                 onCheckedChange={(checked) => handleChange("documentNumberStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Licencia de conducir</Label>
    //           <div className="flex justify-between">
    //             <div className="flex">
    //               {!disabled && (<Label htmlFor={item.licensePath}>
    //                 <Button asChild>
    //                   <span className="cursor-pointer flex items-center gap-1">
    //                     <UploadCloud className="h-4 w-4" /></span>
    //                 </Button>
    //                 <Input type="file" className="hidden" id={item.licensePath} />
    //               </Label>)}
    //               <Avatar className="rounded-sm w-28 h-28 ml-2">
    //                 <AvatarImage src={item.licensePath} className="rounded-sm" />
    //                 <AvatarFallback className="rounded-sm">S/F</AvatarFallback>
    //               </Avatar>
    //             </div>
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.licensePathStatus}
    //                 onCheckedChange={(checked) => handleChange("licensePathStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">Antecedentes</Label>
    //           <div className="flex justify-between">
    //             <div className="flex">
    //               {!disabled && (<Label htmlFor={item.criminalRecordPath}>
    //                 <Button asChild>
    //                   <span className="cursor-pointer flex items-center gap-1">
    //                     <UploadCloud className="h-4 w-4" /></span>
    //                 </Button>
    //                 <Input type="file" className="hidden" id={item.criminalRecordPath} />
    //               </Label>)}
    //               <Avatar className="rounded-sm w-28 h-28 ml-2">
    //                 <AvatarImage src={item.criminalRecordPath} className="rounded-sm" />
    //                 <AvatarFallback className="rounded-sm">S/F</AvatarFallback>
    //               </Avatar>
    //             </div>
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.criminalRecordPathStatus}
    //                 onCheckedChange={(checked) => handleChange("criminalRecordPathStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>

    //         <div>
    //           <Label className="mb-2">Foto del vehiculo</Label>
    //           <div className="flex justify-between">
    //             <div className="flex">
    //               {!disabled && (<Label htmlFor={item.vehiclePhotoPath}>
    //                 <Button asChild>
    //                   <span className="cursor-pointer flex items-center gap-1">
    //                     <UploadCloud className="h-4 w-4" /></span>
    //                 </Button>
    //                 <Input type="file" className="hidden" id={item.vehiclePhotoPath} />
    //               </Label>)}
    //               <Avatar className="rounded-sm w-28 h-28 ml-2">
    //                 <AvatarImage src={item.vehiclePhotoPath} className="rounded-sm" />
    //                 <AvatarFallback className="rounded-sm">S/F</AvatarFallback>
    //               </Avatar>
    //             </div>
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.vehiclePhotoPathStatus}
    //                 onCheckedChange={(checked) => handleChange("vehiclePhotoPathStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Label className="mb-2">SOAT</Label>
    //           <div className="flex justify-between">
    //             <div className="flex">
    //               {!disabled && (<Label htmlFor={item.insuranceTrafficAccidentsPath}>
    //                 <Button asChild>
    //                   <span className="cursor-pointer flex items-center gap-1">
    //                     <UploadCloud className="h-4 w-4" /></span>
    //                 </Button>
    //                 <Input type="file" className="hidden" id={item.insuranceTrafficAccidentsPath} />
    //               </Label>)}
    //               <Avatar className="rounded-sm w-28 h-28 ml-2">
    //                 <AvatarImage src={item.insuranceTrafficAccidentsPath} className="rounded-sm" />
    //                 <AvatarFallback className="rounded-sm">S/F</AvatarFallback>
    //               </Avatar>
    //             </div>
    //             <div className="ml-10 flex align-items-center">
    //               <Switch checked={formData.insuranceTrafficAccidentsPathStatus}
    //                 onCheckedChange={(checked) => handleChange("insuranceTrafficAccidentsPathStatus", checked)}
    //                 disabled={!disabled} />
    //             </div>
    //           </div>
    //         </div>
    //         <div className="flex justify-start">
    //           <Label className="mb-2 mr-10">Estado</Label>
    //           <div className={getStatusClass(item.status as StatusDriverRequirement)}>
    //             {getStatusDriverRequirement(item.status as StatusDriverRequirement)}
    //           </div>
    //         </div>
    //         <div className="flex justify-end space-x-3">
    //           <DialogClose asChild>
    //             <Button type="button" variant="outline" color="destructive">
    //               Cancelar
    //             </Button>
    //           </DialogClose>
    //           <DialogClose asChild>
    //             <Button color="success" onClick={ handleSave}>Guardar</Button>
    //           </DialogClose>
    //         </div>
    //       </form>
    //     </DialogHeader>
    //   </DialogContent>
    // </Dialog>
  );
};

export const getActionsForStatus = (
  status: StatusRegisterDriver,
  handleStatusUpdate: (
    id: number,
    item: DriverRequirement,
    status: StatusRegisterDriver
  ) => void,
  item: DriverRequirement
): React.ReactNode[] => {
  const actions: React.ReactNode[] = [];

  if (status === StatusRegisterDriver.PENDING) {
    actions.push(
      <DropdownMenuItem
        key="approve"
        onClick={() =>
          handleStatusUpdate(item.id, item, StatusRegisterDriver.ACTIVE)
        }
      >
        <Icon icon="heroicons:hand-thumb-up" className=" h-4 w-4 mr-2 " />
        Aprobar
      </DropdownMenuItem>
    );
    actions.push(
      <DropdownMenuItem
        key="reject"
        onClick={() =>
          handleStatusUpdate(item.id, item, StatusRegisterDriver.REJECTED)
        }
      >
        <Icon icon="heroicons:hand-thumb-down" className=" h-4 w-4 mr-2 " />
        Rechazar
      </DropdownMenuItem>
    );
  } else if (status === StatusRegisterDriver.ACTIVE) {
    actions.push(
      <DropdownMenuItem
        key="reject"
        onClick={() =>
          handleStatusUpdate(item.id, item, StatusRegisterDriver.REJECTED)
        }
      >
        <Icon icon="heroicons:hand-thumb-down" className=" h-4 w-4 mr-2 " />
        Rechazar
      </DropdownMenuItem>
    );
  } else if (status === StatusRegisterDriver.REJECTED) {
    actions.push(
      <DropdownMenuItem
        key="approve"
        onClick={() =>
          handleStatusUpdate(item.id, item, StatusRegisterDriver.ACTIVE)
        }
      >
        <Icon icon="heroicons:hand-thumb-up" className=" h-4 w-4 mr-2 " />
        Aprobar
      </DropdownMenuItem>
    );
  }

  return actions;
};
