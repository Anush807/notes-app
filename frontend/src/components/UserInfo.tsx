import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
  notes: Note[];
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BACKEND_URL}/api/v1/me/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-gray-600">Loading user info...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-gray-600">No user data available.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Active:</strong> {user.active ? "Yes" : "No"}</p>
      <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>

      {user.notes?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Notes:</h3>
          <ul className="list-disc list-inside space-y-1">
            {user.notes.map((note) => (
              <li key={note.id}>
                <strong>{note.title}:</strong> {note.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
