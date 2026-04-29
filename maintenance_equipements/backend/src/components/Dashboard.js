export default function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <p>Tickets ouverts</p>
          <h1 className="text-2xl">10</h1>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p>Tickets urgents</p>
          <h1 className="text-2xl">3</h1>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p>Équipements</p>
          <h1 className="text-2xl">20</h1>
        </div>
      </div>
    </div>
  );
}