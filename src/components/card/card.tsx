import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled, { css } from "styled-components";
import { rgba } from "polished";
import { colors, delays } from "../global-style";

export interface CardProps extends RouteComponentProps<any> {
  linkTo?: string;
  children?: React.ReactNode;
}

const StyledCard = styled.div<{ isLink?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  padding: 8px 4px;
  background-color: ${colors.cardBkg};
  border-radius: 12px;

  ${(props) =>
    props.isLink &&
    css`
      transition: all ${delays.short} linear;
      cursor: pointer;

      &:hover {
        box-shadow: 0px 0px 6px ${rgba(colors.shadow, 0.1)},
          0px 8px 12px ${rgba(colors.shadow, 0.08)},
          0px 4px 6px ${rgba(colors.shadow, 0.04)};
      }
    `};
`;

export const Card = withRouter(({ linkTo, history, children, ...props }: CardProps) => {
  const handleClick = function (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    if (linkTo) history.push(linkTo);
  };

  return (
    <StyledCard isLink={!!linkTo} onClick={handleClick} {...props}>
      {children}
    </StyledCard>
  );
});

export const Section = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-grow: ${(props) => (props.fullWidth ? 1 : 0)};

  &:last-child {
    margin-left: auto;
  }

  & > * {
    margin: 0 4px;
  }
`;

export const FormItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 75%;
  margin: 8px auto;
`;
