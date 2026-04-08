const FREE_SHIPPING_THRESHOLD = 15000;

interface ShippingProgressProps {
  subtotalInCents: number;
}

export default function ShippingProgress({
  subtotalInCents,
}: ShippingProgressProps) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotalInCents;
  const progress = Math.min(
    (subtotalInCents / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const earned = remaining <= 0;

  return (
    <div className="bg-[#f5f5f5] rounded-lg p-4">
      {earned ? (
        <p className="text-sm font-sans text-[#0072BC] font-semibold text-center">
          ✓ You&apos;ve earned free shipping!
        </p>
      ) : (
        <p className="text-sm font-sans text-[#444] text-center mb-2">
          You&apos;re{" "}
          <span className="font-bold text-[#1a1a1a]">
            ${(remaining / 100).toFixed(2)}
          </span>{" "}
          away from free shipping!
        </p>
      )}
      <div className="w-full bg-[#ddd] rounded-full h-2 mt-2">
        <div
          className="bg-[#0072BC] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
