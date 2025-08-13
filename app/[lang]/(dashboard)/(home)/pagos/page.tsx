"use client";

import { User } from "@/types/user.interface";
import { Role } from "@/lib/enums";
import PaymentTable from "../../(tables)/tailwindui-table/pagos-table";
import { useFetchAllDrivers } from "@/hooks/use-fetch-driver-requirement";

const users: User[] = [
  {
    id: 1,
    mobile: "931883801",
    email: "piero@gmail.com",
    firstName: "Piero",
    lastName: "VR",
    latitude: 0,
    longitude: 0,
    ratingAveragePassenger: 3.5,
    ratingAverageDriver: 3.5,
    profilePictureUrl: "/images/avatar/avatar-9.jpg",
    userRoles: [Role.DRIVER],
  },
  {
    id: 2,
    mobile: "999111999",
    email: "conductor@gmail.com",
    firstName: "Jake",
    lastName: "BR",
    latitude: 0,
    longitude: 0,
    ratingAveragePassenger: 3.5,
    ratingAverageDriver: 3.5,
    profilePictureUrl: "/images/avatar/avatar-9.jpg",
    userRoles: [Role.DRIVER],
  },
];

// const DriversPage = () => {
//   const { drivers, loading, error } = useFetchAllDrivers();
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>Error: {error}</div>;
//   }
//   return (
//     <div>
//       <div className="text-2xl font-medium">Administrar Conductores</div>

//       <div className="mt-5 text-2xl font-medium text-default-900">
//         <DriverAllTable drivers={drivers} />
//       </div>
//     </div>
//   );
// };

const PagosPage = () => {
  const { drivers, loading, error } = useFetchAllDrivers();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl font-medium">
          Administrar pagos a conductores
        </div>
      </div>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <PaymentTable drivers={drivers} />
      </div>
    </div>
  );
};

export default PagosPage;
