// src/components/BrokerAnalyzer.jsx
"use client";

import { useRouter } from "next/navigation";

const brokers = [
  {
    id: "zerodha",
    name: "Zerodha",
    img: "/images/zerodha.png",
    brokerage: "₹0 Delivery • ₹20 Intraday & F&O",
    equities: "₹0 (Free)",
    fo: "₹20 per order",
    openAccountUrl: "https://zerodha.com/open-account/",
  },
  {
    id: "angel-one",
    name: "Angel One",
    img: "/images/angelone.png",
    brokerage: "₹0 Delivery • ₹20 Intraday & F&O",
    equities: "₹0 (Free)",
    fo: "₹20 per order",
    openAccountUrl: "https://angelone.in/open-account",
  },
  {
    id: "groww",
    name: "Groww",
    img: "/images/groww.png",
    brokerage: "₹20 or 0.05% (whichever lower)",
    equities: "₹20 or 0.05%",
    fo: "₹20 per order",
    openAccountUrl: "https://groww.in/signup",
  },
  {
    id: "upstox",
    name: "Upstox",
    img: "/images/upstox.jpg",
    brokerage: "₹20 or 0.05% (Delivery ₹20)",
    equities: "₹20 or 0.05%",
    fo: "₹20 per order",
    openAccountUrl: "https://upstox.com/open-account/",
  },
];

// LOGO
const ImageLogo = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="
        w-10 h-10
        rounded-lg
        object-contain
        border
        bg-gray-50
        p-1
      "
    />
  );
};

// CARD
const BrokerCard = ({ broker }) => {
  const router = useRouter();

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        shadow-sm
        flex flex-col
      "
    >
      {/* HEADER */}
      <div className="px-3 py-3 border-gray-100">
        <div className="flex items-center gap-3">
          <ImageLogo src={broker.img} alt={broker.name} />

          <h3 className="text-[15px] font-bold text-gray-900 truncate">
            {broker.name}
          </h3>
        </div>
      </div>

      {/* INFO */}
      <div className="px-3 py-3 space-y-2 text-[12px]">

        <div className="flex justify-between gap-2">
          <span className="text-gray-500">Brokerage</span>

          <span className="font-medium text-gray-900 text-right max-w-[150px] leading-snug">
            {broker.brokerage}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="text-gray-500">Equities</span>

          <span
            className={`font-semibold ${
              broker.equities.includes("Free")
                ? "text-green-600"
                : "text-gray-900"
            }`}
          >
            {broker.equities}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="text-gray-500">F&O</span>

          <span className="font-medium text-gray-900">
            {broker.fo}
          </span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="px-3 pb-3 pt-2 flex gap-2">
        <button
          onClick={() =>
            window.open(
              broker.openAccountUrl,
              "_blank",
              "noopener,noreferrer"
            )
          }
          className="
            flex-1
            py-2
            text-xs
            font-semibold
            text-white
            bg-green-600
            hover:bg-green-700
            rounded-lg
          "
        >
          Open
        </button>

        <button
          onClick={() => router.push(`/brokerdetails/${broker.id}`)}
          className="
            flex-1
            py-2
            text-xs
            font-semibold
            text-green-700
            border border-green-300
            rounded-lg
            bg-white
            hover:bg-slate-50
            transition-colors
          "
        >
          Details
        </button>
      </div>
    </div>
  );
};

// MAIN
const BrokerAnalyzer = () => {
  return (
    <section className="py-3 lg:py-2">

      <div className="max-w-full mx-auto">

        {/* MOBILE - VERTICAL COMPACT LIST */}
        <div className="lg:hidden space-y-3">

          {brokers.map((broker) => (
            <BrokerCard
              key={broker.id}
              broker={broker}
            />
          ))}

        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-3">

          {brokers.map((broker) => (
            <BrokerCard
              key={broker.id}
              broker={broker}
            />
          ))}

        </div>

      </div>
    </section>
  );
};

export default BrokerAnalyzer;