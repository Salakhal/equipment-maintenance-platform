import { useEffect, useState } from "react";

export default function Equipments() {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/equipments", {
      headers: {
        Authorization: "Bearer TON_TOKEN"
      }
    })
      .then(res => res.json())
      .then(data => setEquipments(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Équipements</h2>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nom</th>
            <th>Type</th>
            <th>Salle</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map(eq => (
            <tr key={eq.id} className="border-t">
              <td className="p-2">{eq.nom}</td>
              <td>{eq.type}</td>
              <td>{eq.salle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}