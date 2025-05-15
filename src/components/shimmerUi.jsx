const ShimmerProductCard = () => {
  return (
    <div className="relative flex flex-col gap-4 px-3 pt-3 pb-5 border-2 border-slate-200 w-72 bg-white rounded-2xl shadow-lg animate-pulse overflow-hidden">
      {/* Price badge */}
      <div className="absolute top-3 right-3 h-6 w-16 rounded-full bg-blue-300" />

      {/* Category badge */}
      <div className="absolute top-3 left-3 h-6 w-14 rounded-full bg-gray-300" />

      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-xl" />

      {/* Title */}
      <div className="h-5 bg-gray-300 rounded w-3/4 mt-2" />

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Button placeholder */}
      <div className="h-10 bg-blue-300 rounded-lg mt-2" />
    </div>
  );
};

export default ShimmerProductCard;
