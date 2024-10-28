import React, { useState } from 'react';
import styled from 'styled-components';
import { parseInstructionsToGo } from '../../utils/goParser';

// Styled components for layout
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const InstructionSide = styled.div`
  width: 50%;
  padding: 30px;
  border-right: 1px solid #ccc;
  background-color: #f7f7f7;
  box-sizing: border-box;
`;

const GoCodeSide = styled.div`
  width: 50%;
  padding: 30px;
  background-color: #f0f8ff;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

const Pre = styled.pre`
  background-color: #1e1e1e;
  color: #dcdcdc;
  padding: 10px;
  font-family: monospace;
  overflow: auto;
  max-height: 300px;
  box-sizing: border-box;
`;


const InstructionsContainer = ({ closeModal }) => {
    const [instructions, setInstructions] = useState('');
  const [parsedGoCode, setParsedGoCode] = useState('');

  // Handle instruction changes and parse to Go commands
  const handleInstructionsChange = (e) => {
    const newInstructions = e.target.value;
    setInstructions(newInstructions);

    // Use the external parser to convert instructions to Go code
    const goCode = parseInstructionsToGo(newInstructions);
    setParsedGoCode(goCode);
  };

  return (
    <Container>
      {/* Left side: Instructions input */}
      <InstructionSide>
        <h3>Write Instructions</h3>
        <TextArea
          value={instructions}
          onChange={handleInstructionsChange}
          placeholder="Write your instructions here..."
        />
      </InstructionSide>

      {/* Right side: Parsed Go code */}
      <GoCodeSide>
        <h3>Generated Go Code</h3>
        <Pre>{parsedGoCode}</Pre>
      </GoCodeSide>
    </Container>
  )
}

export default InstructionsContainer