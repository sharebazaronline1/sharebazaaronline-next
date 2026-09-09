/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // keep utilities used in blog/corporate HTML from DB
    {
      pattern:
        /^(bg|text|border|rounded|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|flex|grid|gap|font|leading|tracking|w|h|min-w|max-w|space|overflow|shadow|list|items|justify|col|row|divide|uppercase|truncate|opacity)-/,
      variants: ["sm", "md", "lg", "xl"],
    },
    // common exact classes from your sample HTML
    "bg-emerald-600",
    "bg-emerald-50",
    "bg-slate-50",
    "bg-red-50",
    "bg-gray-700",
    "text-emerald-700",
    "text-red-600",
    "text-amber-600",
    "text-black",
    "text-white",
    "text-gray-400",
    "text-gray-500",
    "text-gray-600",
    "text-gray-700",
    "text-gray-800",
    "border-gray-200",
    "border-gray-300",
    "rounded-xl",
    "grid-cols-1",
    "lg:grid-cols-2",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};