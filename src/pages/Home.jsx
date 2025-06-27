import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Home</h1>
      <button
        onClick={() => navigate("/users")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to User Form
      </button>
    </div>
  );
}

export default Home;
