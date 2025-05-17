export default function ApplianceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Appliance Details</h1>
      <p>This page is under construction.</p>
      <p>Appliance ID: {params.id}</p>
    </div>
  )
}
