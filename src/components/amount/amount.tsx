import React from "react";
import styled from "styled-components";
import { colors, weights } from "../global-style";

export interface AmountProps {
  value: number;
}

const StyledAmount = styled.div<{ isNegative: boolean }>`
  margin: 0 8px;
  font-size: 16px;
  font-weight: ${weights.bold};
  white-space: nowrap;
  color: ${(props) =>
    props.isNegative ? colors.destructive : colors.defaultText};
`;

const Amount = ({ value }: AmountProps) => {
  const isNegative = value < 0;
  const sign = value < 0 ? "-" : "+";
  return (
    <StyledAmount isNegative={isNegative} data-cy={'amount'}>
      {sign} {Math.abs(value)}
    </StyledAmount>
  );
};

export default Amount;
