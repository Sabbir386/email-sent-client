import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [emails, setEmails] = useState([]);

  // Fetch emails from API
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get(
          "https://email-server-gamma.vercel.app/api/v1/email/getAllMails"
        );
        setEmails(res.data.emails.reverse()); // Show latest at top
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, []);

  // Handle email sending
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(
        "https://email-server-gamma.vercel.app/api/v1/email/send",
        { email }
      );
      setResponse(res.data);
      setEmails([{ email, isVerified: false }, ...emails]); // Add to UI instantly
    } catch (error) {
      setResponse(error.response?.data || "Error sending email");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
        📧 Email Sending Server
      </h1>

      {/* Email Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Send Email
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Enter recipient email"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
        {response && (
          <div className="mt-4 p-3 bg-gray-200 text-center rounded-md">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div> {/* Loading spinner */}
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500 text-4xl">✔️</span>  {/* Gorgeous checkmark */}
                <span className="text-green-600 font-semibold text-xl animate-fadeIn">
                  Done!
                </span>
              </div>
            )}
            {/* <div>{JSON.stringify(response)}</div> */}
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="mt-8 w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📜 Email List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2">#</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.email}</td>
                  <td className="border p-2 text-center">
                    {item.isVerified ? "⌛ Pending" : "✅ Sent"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
