import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  email,
  message,
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#111" }}>
    <h2 style={{ margin: "0 0 4px" }}>New message from {fullName}</h2>
    <p style={{ margin: "0 0 16px", color: "#555" }}>
      Reply to this email to answer {email}.
    </p>
    <blockquote
      style={{
        margin: 0,
        padding: "12px 16px",
        borderLeft: "4px solid #22d3ee",
        background: "#f4f7f9",
        whiteSpace: "pre-wrap",
      }}
    >
      {message}
    </blockquote>
  </div>
);
