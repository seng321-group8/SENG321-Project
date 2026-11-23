import { useEffect, useState } from "react";

import "./styles.css";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/health/", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Health check failed");
        return response.json();
      })
      .then(() => setApiStatus("online"))
      .catch((error) => {
        if (error.name !== "AbortError") setApiStatus("offline");
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <section className="card" aria-labelledby="page-title">
        <p className="eyebrow">SENG 321 · Team 8</p>
        <h1 id="page-title">Career Advisor Matching and Appointment System</h1>
        <p className="intro">
          The React client is running. Feature screens will use the versioned REST API at{" "}
          <code>{import.meta.env.VITE_API_BASE_URL || "/api/v1"}</code>.
        </p>
        <div className={`status status--${apiStatus}`} role="status" aria-live="polite">
          <span className="status__dot" aria-hidden="true" />
          API status: {apiStatus}
        </div>
      </section>
    </main>
  );
}

export default App;
