// app/insight-hub/loading.jsx
export default function InsightHubLoading() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* HERO SECTION — stacks on mobile, 2-col on xl */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-8">
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 sm:gap-14 items-center">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-6">
              {/* Badge */}
              <div className="h-8 sm:h-9 w-28 sm:w-36 bg-green-100 rounded-full animate-pulse" />

              {/* Heading — 2 lines, responsive size */}
              <div className="mt-5 sm:mt-7 space-y-2 sm:space-y-3">
                <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-11/12 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Paragraph — 3 lines */}
              <div className="mt-5 sm:mt-6 space-y-2 max-w-2xl">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4/5 sm:w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Features — 1 col mobile, 3 col sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0 pt-1">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN — hero image */}
            <div className="xl:col-span-6">
              <div className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] xl:max-w-[780px] aspect-[6/5] bg-gray-200 rounded-2xl animate-pulse mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* CARDS GRID — 1 / 2 / 3 / 4 columns */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
            >
              {/* Card image — matches real h-[160px] / h-[175px] / h-[190px] */}
              <div className="w-full h-[160px] sm:h-[175px] lg:h-[190px] bg-gray-200" />

              {/* Card body */}
              <div className="p-3 sm:p-4 space-y-2.5">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded pt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}