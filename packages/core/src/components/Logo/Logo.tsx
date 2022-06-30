import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '@mui/material';
import { Flax } from '@flax/icons';

const StyledFlax = styled(Flax)`
  max-width: 100%;
  width: auto;
  height: auto;
`;

export default function Logo(props: BoxProps) {
  return (
    <Box {...props}>
      <StyledFlax />
    </Box>
  );
}
