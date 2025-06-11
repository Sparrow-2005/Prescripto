import React, { useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  const messages = [
    "☕ Fueled by caffeine and clever hacks.",
    "💻 Running on JavaScript and sheer will.",
    "🐛 Debugging one bug at a time.",
    "🎯 Targeting perfection, drinking coffee meanwhile.",
    "🚀 Deploying dreams with every cup.",
    "🔥 Code, compile, coffee, repeat.",
    "🎧 Coding with lo-fi beats and espresso shots.",
    "🛠️ Pranav is probably fixing something right now.",
    "📟 Systems stable... until more coffee is needed.",
    "😴 Sleep is temporary. Code is forever.",
  ];

  const [currentMsg, setCurrentMsg] = useState("");
  const messageRef = useRef(null);

  useEffect(() => {
    const updateMessage = () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMsg(msg);

      const el = messageRef.current;
      if (!el) return;

      el.classList.remove("animate-typing");
      void el.offsetWidth; // Trigger reflow
      el.classList.add("animate-typing");
    };

    const interval = setInterval(updateMessage, 4000);
    updateMessage(); // Initial message

    return () => clearInterval(interval); // Clean up
  }, []);

  return (
    <div className="md:mx-10">
      {/* Top Footer Content */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Left Section */}
        <div>
          <img src={assets.logo} alt="Prescripto Logo" className="w-40 mb-5" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Prescripto is your trusted partner for convenient healthcare access.
            Find experienced doctors near you, explore specialities, and book
            appointments with ease—all in one place. We’re committed to making
            your healthcare journey simple, secure, and stress-free.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91-9309133499</li>
            <li>pranav.a.mundhada@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-10 text-center">
        <hr className="mb-4 border-gray-300" />
        <p className="text-sm mb-1 text-gray-600">
          © 2025 Prescripto - All Rights Reserved.
        </p>
        <p
          ref={messageRef}
          className="text-sm text-gray-600 font-bold inline-block whitespace-nowrap overflow-hidden animate-typing"
        >
          Made with ❤️ by Pranav Mundhada | {currentMsg}
        </p>
      </div>
    </div>
  );
};

export default Footer;
