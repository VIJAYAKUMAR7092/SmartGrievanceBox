"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { storeAuthTokens, storeUserProfile } from "../../lib/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/token/", {
        username: email,
        password,
      });

      const data = response.data;
      storeAuthTokens(data.access, data.refresh);

      const profileResponse = await api.get("/profile/");
      const profile = profileResponse.data;
      storeUserProfile(profile);

      if (profile.is_staff) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Admin login failed. Check credentials and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Admin Login</h1>
        <p>Sign in with your admin credentials.</p>
      </div>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 440, marginTop: 12 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email / Username</label>
          <input
            id="email"
            type="text"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your admin username"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <div className="empty-desc" style={{ color: "#FB7185", marginBottom: 14 }}>{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}
