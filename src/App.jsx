import React, { useState, useEffect } from 'react';
import './App.css';
import headerData from './datasets/headerData.json';
import prospectData from './datasets/prospectData.json';
import jsltData from './datasets/jsltData.json';
import JsltJsonEditor from './components/JsltJsonEditor.jsx';
import jsltFunctionString from './datasets/jsltFunctionString.js';
import { fetchExcelData, transformData } from './apis/api.js';

const App = () => {
  const [json, setJson] = useState(jsltData);
  const [excelData, setExcelData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [outputJson, setOutputJson] = useState(null);
  const [finalJsltFormattedString, setFinalJsltFormattedString] = useState("");
  const [inputText, setInputText] = useState('');
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

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
    return new File([blob], fileName, { type: 'application/json' });
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

  const handleRun = async (download) => {
    const s = replaceSingleQuotesInJsonToString(json);
    const resultString = removeFunctionQuotesFromString(s);
    const finalJsltFormattedString = jsltFunctionString + resultString + '$result';
    if (download) {
      downloadFile(finalJsltFormattedString, "data.jslt");
    }
    console.log(finalJsltFormattedString);
    setFinalJsltFormattedString(finalJsltFormattedString);
    const file = createFile(finalJsltFormattedString, 'transformation.jslt');
    const response = await transformData(file);
    if(response) {
        console.log(response);
        setOutputJson(response);
    }
  };

  const textToStream = ` Output: {"response": \"policyNum\" : ifEmptyMakeNull(.POLICY_NUMBER_0)}`;

  const handleGenerate = () => {
    if (!isStreaming && textToStream !== undefined) {
      setIsStreaming(true);
      let index = 0;

      const interval = setInterval(() => {
        if (index < textToStream.length) {
          setStreamedText((prev) => {if(textToStream[index] != undefined)return prev + textToStream[index]});
          index += 1;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
        }
      }, 50);
    }
  };


  // Load excel Data
  const loadData = async () => {
    const loaderSummaryId = '6843-250217-NYXY';
    const partnerId = 'abcde';
    const industryType = 'Tech';
    const formatType = 'json';
    const userId = 'user123';

    const fetchedData = await fetchExcelData(loaderSummaryId, partnerId, industryType, formatType, userId);
    if (fetchedData) {
//       console.log(fetchedData['rawMemberTable']['rawMemberRows'][0]);
      let rawMemberData = fetchedData['rawMemberTable']['rawMemberRows'][0];
      rawMemberData = rawMemberData.slice(1, rawMemberData.length);
//       console.log(rawMemberData)
      setExcelData(rawMemberData);
    }
  };

  useEffect(() => {
    loadData(); // Calling the API to get excel data in table if needed
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
            {[0, 1, 2].map((index) => (
              <tr key={index}>
                <td>
                  <input
                    type="radio"
                    checked={selectedRow === index}
                    onChange={() => handleRadioChange(index)}
                  />
                </td>
                {excelData.map((data) => (
                  <td>{data}</td>
                ))}
              </tr>
            ))}
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

      <div className="button-container">
        <button onClick={() => handleRun(true)} className="downloadButton">
          Download JSLT Template
        </button>

        <button onClick={() => handleRun(false)} className="runButton">
          Run
        </button>
      </div>

      <div className="outputSection">
        <label htmlFor="inputText">Enter your prompt:</label>
        <input
          id="inputText"
          type="text"
          value={inputText}
          placeholder="Enter some text"
          className="inputField"
          onChange={(e) => setInputText(e.target.value)}
        />
        <textarea
          value={streamedText}
          className="outputField"
          readOnly
        />
      </div>

      <button onClick={handleGenerate} className="generateButton">Generate</button>
    </div>
  );
};

export default App;
