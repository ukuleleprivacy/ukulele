// components/StepCard.tsx

import React from 'react';
import { Card, CardContent, Avatar, Typography } from '@mui/material';

interface StepCardProps {
  imageSrc: string;
  imageAlt: string;
  stepTitle: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({
  imageSrc,
  imageAlt,
  stepTitle,
  description,
}) => {
  return (
    <Card
    sx={{
      height: '100%',
      background: 'linear-gradient(135deg, #101010 0%, #1a1a1a 100%)', // Gradient similar to the index file
      borderRadius: 4, // Matching the border radius of other cards
      border: '1px solid rgba(255,255,255,0.1)', // Border to match MuiPaper style
      boxShadow: 'none', // Remove default box shadow to match elevation style
      transition: 'transform 0.3s ease', // Add transition for interactivity
      '&:hover': {
        transform: 'scale(1.05)', // Slight zoom effect on hover for engagement
      },
    }}
    elevation={0}
  >
      <CardContent sx={{ p: '22px!important', textAlign: 'center' }}>
        <Avatar
          src={imageSrc}
          alt={imageAlt}
          sx={{ width: 50, height: 50, mb: 1 }}
          variant="square"
        />
        <Typography variant="h6" fontWeight="600" component="h2">
          {stepTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StepCard;
