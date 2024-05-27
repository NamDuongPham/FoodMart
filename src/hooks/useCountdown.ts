import { useEffect, useState } from "react";

export const useCountdowwn = (
  initialTIme: number,
  callback: () => void,
  interval = 1000
) => {
  const [time, setTime] = useState(initialTIme);
  useEffect(() => {
    const customInterval = setInterval(() => {
      if (time > 0) setTime((prev) => prev - interval);
    }, interval);
    if (time === 0) {
      callback();
      setTime(initialTIme);
    }
    return () => clearInterval(customInterval);
  }, [callback, initialTIme, interval, time]);
  const formatTime = () => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${hours}hr : ${minutes}m : ${seconds}s`;
  };

  return formatTime();
};
