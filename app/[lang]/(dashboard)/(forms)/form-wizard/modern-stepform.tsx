"use client";
import React from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import Link from "next/link";
const ModernStepForm = () => {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const steps = [
    {
      label: "Información de la cuenta",
      content: "",
    },
    {
      label: "Datos del vehículo",
      content: "",
    },
    {
      label: "Resumen",
      content: "",
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = () => {
    toast({
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 top-0 right-0">
          <p className="text-primary-foreground">
            Conductor registrado correctamente
          </p>
        </div>
      ),
    });
  };

  const conductores = [
    { id: 1, nombre: "Piero Vasquez" },
    { id: 2, nombre: "Juan Pérez" },
    { id: 3, nombre: "María López" },
    { id: 4, nombre: "Ana Torres" },
  ];

  const [busqueda, setBusqueda] = React.useState("");
  const [conductorSeleccionado, setConductorSeleccionado] = React.useState<
    string | undefined
  >(undefined);
  const [mostrarOpciones, setMostrarOpciones] = React.useState(false);

  const conductoresFiltrados = conductores.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="text-2xl font-medium mb-4">Crear nuevo conductor</div>

      {/* crea un input select de nombre y apellido (juntos) pero que se filtre con un input arriba de ese */}
      <div className="col-span-12 lg:col-span-6 relative mb-4">
        <Label>Buscar y seleccionar conductor</Label>
        <Input
          type="text"
          placeholder="Escribe nombre o apellido"
          value={
            conductorSeleccionado
              ? conductores.find(
                  (c) => c.id.toString() === conductorSeleccionado
                )?.nombre || busqueda
              : busqueda
          }
          onChange={(e) => {
            setBusqueda(e.target.value);
            setConductorSeleccionado(undefined);
            setMostrarOpciones(true);
          }}
          onFocus={() => setMostrarOpciones(true)}
          autoComplete="off"
        />
        {mostrarOpciones && busqueda && (
          <div className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
            {conductoresFiltrados.length === 0 ? (
              <div className="p-2 text-gray-500">Sin resultados</div>
            ) : (
              conductoresFiltrados.map((c) => (
                <div
                  key={c.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setConductorSeleccionado(c.id.toString());
                    setBusqueda(c.nombre);
                    setMostrarOpciones(false);
                  }}
                >
                  {c.nombre}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-3 xl:border-r xl:border-default-200 ">
          <Stepper current={activeStep} direction="vertical">
            {steps.map((label: any) => {
              const stepProps: any = {};
              const labelProps: any = {};
              return (
                <Step key={label.label} {...stepProps}>
                  <StepLabel {...labelProps}>
                    <div className="flex flex-col">
                      <span> {label.label}</span>
                      <span> {label.content}</span>
                    </div>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>
        <div className="col-span-12 xl:col-span-9">
          {activeStep === steps.length ? (
            <React.Fragment>
              <div className="mt-2 mb-2 font-semibold text-center">
                Conductor registrado
              </div>
              <div className="flex pt-2">
                <div className=" flex-1" />
                <Link href="/conductores">
                  <Button
                    size="xs"
                    variant="outline"
                    color="destructive"
                    className="cursor-pointer"
                  >
                    Cerrar
                  </Button>
                </Link>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <form>
                <div className="grid grid-cols-12 gap-4">
                  {activeStep === 0 && (
                    <>
                      <div className="col-span-12 ">
                        <h4 className="text-sm font-medium text-default-600">
                          Ingresa tu información de cuenta
                        </h4>
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label>Nombre</Label>
                        <Input type="text" placeholder="Ingresar nombre" />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label>Apellido</Label>

                        <Input type="email" placeholder="Ingresar apellido" />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label>Correo</Label>
                        <Input type="text" placeholder="Ingresar correo" />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <Label>Teléfono</Label>
                        <Input type="text" placeholder="Ingresar teléfono" />
                      </div>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <div className="col-span-12 ">
                        <h4 className="text-sm font-medium text-default-600">
                          Datos del vehículo
                        </h4>
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <Label>Placa</Label>

                        <Input type="email" placeholder="Ingresar placa" />
                      </div>
                      <div className="col-span-12 lg:col-span-6"></div>
                      <div className="col-span-12 lg:col-span-4">
                        <Label>Marca</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Marca" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">AC</SelectItem>
                            <SelectItem value="french">AMC</SelectItem>
                            <SelectItem value="spanish">TOYOTA</SelectItem>
                            <SelectItem value="arabic">AUDI</SelectItem>
                            <SelectItem value="bangla">ADLER</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-12 lg:col-span-4">
                        <Label>Modelo</Label>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Modelo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">D3 S</SelectItem>
                            <SelectItem value="french">B3 GT</SelectItem>
                            <SelectItem value="spanish">D4 S</SelectItem>
                            <SelectItem value="arabic">ALPINA B8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-12 lg:col-span-4"></div>
                      <div className="col-span-12 lg:col-span-4">
                        <Label>Color</Label>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">Gris</SelectItem>
                            <SelectItem value="french">Plata</SelectItem>
                            <SelectItem value="spanish">Blanco</SelectItem>
                            <SelectItem value="arabic">Negro</SelectItem>
                            <SelectItem value="bangla">Amarillo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-12 lg:col-span-4">
                        <Label>Año de fabricación</Label>

                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Año de fabricación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="french">2024</SelectItem>
                            <SelectItem value="spanish">2023</SelectItem>
                            <SelectItem value="arabic">2022</SelectItem>
                            <SelectItem value="bangla">2021</SelectItem>
                            <SelectItem value="bangla">2020</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {activeStep === 2 && (
                    <>
                      <div className="col-span-12 ">
                        <h4 className="text-sm font-medium text-default-700">
                          Información de la cuenta
                        </h4>
                        <hr></hr>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Nombre:</p>
                        <p>Piero</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Apellido:</p>
                        <p>Vasquez Riveros</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Correo:</p>
                        <p>pierovr@gmail.com</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Teléfono:</p>
                        <p>+51 931883801</p>
                      </div>
                      <div className="col-span-12 ">
                        <h4 className="text-sm font-medium text-default-700">
                          Datos del vehículo
                        </h4>
                        <hr></hr>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Placa:</p>
                        <p>S2D-X12</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Marca:</p>
                        <p>BMW</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Modelo:</p>
                        <p>Z4</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Color:</p>
                        <p>Rojo</p>
                      </div>
                      <div className="col-span-12 lg:col-span-6 flex gap-2">
                        <p className="font-bold">Año de fabricación:</p>
                        <p>2021</p>
                      </div>
                    </>
                  )}
                </div>
              </form>

              <div className="flex pt-2 ">
                <Button
                  size="xs"
                  variant="outline"
                  color="secondary"
                  className={cn("cursor-pointer", {
                    hidden: activeStep === 0,
                  })}
                  onClick={handleBack}
                >
                  Atras
                </Button>
                <div className="flex-1	gap-4 " />
                <div className="flex	gap-2 ">
                  {activeStep === steps.length - 1 ? (
                    <Button
                      size="xs"
                      variant="outline"
                      color="success"
                      className="cursor-pointer"
                      onClick={() => {
                        if (onSubmit) onSubmit();
                        handleNext();
                      }}
                    >
                      Enviar
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      variant="outline"
                      color="secondary"
                      className="cursor-pointer"
                      onClick={handleNext}
                    >
                      Siguiente
                    </Button>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernStepForm;
