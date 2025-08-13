import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithModal from "@/components/ui/image-with-modal";
import Link from "next/link";
import { useRouter } from "next/router";
import UserReferedTable from "../../../(tables)/tailwindui-table/user-refered-table";
import UserTripTable from "../../../(tables)/tailwindui-table/user-trips-table";
import UserRetirtosTable from "../../../(tables)/tailwindui-table/user-retiros-table";

const ClientesByIdPage = () => {
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
                  src="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/FCMImages%2Fmike.jpg?alt=media&token=4be4480a-75ae-4646-b880-0922e8aafa33"
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
                John Doe
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
                  <strong>Nombre:</strong> John
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Apellido:</strong> Doe
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Fecha de Registro:</strong> 28/12/2024
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Teléfono:</strong> +51 931883801
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Correo:</strong> john.doe@example.com
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

        <main
          style={{
            marginLeft: "500px",
            padding: "0px 20px",
            overflowY: "auto",
            flex: 1,
            height: "100vh",
          }}
        >
          {/* <Card className="mb-4">
            <CardContent style={{ padding: "30px" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Listado de Referidos
                </h2>
              </div>
              <UserReferedTable></UserReferedTable>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent style={{ padding: "30px", marginBottom: "30px" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Historial de Viajes
                </h2>
              </div>
              <UserTripTable></UserTripTable>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent style={{ padding: "30px", marginBottom: "30px" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Historial de recargas
                </h2>
              </div>
              <UserRetirtosTable></UserRetirtosTable>
            </CardContent>
          </Card> */}
        </main>
      </div>
    </div>
  );
};

export default ClientesByIdPage;
