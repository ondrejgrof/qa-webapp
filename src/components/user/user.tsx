import React from "react";
import styled, { css } from "styled-components";
import { colors, weights, delays } from "../global-style";

import iconUserSvg from "./img/icon-user.svg";
import iconDeleteUserSvg from "./img/icon-delete-user.svg";

export interface UserProps {
  username: string;
  isCurrentUser?: boolean;
  isLoggedUser?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const badgeStyle = css`
  content: "";
  position: absolute;
  top: 0;
  width: 28px;
  height: 28px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
`;

const StyledUser = styled.div<{
  isCurrentUser: boolean;
  isLoggedUser: boolean;
  isDeletable: boolean;
}>`
  height: 28px;
  margin: 0 4px;
  padding: 8px 8px 8px 32px;

  font-size: 13px;
  border-radius: 14px;
  position: relative;

  ${(props) =>
    props.isCurrentUser &&
    css`
      color: ${colors.fadedText};
      font-style: italic;
    `};

  ${(props) =>
    props.isLoggedUser &&
    css`
      font-weight: ${weights.bold};
    `};

  &::before {
    ${badgeStyle}
    left: 0;
    background-color: ${(props) =>
      props.isCurrentUser || props.isLoggedUser
        ? colors.buttonDisabledBkg
        : colors.accent};
    background-image: url(${iconUserSvg});
  }

  ${(props) =>
    props.isDeletable &&
    css`
      transition: all ${delays.medium};

      &::before {
        transform-origin: left;
        transition: all ${delays.medium};
      }

      &::after {
        ${badgeStyle}
        right: 0;
        background-color: ${colors.destructive};
        background-image: url(${iconDeleteUserSvg});

        opacity: 0;
        transform: scale(0);
        transform-origin: right;
        transition: all ${delays.medium};
      }

      &:hover {
        padding-left: 10px;
        padding-right: 30px;
        color: ${colors.buttonText};
        background-color: ${colors.destructive};

        &::before {
          opacity: 0;
          transform: scale(0);
        }

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}
`;

export const User = ({
  username,
  isCurrentUser = false,
  isLoggedUser = false,
  onClick,
    ...props
}: UserProps) => (
  <li>
    <StyledUser
      isCurrentUser={isCurrentUser}
      isLoggedUser={isLoggedUser}
      isDeletable={!!onClick}
      onClick={
        onClick
          ? (event) => {
              event.stopPropagation();
              onClick(event);
            }
          : undefined
      }
      {...props}
    >
      {username}
    </StyledUser>
  </li>
);

export const Group = styled.ul`
  display: flex;
  align-items: center;
`;
