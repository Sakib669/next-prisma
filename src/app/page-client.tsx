"use client";

import { useEffect, useState } from "react";
import { addUser, getAllUser, deleteUser, updateUser } from "./user.action";

const PageClient = () => {
  // State management
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUser();
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Form Submission (Both Create and Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return alert("Please fill in all fields!");

    if (editingId) {
      // Logic for Updating
      const result = await updateUser(editingId, name);
      if (result?.success) {
        setEditingId(null);
      } else {
        alert(result?.error);
      }
    } else {
      // Logic for Creating
      const result = await addUser(name, email);
      if (!result.success) {
        alert(result.error);
      }
    }

    // Reset fields and refresh list
    setName("");
    setEmail("");
    fetchUsers();
  };

  // Set form to Edit mode
  const startEdit = (user: any) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  // Handle User Deletion
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-amber-500">User Management System</h1>

      {/* Input Form Section */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <h2 className="text-lg font-medium mb-4">{editingId ? "Edit User Details" : "Add New User"}</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded bg-gray-900 border border-gray-600 focus:border-amber-500 outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            disabled={!!editingId} // Prevent email change during update to avoid unique constraints
            className="p-3 rounded bg-gray-900 border border-gray-600 focus:border-amber-500 outline-none disabled:opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className={`p-3 rounded-lg font-bold transition-all shadow-md ${
              editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {editingId ? "Update User Information" : "Save User to Database"}
          </button>
          
          {editingId && (
            <button 
              type="button"
              onClick={() => {setEditingId(null); setName(""); setEmail("");}} 
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* List Display Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Registered Users</h2>
        
        {loading ? (
          <p className="text-gray-400 animate-pulse">Synchronizing with Database...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500 italic">No records found. Start by adding a user above.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
              <div>
                <p className="font-bold text-gray-100">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(user)} 
                  className="px-4 py-1.5 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700 transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="px-4 py-1.5 bg-red-600 rounded text-sm font-medium hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PageClient;