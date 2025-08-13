import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithModal from "@/components/ui/image-with-modal";
import Link from "next/link";
import { useRouter } from "next/router";
import UserTripTable from "../../../(tables)/tailwindui-table/user-trips-table";
import UserReferedTable from "../../../(tables)/tailwindui-table/user-refered-table";
import UserRetirtosTable from "../../../(tables)/tailwindui-table/user-retiros-table";

const ConductoresByIdPage = () => {
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
              <Link href="/conductores">
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
          <Card className="mb-4">
            <CardContent style={{ padding: "30px" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
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
                      ABC-123
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
                      Toyota
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
                      Corolla
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
                      Blanco
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
                      Estandar
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
                      2020
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-around">
                <ImageWithModal
                  imageUrl="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/photos%2F1082bf36-5eb3-40d5-8eb2-d796a07247875963493501808199610.jpg?alt=media&token=f121cec0-ba96-47a9-a76c-a7c4657a9de9"
                  altText="Foto del Vehículo"
                />
                <ImageWithModal
                  imageUrl="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/photos%2F394d6cf6-ca62-42a4-afbb-34ef3eae3d662062045814201270588.jpg?alt=media&token=9ddf7ade-0e31-46c8-b87a-810ebc926533"
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
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Requisitos del conductor
                </h2>
              </div>
              <div className="flex justify-around">
                <ImageWithModal
                  imageUrl="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/FCMImages%2Fmike.jpg?alt=media&token=4be4480a-75ae-4646-b880-0922e8aafa33"
                  altText="Foto de perfil"
                />
                <ImageWithModal
                  imageUrl="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/photos%2F1f4ca37c-76b2-4cb4-88f6-4963a9f22fb13762385195834662042.jpg?alt=media&token=6e6a60e5-011a-4a46-9eeb-bba65132046e"
                  altText="Documento de identidad"
                />
              </div>
              <div className="flex justify-around">
                <ImageWithModal
                  imageUrl="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/photos%2F248a89e4-479f-4e4b-ac95-0265feeecb3e4910727021847944640.jpg?alt=media&token=d3b64349-6468-456a-8271-44fdfce86438"
                  altText="Licencia de conducir"
                />
                <ImageWithModal
                  imageUrl="https://firebasestorage.googleapis.com/v0/b/ride-b0372.appspot.com/o/photos%2F35ce8a00-3631-4cf0-b338-8fcff07b2a256485062074978864400.jpg?alt=media&token=87e78665-ab5e-4019-bc1e-63566c9ff6af"
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
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Historial de Viajes
                </h2>
              </div>
              <UserTripTable></UserTripTable>
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
                <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
                  Historial de recargas
                </h2>
              </div>
              <UserRetirtosTable></UserRetirtosTable>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ConductoresByIdPage;
