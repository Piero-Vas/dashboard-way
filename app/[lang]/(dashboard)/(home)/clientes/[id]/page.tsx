"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchGetUserById } from "@/hooks/use-fetch-driver-requirement";
import Link from "next/link";
import UserTripTable from "../../../(tables)/tailwindui-table/user-trips-table";
import { useParams } from "next/navigation";
import { useFetchAllTripsByUser } from "@/hooks/use-fetch-user-requirement";

const ClientesByIdPage = () => {
  const { id } = useParams();

  const { user, loading, error } = useFetchGetUserById(Number(id));

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
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
                        user?.profilePictureUrl ??
                        "/images/avatar/avataaars.png"
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
                  <Link href="/clientes">
                    <Button color="destructive" size={"xl"}>
                      Retroceder
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesByIdPage;
