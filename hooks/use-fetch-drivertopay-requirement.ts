import {
  fetchDriverRequirements,
  fetchPayoutTrips,
} from "@/services/driver-requirement.service";
import {
  PayoutDriversResponse,
  PayoutTrip,
} from "@/types/drivertopay.interface";
import { useEffect, useState } from "react";

export const usePayoutTrips = (id: number) => {
  const [trips, setTrips] = useState<PayoutTrip[]>([]);
  const [payoutInfo, setPayoutInfo] = useState<PayoutDriversResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadPayoutTrips = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPayoutTrips(id);

        if (response) {
          setPayoutInfo(response);
          setTrips(response.payoutTrips || []);
        } else {
          setTrips([]);
        }
      } catch (err) {
        console.error("Error al cargar viajes de payout:", err);
        setError("Error al cargar los viajes");
      } finally {
        setLoading(false);
      }
    };

    loadPayoutTrips();
  }, []);

  const getTripSummary = (trip: PayoutTrip) => {
    const tripData = trip.trip?.data;
    if (!tripData) return null;

    return {
      tripId: trip.tripId,
      payoutTripId: trip.id,
      paymentMethod: trip.paymentMethod,

      payment: {
        tripAmount: parseFloat(trip.tripAmount),
        earning: parseFloat(trip.earning),
        amountToPay: parseFloat(trip.amountToPay),
      },

      passenger: {
        id: tripData.user.id,
        name: `${tripData.user.firstName} ${tripData.user.lastName}`,
        mobile: tripData.user.mobile,
        email: tripData.user.email,
        rating: tripData.user.ratingAveragePassenger,
        profilePicture: tripData.user.profilePictureUrl,
      },

      driver: {
        id: tripData.driverUser.id,
        name: `${tripData.driverUser.firstName} ${tripData.driverUser.lastName}`,
        mobile: tripData.driverUser.mobile,
        email: tripData.driverUser.email,
        rating: tripData.driverUser.ratingAverageDriver,
        profilePicture: tripData.driverUser.profilePictureUrl,
      },

      vehicle: {
        id: tripData.vehicle.id,
        make: tripData.vehicle.vehicleMake.name,
        model: tripData.vehicle.vehicleModel.name,
        plate: tripData.vehicle.plateNumber,
        color: tripData.vehicle.vehicleColor,
        type: tripData.vehicle.vehicleType,
        year: tripData.vehicle.year,
        photo: tripData.vehicle.vehiclePhotoUrl,
      },

      route: {
        pickup: {
          name: tripData.pickupLocation.name,
          coordinates: {
            lat: tripData.pickupLocation.lat,
            lng: tripData.pickupLocation.lng,
          },
        },
        dropoff: tripData.dropoffLocations[0]
          ? {
              name: tripData.dropoffLocations[0].name,
              coordinates: {
                lat: tripData.dropoffLocations[0].lat,
                lng: tripData.dropoffLocations[0].lng,
              },
            }
          : null,
      },

      trip: {
        status: tripData.tripState,
        type: tripData.tripType,
        class: tripData.tripClass,
        requestType: tripData.requestType,
        offer: tripData.offer,
        amount: tripData.amount,
        detail: tripData.tripDetail,
        roomId: tripData.roomId,
      },

      features: {
        moreThanFourPassengers: tripData.moreThanFourPassengers,
        carryPet: tripData.carryPet,
        babyChair: tripData.babyChair,
        paidDriver: tripData.paidDriver,
      },
    };
  };

  // Función helper para obtener el total de montos a pagar
  const getTotalAmountToPay = () => {
    return trips.reduce(
      (total, trip) => total + parseFloat(trip.amountToPay),
      0
    );
  };

  return {
    payoutTrips: trips,
    loading,
    error,
  };
};
