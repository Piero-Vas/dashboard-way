"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { usePayoutTrips } from "@/hooks/use-fetch-drivertopay-requirement";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const pagoSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    monto: z
      .number()
      .positive("El monto debe ser positivo")
      .min(1, "El monto debe ser mayor a 0"),
    metodoPago: z.enum(["Efectivo", "Tarjeta"]),
    numeroCuenta: z.string().optional(),
    archivo: z.instanceof(File, { message: "El archivo es obligatorio" }),
    comentarios: z
      .string()
      .max(200, "El comentario no puede exceder los 200 caracteres")
      .optional(),
  })
  .refine(
    (data) => {
      // Validamos que numeroCuenta sea obligatorio solo si el metodoPago es "Tarjeta"
      if (data.metodoPago === "Tarjeta" && !data.numeroCuenta) {
        return false;
      }
      return true;
    },
    {
      message:
        "El número de cuenta es obligatorio cuando el método de pago es Tarjeta",
      path: ["numeroCuenta"],
    }
  );

const PagosManualScreen = () => {
  const { id } = useParams();

  const [viajes, setViajes] = useState([
    {
      id: 1,
      origen: "Lima",
      destino: "Callao",
      precio: 100,
      metodoPago: "Tarjeta",
    },
    {
      id: 2,
      origen: "Miraflores",
      destino: "San Isidro",
      precio: 75,
      metodoPago: "Efectivo",
    },
  ]);
  let totalGanancias = viajes
    .reduce((acc, viaje) => {
      return viaje.metodoPago === "Tarjeta"
        ? acc + viaje.precio * 0.9
        : acc + viaje.precio * 0.1;
    }, 0)
    .toFixed(2);

  const [metodoPago, setMetodoPago] = useState(""); // Estado para el método de pago
  const [formData, setFormData] = useState({
    nombre: "",
    monto: parseFloat(totalGanancias),
    metodoPago: "",
    numeroCuenta: "",
    archivo: null as File | null,
    comentarios: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string>(
    "https://via.placeholder.com/300x400"
  );
  const [openPreview, setOpenPreview] = useState(false);

  const handleMetodoPagoChange = (event: any) => {
    setMetodoPago(event.target.value);
    setFormData({ ...formData, metodoPago: event.target.value });
  };

  const [open, setOpen] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validamos el formulario usando Zod
    try {
      const parsedData = pagoSchema.parse(formData);
      console.log("Formulario válido:", parsedData);

      setOpen(true); // Abrimos el modal de confirmación

      //   mostrar un modal de confirmación con 2 inputs, usuario y contraseña, no usar prompt
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          console.error(`${err.path[0]}: ${err.message}`); // Imprime los errores de validación
        });
        if (error.errors[0].path[0] === "metodoPago") {
          toast({
            title: "Error",
            description:
              "Seleccione un método de pago válido (Efectivo o Tarjeta)",
          });
        } else {
          toast({
            title: "Error",
            description: error.errors[0].message,
          });
        }
      }
    }
  };

  const { payoutTrips, loading, error } = usePayoutTrips(Number(id));

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("payoutTrips", payoutTrips);

  return (
    <>
      {payoutTrips !== null && payoutTrips.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent size="2xl" className="max-w-4xl w-[80%] p-6">
              {/* validacion de usuario y contraseña */}
              <h2 className="text-lg font-semibold mb-2">
                ¿Está seguro de que desea realizar el pago manual?
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="usuario"
                  className="block text-sm font-medium mb-1"
                >
                  Usuario
                </label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Ingrese su usuario"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contraseña"
                  className="block text-sm font-medium mb-1"
                >
                  Contraseña
                </label>
                <Input
                  id="contraseña"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  color="success"
                  onClick={() => {
                    setOpen(false);
                    toast({
                      title: "Pago realizado",
                      description: "El pago se ha realizado correctamente.",
                    });
                  }}
                >
                  Confirmar Pago
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div>
            {/* Listado de Viajes */}

            <div className="col-span-1">
              <h2 className="text-lg font-semibold mb-3">
                Historial de Viajes
              </h2>

              <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hidden">
                {viajes.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`p-4 rounded-lg text-white ${
                      viaje.metodoPago === "Tarjeta"
                        ? "bg-green-100"
                        : "bg-red-100"
                    } flex justify-between`}
                  >
                    <div>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Origen:</strong> {viaje.origen}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Destino:</strong> {viaje.destino}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Precio:</strong> S/ {viaje.precio.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>{"Ganancia"}:</strong> S/{" "}
                        {(viaje.metodoPago === "Tarjeta"
                          ? viaje.precio * 0.9
                          : viaje.precio * 0.1
                        ).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Método de Pago:</strong> {viaje.metodoPago}
                      </p>
                    </div>
                    <div>
                      <Link href={"/1/viajes"}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                        >
                          <Icon icon="heroicons:map-pin" className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Balance, en verde y en rojo */}
            <div>
              <h2 className="text-lg font-semibold mb-3 mt-6">Balance</h2>
              <div className="flex flex-col bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-green-600">
                  <strong>Tarjetas:</strong> S/{" "}
                  {viajes
                    .reduce((acc, viaje) => {
                      return viaje.metodoPago === "Tarjeta"
                        ? acc + viaje.precio * 0.9
                        : acc;
                    }, 0)
                    .toFixed(2)}
                </p>

                <p className="text-sm text-red-600">
                  <strong>Ejectivo:</strong> S/{" "}
                  {viajes
                    .reduce((acc, viaje) => {
                      return viaje.metodoPago === "Efectivo"
                        ? acc + viaje.precio * 0.1
                        : acc;
                    }, 0)
                    .toFixed(2)}
                </p>
                <p className="text-sm text-gray-800">
                  <strong>Total Ganancias:</strong> S/{totalGanancias}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de Pagos Manuales */}
          <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Realizar Pago Manual</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium mb-1"
                >
                  Nombre del Conductor
                </label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ingrese el nombre del conductor"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="monto"
                  className="block text-sm font-medium mb-1"
                >
                  Monto a Pagar (S/)
                </label>
                <Input
                  id="monto"
                  type="number"
                  disabled
                  placeholder="Ingrese el monto a pagar"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monto: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="metodoPago"
                  className="block text-sm font-medium mb-1"
                >
                  Método de Pago
                </label>
                <select
                  id="metodoPago"
                  value={metodoPago}
                  onChange={handleMetodoPagoChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione un método</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              {/* Campo Número de Cuenta solo si el método es Tarjeta */}
              {metodoPago === "Tarjeta" && (
                <div className="mb-4">
                  <label
                    htmlFor="numeroCuenta"
                    className="block text-sm font-medium mb-1"
                  >
                    Número de Cuenta
                  </label>
                  <Input
                    id="numeroCuenta"
                    type="text"
                    placeholder="Ingrese el número de cuenta"
                    value={formData.numeroCuenta}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        numeroCuenta: e.target.value,
                      });
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
              {/* agregar input para subir archivo y una preview del archivo */}
              <div className="mb-4">
                <label
                  htmlFor="archivo"
                  className="block text-sm font-medium mb-1"
                >
                  Subir Archivo
                </label>
                <Input
                  id="archivo"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, archivo: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept=".jpg, .jpeg, .png, .pdf"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4 h-[400px] w-[300px] overflow-hidden">
                <label
                  htmlFor="preview"
                  className="block text-sm font-medium mb-1"
                >
                  Vista Previa
                </label>
                <img
                  id="preview"
                  src={previewUrl}
                  alt="Vista Previa"
                  className="w-[300px] h-[400px] object-cover   mb-2 cursor-pointer transition  "
                  height={400}
                  width={300}
                  onClick={() => setOpenPreview(true)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comentarios"
                  className="block text-sm font-medium mb-1"
                >
                  Comentarios
                </label>
                <textarea
                  id="comentarios"
                  placeholder="Comentarios adicionales"
                  value={formData.comentarios}
                  onChange={(e) =>
                    setFormData({ ...formData, comentarios: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <Button color="success" className="w-full mt-4">
                Realizar Pago
              </Button>
            </form>
          </div>
          <Dialog open={openPreview} onOpenChange={setOpenPreview}>
            <DialogContent className="flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Vista Previa Grande"
                className="max-w-full max-h-[80vh] rounded"
                style={{ objectFit: "contain" }}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-3">
                No hay viajes por pagar
              </h2>
              <p className="text-gray-600 mb-6">
                No hay viajes registrados para el conductor
              </p>
              <Link href="/pagos">
                <Button color="success" className="w-full mt-4">
                  Volver a Pagos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PagosManualScreen;
