import React from "react";
import { AlertCircle } from "lucide-react";

const Alert = ({ title, description, type = "info" }) => {
  const alertStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    error: "bg-red-100 text-red-800 border-red-400",
    success: "bg-green-100 text-green-800 border-green-400",
  };

  return (
    <div
      className={`flex items-start p-4 border-l-4 rounded-lg ${alertStyles[type]}`}
    >
      <AlertCircle className="w-5 h-5 mr-2" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Alert;
