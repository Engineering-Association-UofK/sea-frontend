import React from "react";
import ReactMarkdown from "react-markdown";
import "./Markdown.css";

const MDView = ({ markdown }) => {
  return (
    <div className="md-preview">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MDView;
