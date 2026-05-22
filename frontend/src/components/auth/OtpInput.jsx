import React, { useState, useRef } from 'react';

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every(val => val !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          ref={el => inputRefs.current[index] = el}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          className="w-[45px] h-[55px] text-center text-2xl font-bold bg-white border border-[#e5e7eb] text-[#111827] rounded-lg outline-none focus:border-[#136040] focus:shadow-[0_0_0_3px_rgba(19,96,64,0.1)]"
        />
      ))}
    </div>
  );
};

export default OtpInput;
