// app/insight-hub/[id]/[slug]/loading.jsx
export default function InsightHubDetailLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium text-slate-500">
          <ol className="flex items-center space-x-2 flex-wrap">
            <li className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <li className="h-4 w-3 bg-gray-200 rounded" />
            <li className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <li className="h-4 w-3 bg-gray-200 rounded" />
            <li className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </ol>
        </nav>

        {/* Category chip */}
        <div className="text-center mb-5">
          <div className="inline-block h-7 w-28 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Title */}
        <div className="text-center mb-6 space-y-3">
          <div className="h-9 sm:h-10 lg:h-12 w-11/12 max-w-4xl bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-9 sm:h-10 lg:h-12 w-8/12 max-w-3xl bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Featured image */}
        <div className="mb-10 w-full max-w-5xl mx-auto">
          <div className="w-full aspect-[16/9] bg-gray-200 rounded-2xl animate-pulse" />
        </div>

        {/* Article body */}
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4 animate-pulse">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-10/12 bg-gray-200 rounded" />

            <div className="pt-4 h-6 w-1/3 bg-gray-200 rounded" />

            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-9/12 bg-gray-200 rounded" />

            <div className="pt-4 h-6 w-1/4 bg-gray-200 rounded" />

            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-10/12 bg-gray-200 rounded" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
          </div>

          {/* Share + back */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
            </div>

            <div className="h-10 w-44 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}