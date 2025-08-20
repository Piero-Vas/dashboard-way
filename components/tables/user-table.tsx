"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ActionModalDialog, StatusRegisterDriver } from "@/lib/enums";
import { getIconModalDialog } from "@/lib/utils";
import { useTextStore } from "@/store";
import { DriverRequestsTableProps } from "@/types/driver-request-table-props.interface";
import { DriversRequests } from "@/types/driver-requests";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { columnsDriverRequestsTable } from "./data";

const DriverRequirementTable: React.FC<DriverRequestsTableProps> = ({
  driverRequirements,
}) => {
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
          {driverRequirements.map((item: DriversRequests, index) => (
            <TableRow key={`${item.userId}-${index}`}>
              <TableCell className=" font-medium  text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-lg">
                    <AvatarImage
                      src={
                        item.userInfo?.profilePictureUrl != null
                          ? item.userInfo?.profilePictureUrl
                          : ""
                      }
                    />
                    <AvatarFallback>
                      {item.userInfo!.firstName.charAt(0) +
                        item.userInfo!.lastName.charAt(0)}
                    </AvatarFallback>
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

                    <Link href={`/solicitudes/${item.id}`}>
                      <DropdownMenuItem preventClose>
                        <Icon
                          icon={getIconModalDialog(ActionModalDialog.VIEW)}
                          className=" h-4 w-4 mr-2 "
                        />
                        {ActionModalDialog.VIEW}
                      </DropdownMenuItem>
                    </Link>
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
