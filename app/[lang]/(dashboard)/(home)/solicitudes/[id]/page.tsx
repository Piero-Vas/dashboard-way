"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithModal from "@/components/ui/image-with-modal";
import { useTextStore } from "@/store";
import Link from "next/link";
import { data } from "../../ecommerce/components/orders/data";
import { updateDataSolicitudes } from "@/services/driver-requirement.service";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAccessToken } from "../../constants";
type DriverApiResponse = {
  status: string;
  data: DriverData;
};

type DriverData = {
  userId: number;
  identityDocumentUrl: string;
  driverLicenseUrl: string;
  criminalRecordUrl: string;
  vehicleId: number;
  state: string;
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  };
  paymentMethods: string[];
  tripTypes: string[];
};

type UserApiResponse = {
  status: string;
  data: {
    id: number;
    mobile: string;
    email: string;
    firstName: string;
    lastName: string;
    latitude: number;
    longitude: number;
    userRoles: string[];
    ratingAveragePassenger: number;
    ratingAverageDriver: number;
    profilePictureUrl: string;
  };
};

type VehicleApiResponse = {
  status: string;
  data: {
    id: number;
    userId: number;
    vehicleMake: {
      id: number;
      name: string;
    };
    vehicleModel: {
      id: number;
      name: string;
      makeId: number;
    };
    year: number;
    plateNumber: string;
    vehicleType: string;
    tripClasses: string[];
    vehicleColor: string;
    state: string;
    vehiclePhotoUrl: string;
    insuranceTrafficAccidentsUrl: string;
  };
};

const keyRide = getAccessToken();
const SolicitudPage = () => {
  const params = useParams();
  const idDriver = params.id as string;
  const token = keyRide;

  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [userData, setUserData] = useState<UserApiResponse["data"] | null>(
    null
  );
  const [loadingUser, setLoadingUser] = useState(true);
  const [vehicleData, setVehicleData] = useState<
    VehicleApiResponse["data"] | null
  >(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);

  const name = useTextStore((state: any) => state.name);
  const lastName = useTextStore((state: any) => state.lastName);
  const identityDocumentUrl = useTextStore(
    (state: any) => state.identityDocumentUrl
  );
  const driverLicenseUrl = useTextStore((state: any) => state.driverLicenseUrl);
  const criminalRecordUrl = useTextStore(
    (state: any) => state.criminalRecordUrl
  );
  const vehicleId = useTextStore((state: any) => state.vehicleId);
  const profilePictureUrl = useTextStore(
    (state: any) => state.profilePictureUrl
  );
  const email = useTextStore((state: any) => state.email);
  const id = useTextStore((state: any) => state.id);

  useEffect(() => {
    if (!idDriver) return;
    setLoadingDriver(true);
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/driver/${idDriver}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: DriverApiResponse) => {
        setDriverData(data.data);
        if (data.data?.userId) {
          setLoadingUser(true);
          fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/user/${data.data.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => res.json())
            .then((user: UserApiResponse) => setUserData(user.data))
            .finally(() => setLoadingUser(false));
        }
      })
      .finally(() => setLoadingDriver(false));
  }, [idDriver]);

  useEffect(() => {
    if (!driverData?.vehicleId) return;
    setLoadingVehicle(true);
    fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/vehicle/${driverData.vehicleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data: VehicleApiResponse) => setVehicleData(data.data))
      .finally(() => setLoadingVehicle(false));
  }, [driverData?.vehicleId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}

        <Card
          style={{
            width: "500px",
            flexShrink: 0,
            position: "fixed",
            height: "100vh",
          }}
        >
          <CardContent style={{ padding: "30px" }}>
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={driverData?.user.profilePictureUrl}
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
              <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                {driverData?.user.firstName} {driverData?.user.lastName}
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
                  <strong>Nombre:</strong> {driverData?.user.firstName}
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Apellido:</strong> {driverData?.user.lastName}
                </li>
                {/* <li style={{ marginBottom: "10px" }}>
                  <strong>Fecha de Registro:</strong> 28/12/2024
                </li> */}
                <li style={{ marginBottom: "10px" }}>
                  <strong>Teléfono:</strong> {userData?.mobile}
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Correo:</strong> {userData?.email}
                </li>
              </ul>
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <Link href="/solicitudes">
                <Button color="destructive" size={"xl"}>
                  Retroceder
                </Button>
              </Link>

              <Button
                color="success"
                size={"xl"}
                onClick={async () => {
                  console.log("id", id);
                  try {
                    const data = await updateDataSolicitudes(id);
                    console.log("data", data);
                  } catch (err) {
                    console.error(" error", err);
                  } finally {
                    console.log("finished");
                  }
                }}
              >
                Aprobar solicitud
              </Button>
            </div>
          </CardContent>
        </Card>

        <main
          style={{
            marginLeft: "500px",
            padding: "0px 20px",
            overflowY: "auto",
            flex: 1,
            height: "100vh",
          }}
        >
          <Card className="mb-4">
            <CardContent style={{ padding: "30px" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Información del Vehículo
                </h2>
              </div>
              {loadingVehicle ? (
                <div>Cargando vehículo...</div>
              ) : vehicleData ? (
                <>
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
                          {vehicleData.plateNumber}
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
                          {vehicleData.vehicleMake.name}
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
                          {vehicleData.vehicleModel.name}
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
                          {vehicleData.vehicleColor}
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
                          {vehicleData.tripClasses.join(", ")}
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
                          {vehicleData.year}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-around">
                    <ImageWithModal
                      imageUrl={vehicleData.vehiclePhotoUrl}
                      altText="Foto del Vehículo"
                    />
                    <ImageWithModal
                      imageUrl={vehicleData.insuranceTrafficAccidentsUrl}
                      altText="SOAT"
                    />
                  </div>
                </>
              ) : (
                <div>No se encontró información del vehículo.</div>
              )}
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
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Requisitos del conductor
                </h2>
              </div>
              <div className="flex justify-around">
                <ImageWithModal
                  imageUrl={userData?.profilePictureUrl!}
                  altText="Foto de perfil"
                />
                <ImageWithModal
                  imageUrl={driverData?.identityDocumentUrl!}
                  altText="Documento de identidad"
                />
              </div>
              <div className="flex justify-around">
                <ImageWithModal
                  imageUrl={driverData?.driverLicenseUrl!}
                  altText="Licencia de conducir"
                />
                <ImageWithModal
                  imageUrl={driverData?.criminalRecordUrl!}
                  altText="Antecedentes penales"
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default SolicitudPage;
