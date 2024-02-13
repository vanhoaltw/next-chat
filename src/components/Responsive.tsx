'use client';

import { ComponentType, PropsWithChildren } from 'react';
import { useMediaQuery } from 'react-responsive';

const Responsive = ({
  Mobile,
  children,
}: PropsWithChildren & { Mobile: ComponentType }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return isMobile ? <Mobile /> : children;
};

export default Responsive;
