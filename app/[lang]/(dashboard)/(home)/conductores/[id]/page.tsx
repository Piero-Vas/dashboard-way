"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithModal from "@/components/ui/image-with-modal";
import Link from "next/link";
import { useRouter } from "next/router";
import UserTripTable from "../../../(tables)/tailwindui-table/user-trips-table";
import UserReferedTable from "../../../(tables)/tailwindui-table/user-refered-table";
import UserRetirtosTable from "../../../(tables)/tailwindui-table/user-retiros-table";
import {
  useFetchGetDriverById,
  useFetchGetUserById,
  useFetchVehicleById,
} from "@/hooks/use-fetch-driver-requirement";
import { data } from "../../dashboard/components/data";
import { useParams } from "next/navigation";

const ConductoresByIdPage = () => {
  const { id } = useParams();

  const { user, loading, error } = useFetchGetUserById(Number(id));
  const {
    driver,
    loading: driverLoading,
    error: driverError,
  } = useFetchGetDriverById(Number(id));

  const {
    vehicle,
    loading: vehicleLoading,
    error: vehicleError,
  } = useFetchVehicleById(Number(driver?.vehicleId));

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

                <div className="flex justify-center mt-8 gap-4">
                  <Link href="/conductores">
                    <Button color="destructive" size={"xl"}>
                      Retroceder
                    </Button>
                  </Link>
                </div>
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

            <Card>
              <CardContent style={{ padding: "30px", marginBottom: "30px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "50px",
                  }}
                >
                  <h2
                    style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}
                  >
                    Requisitos del conductor
                  </h2>
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
