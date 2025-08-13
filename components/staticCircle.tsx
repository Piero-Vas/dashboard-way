import React from "react";

const StaticCircle = ({ color = "#2563EB" }) => {
  return (
    <div className="relative w-4 h-4 flex items-center justify-center">
      {/* Círculo externo */}
      <div
        className="absolute w-full h-full rounded-full border-2"
        style={{ borderColor: color, backgroundColor: `${color}20` }} // 20% de opacidad
      />
      {/* Círculo interno */}
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default StaticCircle;
