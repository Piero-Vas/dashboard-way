import { StatusDriverRequirement } from "@/lib/enums";
import {
  deleteDriverRequirementStatus,
  fetchAllConfigs,
  fetchAllDrivers,
  fetchAllDriversToPay,
  fetchAllPassengers,
  fetchDataDriverById,
  fetchDataUserById,
  fetchDataVehicleById,
  fetchDriverAllRequests,
  fetchDriverRequirementById,
  fetchDriverRequirements,
  updateDriverRequirement,
  updateDriverRequirementStatus,
} from "@/services/driver-requirement.service";
import { DriversRequests } from "@/types/driver-requests";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import {
  Configs,
  Driver,
  DriverResponse,
  PayoutDrivers,
  User,
  VehicleResponse,
} from "@/types/user.interface";
import { useEffect, useState } from "react";

export const useFetchDriverRequirements = () => {
  const [driverRequirements, setDriverRequirements] = useState<
    DriverRequirement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchDriverRequirements();
        setDriverRequirements(data.data);
      } catch (err) {
        console.error("Failed to fetch DriverRequirement:", err);
        setError("Failed to load DriverRequirement");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driverRequirements, loading, error };
};

export const useFetchDriverRequirementById = (id: number) => {
  const [driverRequirement, setDriverRequirement] =
    useState<DriverRequirement>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchDriverRequirementById(id);
        setDriverRequirement(data.data);
      } catch (err) {
        console.error("Failed to fetch DriverRequirement:", err);
        setError("Failed to load DriverRequirement");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driverRequirement, loading, error };
};

export const handleStatusUpdate = async (
  id: number,
  driverRequirement: DriverRequirement,
  status: StatusDriverRequirement
) => {
  try {
    driverRequirement.status = status;
    await updateDriverRequirementStatus(id, driverRequirement);
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
  }
};

export const handleUpdate = async (
  id: number,
  driverRequirement: DriversRequests
) => {
  try {
    await updateDriverRequirement(id, driverRequirement);
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
};

export const handleDelete = async (id: number) => {
  try {
    await deleteDriverRequirementStatus(id);
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
  }
};

export const useFetchAllDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const loadDriverRequirement = async () => {
    setLoading(true);
    try {
      const data = await fetchAllDrivers();
      console.log(data.data);
      setDrivers(data.data);
    } catch (err) {
      console.error("Failed to fetch solicitudes:", err);
      setError("Failed to load solicitudes");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDriverRequirement();
  }, []);

  return { drivers, loading, error, refetch: loadDriverRequirement };
};

export const useFetchAllDriversToPay = () => {
  const [driversToPay, setDriversToPay] = useState<PayoutDrivers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchAllDriversToPay();
        console.log("Respuesta de la API:", data);

        setDriversToPay(data);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setError("Failed to load drivers");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driversToPay, loading, error };
};

export const useFetchAllConfigs = () => {
  const [configs, setConfigs] = useState<Configs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchAllConfigs();
        console.log(data.data);
        setConfigs(data.data);
      } catch (err) {
        console.error("Failed to fetch solicitudes:", err);
        setError("Failed to load solicitudes");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { configs, loading, error };
};

export const useFetchAllPassengers = () => {
  const [passengers, setPassengers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const loadDriverRequirement = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPassengers();
      console.log(data.data);
      setPassengers(data.data);
    } catch (err) {
      console.error("Failed to fetch solicitudes:", err);
      setError("Failed to load solicitudes");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDriverRequirement();
  }, []);

  return { passengers, loading, error, refetch: loadDriverRequirement };
};

export const useFetchGetUserById = (id: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchUserById = async (id: number) => {
      setLoading(true);
      try {
        const data = await fetchDataUserById(id);
        console.log("Datos usuario:", data);
        setUser(data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserById(id);
  }, [id]);

  return { user, loading, error };
};

export const useFetchGetDriverById = (id: number) => {
  const [driver, setDriver] = useState<DriverResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchUserById = async (id: number) => {
      setLoading(true);
      try {
        const data = await fetchDataDriverById(id);
        console.log("Datos conductor:", data);
        setDriver(data.data);
      } catch (err) {
        console.error("Failed to fetch driver:", err);
        setError("Failed to load driver");
      } finally {
        setLoading(false);
      }
    };

    fetchUserById(id);
  }, [id]);

  return { driver, loading, error };
};

export const useFetchVehicleById = (id: number) => {
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchUserById = async (id: number) => {
      setLoading(true);
      try {
        const data = await fetchDataVehicleById(id);
        console.log("Datos vehículo:", data);
        setVehicle(data.data);
      } catch (err) {
        console.error("Failed to fetch driver:", err);
        setError("Failed to load driver");
      } finally {
        setLoading(false);
      }
    };

    fetchUserById(id);
  }, [id]);

  return { vehicle, loading, error };
};

export const useFetchAllSolicitudes = () => {
  const [driverRequirements, setDriverRequirements] = useState<
    DriversRequests[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchDriverAllRequests();

        const updatedData = await Promise.all(
          data.data.map(async (request: DriversRequests) => {
            try {
              const userInfo = await fetchDataUserById(request.userId);
              return {
                ...request,
                userInfo: userInfo.data, // Agregar la información del usuario al objeto original
              };
            } catch (err) {
              console.error(
                `Failed to fetch user info for idUser ${request.userId}:`,
                err
              );
              return {
                ...request,
                userInfo: null, // En caso de error, asignar null o manejarlo como prefieras
              };
            }
          })
        );
        console.log(updatedData);
        setDriverRequirements(updatedData);
      } catch (err) {
        console.error("Failed to fetch solicitudes:", err);
        setError("Failed to load solicitudes");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driverRequirements, loading, error };
};
