import React from "react";
import Image from "next/image";

const MetricCard = ({ title, iconSrc, metric, unit = "" }) => {
  return (
    <div className="statsCard">
      <p className="font-bold">{title}</p>
      <div className="statsCardContent">
        <Image alt="weatherIcon" src={iconSrc} height="100px" width="100px" />
        <div>
          <p className="text-3xl font-bold">{metric}</p>
          <p className="text-sm font-light">{unit}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
