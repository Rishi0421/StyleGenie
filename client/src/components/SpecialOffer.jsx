"use client";

import { useState, useEffect } from "react";

const SpecialOffer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 13,
    hours: 8,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-black text-white px-8 py-10 rounded-lg shadow-lg 
                    mb-20 md:mb-32 border-b-4 border-[#c8ff00] max-w-[1024px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Offer Text & Timer */}
        <div>
          <h3 className="text-2xl font-bold uppercase text-white mb-4">
            Special Offer of the Month
          </h3>
          <p className="text-gray-300">
            Grab our Special Offer of the Day! Enjoy amazing discounts on top products. Hurry, this deal is only available today!
          </p>

          {/* Countdown Timer */}
          <div className="flex space-x-4 mt-6">
            {["Days", "Hours", "Minutes", "Seconds"].map((unit, index) => {
              const value = ["days", "hours", "minutes", "seconds"][index];
              return (
                <div key={unit} className="flex flex-col items-center bg-gray-800 px-4 py-3 rounded-lg">
                  <span className="text-xl font-bold text-[#c8ff00]">
                    {timeLeft[value].toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs text-gray-400">{unit}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coupon Ticket */}
        <div className="flex justify-center items-center">
          <div className="relative bg-[#c8ff00] text-black py-4 px-6 rounded-lg flex items-center">
            <span className="mr-4 text-lg font-bold">#CLOTH100</span>
            <div className="text-2xl font-bold">40% OFF</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpecialOffer;
