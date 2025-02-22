import React from 'react';

// Recursive component to render JSON keys and allow value edits only
const JsltJsonEditor = ({ jsonData, onChange, parentKey = '' }) => {

  const handleChange = (key, newValue) => {
    onChange(key, newValue);
  };

  const renderJSON = (data, currentKey = '') => {
    if (typeof data === 'object' && !Array.isArray(data)) {
      return Object.keys(data).map((key) => (
        <div key={key} style={{ marginLeft: 20 }}>
          <div style={{ display: 'flex', marginBottom: 5, gap: 10 }}>
            <label style={{ fontWeight: 'bold' }}>{key}:</label>
            <JsltJsonEditor
              jsonData={data[key] || ""}
              onChange={handleChange}
              parentKey={`${currentKey ? `${currentKey}.` : ''}${key}`} // Pass the full key path
            />
          </div>
        </div>
      ));
    } else if (Array.isArray(data)) {
      return data.map((item, index) => (
        <div key={index} style={{ marginLeft: 20 }}>
          <div style={{ display: 'flex', marginBottom: 5 }}>
            <label>Item {index + 1}:</label>
            <JsltJsonEditor
              jsonData={item}
              onChange={handleChange}
              parentKey={`${currentKey}[${index}]`} // Pass the array index as part of the key path
            />
          </div>
        </div>
      ));
    } else {
      return (
        <input
          type="text"
          value={data || ''}
          onChange={(e) => handleChange(currentKey, e.target.value)} // Pass the full key path as currentKey
          style={{
            marginLeft: 7,
            width: '370px',
            height: '32px',
            padding: '5px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />

      );
    }
  };

  return <div>{renderJSON(jsonData, parentKey)}</div>;
};

export default JsltJsonEditor;
