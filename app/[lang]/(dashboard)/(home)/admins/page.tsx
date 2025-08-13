"use client";

import { Button } from "@/components/ui/button";
import DriverAllTable from "../../(tables)/tailwindui-table/user-table";
import UserTableAdmin from "../../(tables)/tailwindui-table/user-table-admin";
import DialogForm from "../../(components)/dialog/dialog-form";


const AdminPage = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl font-medium">Administrar Administradores</div>
        <DialogForm />
      </div>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <UserTableAdmin />
      </div>
    </div>
  );
};

export default AdminPage;
