export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Order {id}
        </h1>
        <div className="bg-[#f5f5f5] rounded-xl p-8 text-center">
          <p className="text-sm font-sans text-[#888]">
            Order details will be available once checkout is fully implemented.
          </p>
        </div>
      </div>
    </main>
  );
}
