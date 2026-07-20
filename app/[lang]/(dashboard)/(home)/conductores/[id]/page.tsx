"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithModal from "@/components/ui/image-with-modal";
import {
    useFetchGetDriverById,
    useFetchGetUserById,
    useFetchVehicleById,
} from "@/hooks/use-fetch-driver-requirement";
import Link from "next/link";
import { useParams } from "next/navigation";
import UserRetirtosTable from "../../../(tables)/tailwindui-table/user-retiros-table";
import UserTripTable from "../../../(tables)/tailwindui-table/user-trips-table";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateDataSolicitudes } from "@/services/driver-requirement.service";
import { logAuditEvent } from "@/lib/audit-logger";

const ConductoresByIdPage = () => {
  const { id } = useParams();
  const [openInhabilitarModal, setOpenInhabilitarModal] = useState(false);
  const [inhabilitarReason, setInhabilitarReason] = useState("");
  const [isInhabilitando, setIsInhabilitando] = useState(false);

  const { user, loading, error } = useFetchGetUserById(Number(id));
  const {
    driver,
    loading: driverLoading,
    error: driverError,
    refetch: refetchDriver,
  } = useFetchGetDriverById(Number(id));

  const {
    vehicle,
    loading: vehicleLoading,
    error: vehicleError,
  } = useFetchVehicleById(Number(driver?.vehicleId));

  const handleInhabilitarDriver = async () => {
    if (!id || !inhabilitarReason.trim()) return;
    setIsInhabilitando(true);
    try {
      await updateDataSolicitudes(id as string);
      logAuditEvent({
        action: "Inhabilitar Conductor",
        admin: "Administrador",
        targetUser: `${user?.firstName || "Conductor"} ${user?.lastName || ""} (#${id})`,
        role: "Driver",
        reason: inhabilitarReason,
        type: "disable",
      });
      alert("Conductor inhabilitado correctamente.");
      setOpenInhabilitarModal(false);
      if (refetchDriver) refetchDriver();
    } catch (err) {
      console.error("Error al inhabilitar conductor:", err);
      alert("No se pudo inhabilitar al conductor.");
    } finally {
      setIsInhabilitando(false);
    }
  };

  if (loading || driverLoading) {
    return <div>Loading...</div>;
  }
  if (error || driverError) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="flex-1 w-full h-full ">
        <div className="flex md:flex-row flex-col gap-8 ">
          <div className="w-full md:w-1/3 h-auto md:h-screen  ">
            <Card className="h-full flex-1">
              <CardContent style={{ padding: "30px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={
                        user?.profilePictureUrl ?? "/images/avatar/avatars.png"
                      }
                      alt="User Avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                  <h2
                    style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}
                  >
                    {user?.firstName ?? "N/A"} {user?.lastName ?? "N/A"}
                  </h2>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      color: "#444",
                      marginBottom: "10px",
                    }}
                  >
                    Información Personal
                  </h3>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: "0",
                      margin: "0",
                      color: "#555",
                    }}
                  >
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Nombre:</strong> {user?.firstName ?? "N/A"}
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Apellido:</strong> {user?.lastName ?? "N/A"}
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Teléfono:</strong> {user?.mobile ?? "N/A"}
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                      <strong>Correo:</strong> {user?.email ?? "N/A"}
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center mt-8 gap-3">
                  <Link href="/conductores">
                    <Button color="secondary" variant="outline" size={"lg"}>
                      Retroceder
                    </Button>
                  </Link>
                  <Button
                    color="destructive"
                    size={"lg"}
                    onClick={() => setOpenInhabilitarModal(true)}
                  >
                    Inhabilitar Conductor
                  </Button>
                </div>

                <Dialog open={openInhabilitarModal} onOpenChange={setOpenInhabilitarModal}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Inhabilitar Conductor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Por favor especifica el motivo por el cual estás inhabilitando a este conductor.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="inhabilitarReason">Motivo de la inhabilitación</Label>
                        <Textarea
                          id="inhabilitarReason"
                          placeholder="Ej: SOAT vencido / Documentación adulterada / Incidencia grave"
                          value={inhabilitarReason}
                          onChange={(e) => setInhabilitarReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenInhabilitarModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        color="destructive"
                        disabled={isInhabilitando || !inhabilitarReason.trim()}
                        onClick={handleInhabilitarDriver}
                      >
                        {isInhabilitando ? "Inhabilitando..." : "Confirmar Inhabilitación"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3">
            <Card className="mb-4">
              <CardContent style={{ padding: "30px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}
                  >
                    Información del Vehículo
                  </h2>
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Número de Placa:
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {vehicle?.plateNumber ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Marca:
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {vehicle?.vehicleMake?.name ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Modelo:
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {vehicle?.vehicleModel?.name ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Color:
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {vehicle?.vehicleColor ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Tipo de Servicio:
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {vehicle?.tripClasses.join(", ") ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Año de Fabricación:
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {vehicle?.year ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-around">
                  <ImageWithModal
                    imageUrl={vehicle?.vehiclePhotoUrl ?? ""}
                    altText="Foto del Vehículo"
                  />
                  <ImageWithModal
                    imageUrl={vehicle?.insuranceTrafficAccidentsUrl ?? ""}
                    altText="SOAT"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent style={{ padding: "30px" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                    Score de Rendimiento del Conductor
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="text-xs text-muted-foreground block font-medium">Calificación</span>
                    <span className="text-xl font-bold text-primary">⭐ 4.9 / 5</span>
                  </div>
                  <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                    <span className="text-xs text-muted-foreground block font-medium">Aceptación</span>
                    <span className="text-xl font-bold text-success">96%</span>
                  </div>
                  <div className="p-3 bg-info/5 rounded-lg border border-info/20">
                    <span className="text-xs text-muted-foreground block font-medium">Completados</span>
                    <span className="text-xl font-bold text-info">124 viajes</span>
                  </div>
                  <div className="p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <span className="text-xs text-muted-foreground block font-medium">Cancelación</span>
                    <span className="text-xl font-bold text-warning">2.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ padding: "30px", marginBottom: "30px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h2
                    style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}
                  >
                    Requisitos del conductor y Alertas de Documentos
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md border border-border">
                    <span className="text-xs font-semibold">DNI (Frontal y Reversa)</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${driver?.identityDocumentUrl ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                      {driver?.identityDocumentUrl ? "Válido" : "Faltante"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md border border-border">
                    <span className="text-xs font-semibold">Licencia de Conducir</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${driver?.driverLicenseUrl ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                      {driver?.driverLicenseUrl ? "Válido" : "Faltante"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md border border-border">
                    <span className="text-xs font-semibold">SOAT Vehicular</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${vehicle?.insuranceTrafficAccidentsUrl ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                      {vehicle?.insuranceTrafficAccidentsUrl ? "Válido" : "Próximo a Vencer"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-muted/40 rounded-md border border-border">
                    <span className="text-xs font-semibold">Antecedentes Penales</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${driver?.criminalRecordUrl ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                      {driver?.criminalRecordUrl ? "Válido" : "Faltante"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-around">
                  <ImageWithModal
                    imageUrl={user?.profilePictureUrl!}
                    altText="Foto de perfil"
                  />
                  <ImageWithModal
                    imageUrl={driver?.identityDocumentUrl!}
                    altText="Documento de identidad"
                  />
                </div>
                <div className="flex justify-around">
                  <ImageWithModal
                    imageUrl={driver?.identityDocumentReverseUrl!}
                    altText="Documento de identidad (Reversa)"
                  />
                  <ImageWithModal
                    imageUrl={driver?.driverLicenseUrl!}
                    altText="Licencia de conducir"
                  />
                </div>
                <div className="flex justify-around">
                  <ImageWithModal
                    imageUrl={driver?.criminalRecordUrl!}
                    altText="Antecedentes penales"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ padding: "30px", marginBottom: "30px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}
                  >
                    Historial de Viajes
                  </h2>
                </div>
                <UserTripTable id={Number(id)} role="passenger"></UserTripTable>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ padding: "30px", marginBottom: "30px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}
                  >
                    Historial de recargas
                  </h2>
                </div>
                <UserRetirtosTable></UserRetirtosTable>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductoresByIdPage;
