// src/components/VideoSection.tsx

import React from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import FeatureSection from './FeatureSection'; // Import FeatureSection

interface VideoSectionProps {
  title: string;
  description: string;
  videoSrc: string;
  reverse?: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title,
  description,
  videoSrc,
  reverse = false,
}) => {
  const theme = useTheme();
  const isMacOs = theme.palette.mode === 'dark';

  return (
    <FeatureSection
      title={title}
      description={description}
      videoSrc={videoSrc}
      reverse={reverse}
    />
  );
};

export default VideoSection;
