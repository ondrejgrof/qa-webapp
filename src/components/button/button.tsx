import React from "react";
import styled, { css } from "styled-components";
import { rgba } from "polished";
import { colors, weights, delays, misc } from "../global-style";

import iconCreateSvg from "./img/icon-create.svg";
import iconDeleteSvg from "./img/icon-delete.svg";
import iconBackSvg from "./img/icon-back.svg";
import iconPlusSvg from "./img/icon-plus.svg";
import iconMinusSvg from "./img/icon-minus.svg";

export enum ButtonIconType {
  Create,
  Delete,
  Back,
}

export enum ToggleModeType {
  Income,
  Expense,
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ButtonIconType;
}

export interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode: ToggleModeType;
  onClick: () => void;
}

const StyledButton = styled.button<{ icon: ButtonIconType | undefined }>`
  padding: 12px 32px;

  font-size: 16px;
  font-weight: ${weights.semibold};
  color: ${colors.buttonText};

  background-color: ${colors.accent};
  border: none;
  border-radius: ${misc.borderRadius};

  transition: all ${delays.medium};
  cursor: pointer;

  :focus {
    outline: none;
    box-shadow: 0 0 0 3px ${rgba(colors.accent, 0.2)};
  }

  :hover:not([disabled]) {
    filter: brightness(110%);
  }

  :active {
    filter: brightness(94%);
    transition: none;
  }

  &[disabled] {
    background-color: ${colors.buttonDisabledBkg};
    cursor: default;
  }

  ${(props) =>
    props.icon !== undefined &&
    css`
      width: 48px;
      height: 42px;
      padding: 0;
      background-position: center;
      background-repeat: no-repeat;

      ${props.icon === ButtonIconType.Create &&
      css`
        background-color: ${colors.constructive};
        background-image: url(${iconCreateSvg});
      `}

      ${props.icon === ButtonIconType.Delete &&
      css`
        background-color: ${colors.destructive};
        background-image: url(${iconDeleteSvg});
      `}
    `}
`;

const Button = ({ icon, children, onClick, ...rest }: ButtonProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (onClick) onClick(event);
  };

  return (
    <StyledButton type="button" icon={icon} onClick={handleClick} {...rest}>
      {icon === undefined && children}
    </StyledButton>
  );
};

export const LogOutButton = styled(Button)`
  padding: 8px 16px;
  font-size: 13px;
  background-color: ${colors.buttonLogOutBkg};
`;

export const BackButton = styled(Button).attrs({
  icon: ButtonIconType.Back,
})`
  width: 26px;
  height: 26px;
  margin-right: 12px;
  transform: translateY(3px);

  background-image: url(${iconBackSvg});
  border-radius: 50%;
`;

const StyledToggleContainer = styled.div<{ mode: ToggleModeType }>`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: url(${(props) =>
        props.mode === ToggleModeType.Income ? iconPlusSvg : iconMinusSvg})
      center no-repeat;
    background-color: ${(props) =>
      props.mode === ToggleModeType.Income
        ? colors.accent
        : colors.destructive};

    z-index: 1;
    transition: all ${delays.medium};
    pointer-events: none;

    ${(props) =>
      props.mode === ToggleModeType.Expense &&
      css`
        transform: translateX(15px) rotate(180deg);
      `};
  }
`;

const StyledToggleButton = styled(Button)`
  display: block;
  width: 48px;
  height: 32px;
  padding: 0;
  background-color: ${colors.inputBkg};
  border: solid 1px ${colors.inputLine};
  border-radius: 16px;

  :hover:not([disabled]) {
    filter: none;
  }
  :focus {
    border-color: ${rgba(colors.accent, 0.2)};
  }
`;

export const ToggleButton = ({ mode, onClick }: ToggleButtonProps) => (
  <StyledToggleContainer mode={mode} data-cy={'toggle'}>
    <StyledToggleButton onClick={onClick} />
  </StyledToggleContainer>
);

export default Button;
