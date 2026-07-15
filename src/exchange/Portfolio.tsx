// src/exchange/Portfolio.tsx

import React, { useState, useContext, useEffect } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { TokenContext } from '../context/TokenContext';
import { memeImages } from '../data/memeImages';
import { memeSymbols } from '../data/memeSymbols';

const TokenImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#e0e0e0', // Light gray background
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {imgError ? (
        <span style={{ fontSize: '48px' }}>❔</span>
      ) : (
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
          }}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const { tokens } = useContext(TokenContext)!;

  const [walletAddress, setWalletAddress] = useState('');
  const [defaultAddresses] = useState<string[]>([
    '0x123...abc',
    '0x456...def',
    '0x789...ghi',
  ]);

  // Declare and initialize portfolioTokens
  const [portfolioTokens, setPortfolioTokens] = useState<any[]>([]);

  // Generate 20 tokens with random details
  useEffect(() => {
    if (walletAddress) {
      const generatedTokens = Array.from({ length: 20 }, (_, index) => {
        const randomImage = memeImages[index % memeImages.length];
        const randomSymbol = memeSymbols[index % memeSymbols.length];
        return {
          imageUrl: randomImage,
          symbol: randomSymbol,
          name: `${randomSymbol} Meme Token`,
          id: index + 1,
          amountOwned: Math.floor(Math.random() * 1000),
          buyers: Math.floor(Math.random() * 100),
          sellers: Math.floor(Math.random() * 100),
        };
      });
      setPortfolioTokens(generatedTokens);
    } else {
      setPortfolioTokens([]);
    }
  }, [walletAddress]);

  // Handle address input change
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Portfolio
      </Typography>

      {/* Address Input with Dropdown */}
      <TextField
        label="Your Wallet Address to View Balances"
        variant="outlined"
        value={walletAddress}
        onChange={handleAddressChange}
        select
        fullWidth
        sx={{
          marginBottom: 2,
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        }}
      >
        {defaultAddresses.map((address) => (
          <MenuItem key={address} value={address}>
            {address}
          </MenuItem>
        ))}
      </TextField>

      {/* Tokens List */}
      {portfolioTokens.length === 0 ? (
        <Typography variant="body1">No tokens to display</Typography>
      ) : (
        <Grid container spacing={2}>
          {portfolioTokens.map((token, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Image on top */}
                  <TokenImage src={token.imageUrl} alt={token.symbol || 'Token Image'} />

                  {/* Token Information */}
                  <Typography variant="h6" sx={{ marginTop: '8px' }}>
                    {token.symbol}
                  </Typography>
                  <Typography variant="body2">{token.name}</Typography>
                  <Typography variant="body2" sx={{ marginTop: '8px' }}>
                    Amount Owned: {token.amountOwned}
                  </Typography>
                  <Typography variant="body2">Token ID: {token.id}</Typography>
                  {/* Buyers */}
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}
                  >
                    Buyers: {token.buyers}
                    <span role="img" aria-label="thumbs up" style={{ marginLeft: '4px' }}>
                      👍🏻
                    </span>
                  </Typography>
                  {/* Sellers */}
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    Sellers: {token.sellers}
                    <span role="img" aria-label="thumbs down" style={{ marginLeft: '4px' }}>
                      👎🏿
                    </span>
                  </Typography>
                </CardContent>
                {/* View Button */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                >
                  View
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};
