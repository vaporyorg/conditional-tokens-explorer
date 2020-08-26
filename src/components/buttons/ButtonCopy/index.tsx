import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styled from 'styled-components'

import { CopyIcon } from '../../icons/CopyIcon'

const Wrapper = styled.button<{ light?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  height: 15px;
  margin: 0 0 0 12px;
  outline: none;
  padding: 0;
  width: 13px;

  ${(props) =>
    props.light &&
    `svg {
      path {
        fill: #b2b5b2;
      }
    }`}

  &:active {
    opacity: 0.7;
  }

  &:hover {
    svg {
      path {
        fill: ${(props) => props.theme.colors.primary};
      }
    }
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

interface ButtonCopyProps {
  light?: boolean
  value: unknown
}

export const ButtonCopy: React.FC<ButtonCopyProps> = (props) => {
  const { light = false, value, ...restProps } = props

  return (
    <CopyToClipboard text={value}>
      <Wrapper light={light} {...restProps}>
        <CopyIcon />
      </Wrapper>
    </CopyToClipboard>
  )
}
