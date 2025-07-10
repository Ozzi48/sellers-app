// app/routes/applications.tsx

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  // MOCK: Replace this with a call to your DB
  return json({
    applications: [
      {
        id: "1",
        email: "alice@example.com",
        address: "123 Street",
        defect: true,
        description: "Stained jeans",
        imageUrl: "https://placekitten.com/200/300",
      },
      {
        id: "2",
        email: "bob@example.com",
        address: "456 Lane",
        defect: false,
        description: "Like new shirt",
        imageUrl: "https://placekitten.com/200/301",
      },
    ],
  });
};

export default function Applications() {
  const { applications } = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Seller Applications
      </h1>
      <div style={{ display: "grid", gap: 20 }}>
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 8,
              display: "flex",
              gap: 16,
            }}
          >
            <img
              src={app.imageUrl}
              alt="Submitted item"
              style={{ width: 100, borderRadius: 8 }}
            />
            <div>
              <p>
                <strong>Email:</strong> {app.email}
              </p>
              <p>
                <strong>Address:</strong> {app.address}
              </p>
              <p>
                <strong>Defect:</strong> {app.defect ? "Yes" : "No"}
              </p>
              <p>
                <strong>Description:</strong> {app.description}
              </p>
              <button
                style={{
                  marginTop: 12,
                  padding: "6px 12px",
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: 4,
                  border: "none",
                }}
              >
                Mark as Reviewed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
