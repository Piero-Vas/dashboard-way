"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ActionModalDialog,
    StatusRegisterDriver
} from "@/lib/enums";
import {
    getIconModalDialog
} from "@/lib/utils";
import { useTextStore } from "@/store";
import { DriverRequestsTableProps } from "@/types/driver-request-table-props.interface";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { columnsDriverRequestsTable } from "./data";

const DriverRequirementTable: React.FC<DriverRequestsTableProps> = ({
  driverRequirements,
}) => {
  const setName = useTextStore((state: any) => state.setName);
  const setLastName = useTextStore((state: any) => state.setLastName);
  const setIdentityDocumentUrl = useTextStore(
    (state: any) => state.setIdentityDocumentUrl
  );
  const setDriverLicenseUrl = useTextStore(
    (state: any) => state.setDriverLicenseUrl
  );
  const setCriminalRecordUrl = useTextStore(
    (state: any) => state.setCriminalRecordUrl
  );
  const setVehicleId = useTextStore((state: any) => state.setVehicleId);
  const setProfilePictureUrl = useTextStore(
    (state: any) => state.setProfilePictureUrl
  );
  const setId = useTextStore((state: any) => state.setId);
  const setEmail = useTextStore((state: any) => state.setEmail);
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {columnsDriverRequestsTable.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {driverRequirements.map((item, index) => (
            <TableRow key={`${item.userId}-${index}`}>
              <TableCell className=" font-medium  text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-lg">
                    <AvatarImage src={""} />
                    {/* <AvatarFallback>{item.firstName.charAt(0) + item.lastName.charAt(0)}</AvatarFallback> */}
                  </Avatar>
                </div>
              </TableCell>
              <TableCell>{`${item.userInfo?.firstName} ${item.userInfo?.lastName}`}</TableCell>
              <TableCell>{item.userInfo?.mobile}</TableCell>

              <TableCell>{item.userInfo?.email}</TableCell>
              <TableCell>
                <Badge
                  variant="soft"
                  color={
                    item.state == StatusRegisterDriver.PENDING
                      ? "warning"
                      : item.state == StatusRegisterDriver.REJECTED
                      ? "destructive"
                      : "warning"
                  }
                  className="capitalize rounded-md"
                >
                  {item.state == StatusRegisterDriver.PENDING
                    ? "Pendiente"
                    : item.state == StatusRegisterDriver.REJECTED
                    ? "Rechazado"
                    : "Pendiente"}
                </Badge>
              </TableCell>
              <TableCell className="ltr:pr-5 rtl:pl-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      color="secondary"
                      className=" h-7 rounded-full bg-transparent w-7 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground  "
                    >
                      <Icon
                        icon="heroicons:ellipsis-horizontal"
                        className=" h-6 w-6 "
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" avoidCollisions>
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* {getActionsForStatus(item.state, handleStatusUpdate, item)} */}


                    <Link
                      href={`/solicitudes/${item.id}`}
                      onClick={() => {
                        setName(item.userInfo?.firstName);
                        setLastName(item.userInfo?.lastName);
                        setIdentityDocumentUrl(item.identityDocumentUrl);
                        setDriverLicenseUrl(item.driverLicenseUrl);
                        setCriminalRecordUrl(item.criminalRecordUrl);
                        setVehicleId(item.vehicleId);
                        setProfilePictureUrl(item.userInfo?.profilePictureUrl);
                        setEmail(item.userInfo?.email);
                        setId(item.id);
                      }}
                    >
                      <DropdownMenuItem preventClose>
                        <Icon
                          icon={getIconModalDialog(ActionModalDialog.VIEW)}
                          className=" h-4 w-4 mr-2 "
                        />
                        {ActionModalDialog.VIEW}
                      </DropdownMenuItem>
                    </Link>

                    {/* <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon="heroicons:trash"
                            className=" h-4 w-4 mr-2 "
                          />
                          Eliminar
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás completamente seguro?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Eliminará
                            permanentemente su cuenta y eliminará sus datos de
                            nuestros servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className=" bg-secondary">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-destructive hover:bg-destructive/80"
                          >
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DriverRequirementTable;
