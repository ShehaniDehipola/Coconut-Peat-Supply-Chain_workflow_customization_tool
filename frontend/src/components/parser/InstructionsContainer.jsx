import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateDSLInstructions } from '../../utils/dslGenerator';
import { parseInstructionsToGo } from '../../utils/goParser';

// Styled components for layout
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
`;

const RightCorner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Section = styled.div`
  flex: 1;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  overflow: hidden;
`;

const InstructionTitle = styled.h3`
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
`;

const DSLText = styled.div`
  background-color: #f9f9f9;
  color: #333;
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.4;
  padding: 15px;
  border-radius: 4px;
  height: 250px;
  overflow-y: auto;
  box-sizing: border-box;
  white-space: pre-wrap; /* Preserve line breaks */
`;

const GoPre = styled.pre`
  background-color: #23272a;
  color: #98c379;
  font-family: 'Courier New', Courier, monospace;
  font-size: 8px;
  line-height: 1.4;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const InstructionsContainer = ({ pluginName, nodes }) => {
  const [dslInstructions, setDslInstructions] = useState('');
  const [parsedGoCode, setParsedGoCode] = useState('');

  useEffect(() => {
    const dsl = generateDSLInstructions(pluginName, nodes);
    
    // Format DSL instructions to show each on a new line
    const formattedDSL = Array.isArray(dsl) ? dsl.join('\n') : dsl;
    setDslInstructions(formattedDSL);

    if (formattedDSL) {
      const goCode = parseInstructionsToGo(formattedDSL);
      setParsedGoCode(goCode);
    } else {
      setParsedGoCode('');
    }
  }, [pluginName, nodes]);

  return (
    <Container>
      <RightCorner>
        <Section>
          <InstructionTitle>Instructions</InstructionTitle>
          {/* Map each instruction to a new line */}
          <DSLText>
            {dslInstructions
              ? dslInstructions.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))
              : 'No instructions available.'}
          </DSLText>
        </Section>

        {dslInstructions && (
          <Section>
            <InstructionTitle>Go Code</InstructionTitle>
            <GoPre>{parsedGoCode}</GoPre>
          </Section>
        )}
      </RightCorner>
    </Container>
  );
};

export default InstructionsContainer;
