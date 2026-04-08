export default function TrustBadges() {
  const badges = [
    { icon: "🔬", label: "Lab Tested" },
    { icon: "📋", label: "COA Included" },
    { icon: "🇺🇸", label: "USA Made" },
    { icon: "📦", label: "Discreet Ship" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="bg-[#f8f8f8] rounded px-3 py-2 text-center text-xs font-sans text-[#444]"
        >
          {badge.icon} {badge.label}
        </div>
      ))}
    </div>
  );
}
