import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";

// Styled Components
const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1F2532;
  padding: 8px 12px;
  color: white;
  font-weight: semi-bold;
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #d9534f; /* Red hover effect */
  }

  svg {
    margin-left: 5px;
  }
`;

const TerminalContainer = styled.div`
  background-color: #2D3142;
  color: white;
  padding: 10px;
  height: 220px; /* Fixed height */
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  border: 1px solid #333;
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0px;
  position: relative;
`;

// Loading Animation
const LoadingMessage = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  padding: 20px;
  animation: blink 1s linear infinite;

  @keyframes blink {
    0% { opacity: 0.8; }
    50% { opacity: 1.2; }
    100% { opacity: 0.8; }
  }
`;

const TerminalLog = styled.div`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const TerminalOutput = ({ logs, setLogs }) => {
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDisplayedLogs([]); // Reset displayed logs
    setIndex(0);
    setIsLoading(true); // Show loading animation first

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false); // After 2s, start displaying logs
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, [logs]);

  useEffect(() => {
    if (!isLoading && index < logs.length) {
      const timer = setTimeout(() => {
        setDisplayedLogs((prevLogs) => [...prevLogs, logs[index]]);
        setIndex(index + 1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [index, logs, isLoading]);

  return (
    <div>
      <TerminalHeader>
        <span>Execution Logs</span>
        <ClearButton onClick={() => setLogs([])}>
          Clear
        </ClearButton>
      </TerminalHeader>
      <TerminalContainer>
        {isLoading ? (
          <LoadingMessage>Validation Executing...</LoadingMessage>
        ) : (
          displayedLogs.map((log, i) => (
            <TerminalLog key={i} visible>
              {log}
            </TerminalLog>
          ))
        )}
      </TerminalContainer>
    </div>
  );
};

export default TerminalOutput;
