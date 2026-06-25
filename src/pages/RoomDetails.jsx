import { useParams, useNavigate } from "react-router-dom";

function RoomDetails({ rooms }) {
  const { roomName } = useParams();
  const navigate = useNavigate();

  const room = rooms.find(
    (r) => r.name.toLowerCase().replace(/\s+/g, "-") === roomName
  );

  if (!room) {
    return <h1>Room not found</h1>;
  }

  return (
    <div className="min-h-screen bg-white">

      <img
        src={room.image}
        alt={room.name}
        className="w-full h-[500px] object-cover"
      />

      <div className="max-w-6xl mx-auto p-10">

        <h1 className="text-5xl font-bold mb-4">
          {room.name}
        </h1>

        <p className="text-orange-500 text-2xl mb-6">
          ${room.price} / night
        </p>

        <p className="text-gray-700 text-lg leading-8 mb-8">
          {room.description}
        </p>

        <h2 className="text-3xl font-bold mb-4">
          Amenities
        </h2>

        <ul className="grid md:grid-cols-2 gap-3 mb-8">
          <li>✓ Free WiFi</li>
          <li>✓ Air Conditioning</li>
          <li>✓ Smart TV</li>
          <li>✓ Breakfast Included</li>
          <li>✓ Room Service</li>
          <li>✓ Swimming Pool Access</li>
        </ul>

        <h2 className="text-3xl font-bold mb-4">
          Hotel Policies
        </h2>

        <ul className="space-y-2 text-gray-600 mb-10">
          <li>Check-in: 2 PM</li>
          <li>Check-out: 11 AM</li>
          <li>No smoking indoors</li>
          <li>Pets allowed on request</li>
        </ul>

        <button
          onClick={() => navigate("/booking")}
          className="bg-orange-500 text-white px-8 py-4 rounded-xl"
        >
          Reserve Now
        </button>

      </div>
    </div>
  );
}

export default RoomDetails;