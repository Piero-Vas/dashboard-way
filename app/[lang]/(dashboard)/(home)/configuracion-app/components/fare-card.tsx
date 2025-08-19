"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DistanceRule, Fare } from "@/types/dashboard-data.interface";
import { Bike, Car, Edit, Package, User } from "lucide-react";

interface FareCardProps {
  fare: Fare;
  onEdit: () => void;
}

export function FareCard({ fare, onEdit }: FareCardProps) {
  const getVehicleIcon = (vehicleType: string) => {
    return vehicleType === "AUTO" ? (
      <Car className="h-4 w-4" />
    ) : (
      <Bike className="h-4 w-4" />
    );
  };

  const getTripIcon = (tripType: string) => {
    return tripType === "passenger" ? (
      <User className="h-4 w-4" />
    ) : (
      <Package className="h-4 w-4" />
    );
  };

  const getClassColor = (tripClass: string) => {
    switch (tripClass) {
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "comfort":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "spacious":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize flex items-center gap-2">
            {getVehicleIcon(fare.vehicleType)}
            {fare.vehicleType}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0 bg-transparent"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Badge className={getClassColor(fare.tripClass)}>
            {fare.tripClass}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {getTripIcon(fare.tripType)}
            {fare.tripType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Precio Base:</span>
          <span className="font-semibold">S/{fare.basePrice}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Reglas de Distancia:
          </h4>
          {fare.distanceRules.map((rule: DistanceRule) => (
            <div
              key={rule.id}
              className="flex justify-between text-sm bg-muted/50 p-2 rounded"
            >
              <span>
                {rule.minKm}km - {rule.maxKm ? `${rule.maxKm}km` : "∞"}
              </span>
              <span className="font-medium">S/{rule.pricePerKm} x km</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
