// src/components/ViewTree.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed
import './ViewTree.css'; // Create and import CSS file for styling

const ViewTree = ({ match }) => {
  const [jsonData, setJsonData] = useState({});
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axios.get(`/api/get-json/${match.params.workflowId}`);
        setJsonData(response.data);
      } catch (error) {
        setError('Error fetching JSON data.');
      }
    };
    fetchJsonData();
  }, [match.params.workflowId]);

  const renderTree = (node) => {
    if (typeof node === 'object' && node !== null) {
      return (
        <ul>
          {Object.keys(node).map(key => (
            <li key={key}>
              {key}
              {renderTree(node[key])}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{node}</span>;
  };

  return (
    <div className="view-tree-container">
      <h1>Workflow Tree</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="tree-view">
        {renderTree(jsonData)}
      </div>
    </div>
  );
};

export default ViewTree;
