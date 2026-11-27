import { useEffect, useState } from "react";

import { checkHealth } from "../api/endpoints.js";

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();

    checkHealth(controller.signal)
      .then(() => setApiStatus("online"))
      .catch((error) => {
        if (error.name !== "AbortError") setApiStatus("offline");
      });

    return () => controller.abort();
  }, []);

  return (
    <div className={`status status--${apiStatus}`} role="status" aria-live="polite">
      <span className="status__dot" aria-hidden="true" />
      API status: {apiStatus}
    </div>
  );
}