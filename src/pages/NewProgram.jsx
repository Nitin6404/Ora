import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from  '../pages/admin/Navigation';
import TopBar from "../pages/admin/dashboard/components/TopBar";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";
const API_URL =
  "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/program/programs";

export default function NewProgram() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  // Fetch programs from API
  const fetchPrograms = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrograms(res.data.results);
    } catch (err) {
      console.error("❌ Failed to fetch programs:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Handlers for dropdown
  const handleView = (id) => {
    console.log("👁️ View program ID:", id);
    navigate(`/programview/${id}`);
  };

  const handleEdit = (id) => {
    console.log("✏️ Edit program ID:", id);
     navigate(`/editprogram/${id}`);
  };

  const handleDelete = (id) => {
    console.log("🗑️ Delete program ID:", id);
  };

  const handleAddProgram = () => {
    console.log("➕ Add New Program clicked");
    navigate("/decisiontreeflow");
  };

  return (

  <Navigation>
      <div
        className="flex flex-col min-h-screen font-inter"
        // style={{
        //   background: "linear-gradient(90deg,rgba(235, 233, 254, 1) 0%, rgba(253, 253, 253, 1) 50%, rgba(254, 246, 232, 1) 100%)",
        // }}
      >
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <TopBar />
  <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Programs</h2>
        <button
          onClick={handleAddProgram}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Program
        </button>
      </div>

      {loading ? (
        <p>Loading programs...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Active</th>
              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr key={program.id} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{program.name}</td>
                <td className="px-4 py-2 border">
                  {program.is_active ? "✅" : "❌"}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(program.created_date).toLocaleString()}
                </td>
            <td className="px-4 py-2 border">
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => handleView(program.id)}
                      title="View"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(program.id)}
                      title="Edit"
                      className="text-green-600 hover:text-green-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
        </div>


    </div>
   
    </Navigation>
    
  );
}
