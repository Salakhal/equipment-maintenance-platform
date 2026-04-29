export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Maintenance Admin</h1>
      <div className="space-x-4">
        <button>Dashboard</button>
        <button>Equipments</button>
        <button>Tickets</button>
      </div>
    </div>
  );
}