import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";

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
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;

  &:hover {
    color: #d9534f; /* Red hover effect */
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

  useEffect(() => {
    if (index < logs.length) {
      const timer = setTimeout(() => {
        setDisplayedLogs((prevLogs) => [...prevLogs, logs[index]]);
        setIndex(index + 1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [index, logs]);

  return (
    <div>
      <TerminalHeader>
        <span>Execution Logs</span>
        <ClearButton onClick={() => setLogs([])}>
          Clear <FaTrash size={14} />
        </ClearButton>
      </TerminalHeader>
      <TerminalContainer>
        {displayedLogs.map((log, i) => (
          <TerminalLog key={i} visible>
            {log}
          </TerminalLog>
        ))}
      </TerminalContainer>
    </div>
  );
};

export default TerminalOutput;