// src/components/ViewWorkflows.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ViewWorkflows.css'; // Create and import CSS file for styling

const ViewWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [jsonInput, setJsonInput] = useState('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    // Fetch all workflows when the component mounts
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get('/api/get-workflows');
        setWorkflows(response.data);
      } catch (error) {
        setError('Error fetching workflows.');
      }
    };
    fetchWorkflows();
  }, []);

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSaveJson = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      await axios.post('/api/save-json', { workflowId: selectedWorkflowId, jsonData: parsedData });
      setSuccessMessage('JSON data saved successfully!');
      setError(''); // Clear any previous errors
      // Redirect to the view tree page
      navigate(`/view-tree/${selectedWorkflowId}`);
    } catch (error) {
      setError('Invalid JSON data or error saving JSON.');
      setSuccessMessage(''); // Clear any previous success messages
    }
  };

  return (
    <div className="view-workflows-container">
      <h1>View Workflows</h1>
      <div className="workflows-list">
        <h2>Existing Workflows:</h2>
        <select
          value={selectedWorkflowId}
          onChange={(e) => setSelectedWorkflowId(e.target.value)}
        >
          <option value="">Select a workflow</option>
          {workflows.map(workflow => (
            <option key={workflow.id} value={workflow.id}>
              {workflow.name}
            </option>
          ))}
        </select>
        <pre>{JSON.stringify(workflows, null, 2)}</pre>
      </div>
      <div className="json-input-container">
        <h2>Input JSON Data:</h2>
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='Enter JSON here...'
          rows="10"
          cols="50"
        />
        <button className="button" onClick={handleSaveJson}>Save JSON</button>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default ViewWorkflows;
