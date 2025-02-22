import React, { useState, useEffect } from 'react';
import './App.css';
import headerData from './datasets/headerData.json';
import prospectData from './datasets/prospectData.json';
import jsltData from './datasets/jsltData.json';
import JsltJsonEditor from './components/JsltJsonEditor.jsx';
import jsltFunctionString from './datasets/jsltFunctionString.js';
import { fetchExcelData, uploadJsltFileData } from './apis/api.js';

const App = () => {
  const [json, setJson] = useState(jsltData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [outputJson, setOutputJson] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [finalJsltFormattedString, setFinalJsltFormattedString] = useState("");

  const tableHeaders = headerData;

  const removeFunctionQuotesFromString = (inputString) => {
        const functionRegex = /"([^"]*\([^\)]*\)[^"]*)"/g;
        return inputString.replace(functionRegex, (match, p1) => p1);
      };

  const replaceSingleQuotesInJsonToString = (jsonObj) => {
    const jsonString = JSON.stringify(jsonObj, null, 2);
    return jsonString.replace(/'/g, '\"');
  };

  const handleRadioChange = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleJsonChange = (key, value) => {
    const keys = key.split(".");
    const newJson = { ...json };
    let temp = newJson;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        temp[k] = value;
      } else {
        temp = temp[k];
      }
    });

    setJson(newJson);
  };

  const handleLoad = () => {
    alert('Load button clicked!');
  };

  const createFile = (jsltString, fileName) => {
      const blob = new Blob([jsltString], { type: 'application/json' });
      return new File([blob], fileName, { type: 'application/json' })
  }

  const downloadFile = (jsltString, fileName) => {
      const blob = new Blob([jsltString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  const handleRun = () => {
    const s = replaceSingleQuotesInJsonToString(json);
    const resultString = removeFunctionQuotesFromString(s);
    const finalJsltFormattedString = jsltFunctionString + resultString + '$result';
//     downloadFile(finalJsltFormattedString, "data.jslt");
    console.log(finalJsltFormattedString);
    setFinalJsltFormattedString(finalJsltFormattedString)
    setOutputJson(json);
  };

// Load excel Data
  const loadData = async () => {
      const loaderSummaryId = '6843-250217-NYXY';
      const partnerId = 'abcde';
      const industryType = 'Tech';
      const formatType = 'json';
      const userId = 'user123';

      const fetchedData = await fetchData(loaderSummaryId, partnerId, industryType, formatType, userId);
      if (fetchedData) {
          console.log(fetchedData)
//         setTableData(fetchedData);
      }
    };


useEffect(() => {
//     loadData();
  }, []);

  return (
    <div className="container">
      <h2 className="title">JSLT POC</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Select</th>
              {tableHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="radio"
                  checked={selectedRow === 0}
                  onChange={() => handleRadioChange(0)}
                />
              </td>
              {tableHeaders.map((header, index) => (
                <td key={index}>{headerData[header]}</td>
              ))}
            </tr>
            <tr>
              <td>
                <input
                  type="radio"
                  checked={selectedRow === 1}
                  onChange={() => handleRadioChange(1)}
                />
              </td>
              {tableHeaders.map((header, index) => (
                <td key={index}>{headerData[header]}</td>
              ))}
            </tr>
            <tr>
              <td>
                <input
                  type="radio"
                  checked={selectedRow === 2}
                  onChange={() => handleRadioChange(2)}
                />
              </td>
              {tableHeaders.map((header, index) => (
                <td key={index}>{headerData[header]}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={handleLoad} className="loadButton">
        Load
      </button>

      <div className="jsonEditorContainer">
        <div className="jsonEditor">
          <h3>Prospect Member Data</h3>
          <JsltJsonEditor jsonData={json} onChange={handleJsonChange} />
        </div>

        <div className="jsonOutput">
          <h3>Generated Prospect Member</h3>
          <textarea
            readOnly
            value={outputJson ? JSON.stringify(outputJson, null, 2) : ""}
            style={{ width: '94%', height: '300px', padding: '10px' }}
          />
        </div>
      </div>

      <button onClick={handleRun} className="runButton">
        Run
      </button>
    </div>
  );
};

export default App;
