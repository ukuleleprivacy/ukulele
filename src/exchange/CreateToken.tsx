import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Slider,
  Box,
} from '@mui/material';
import axios from 'axios';
import { TokenContext } from '../context/TokenContext';

export const CreateToken: React.FC = () => {
  const { addToken } = useContext(TokenContext)!;
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tokenPriceInBUCC, setTokenPriceInBUCC] = useState(10000); // Initial slider value, start at the max
  const [buccPriceETH, setBuccPriceETH] = useState<number | null>(null);
  const [ethPriceInUSD, setEthPriceInUSD] = useState<number | null>(null);
  const [tokenValueETH, setTokenValueETH] = useState<number | null>(null);
  const [tokenValueUSD, setTokenValueUSD] = useState<number | null>(null);
  const [memeTokenSupply, setMemeTokenSupply] = useState(1000); // Default supply
  const [bv3Deposit, setBv3Deposit] = useState(1000); // Calculated BV3 deposit
  const [tokenId, setTokenId] = useState(0);
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          'https://api.dexscreener.com/latest/dex/pairs/ethereum/0xa579de28c6510299759f90e067db06c280072ace'
        );
        const priceEth = parseFloat(response.data.pair.priceNative);
        setBuccPriceETH(priceEth);

        const ethResponse = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const priceUsd = parseFloat(ethResponse.data.ethereum.usd);
        setEthPriceInUSD(priceUsd);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate BV3 Deposit based on slider and supply
  useEffect(() => {
    const calculatedDeposit = memeTokenSupply / tokenPriceInBUCC;
    setBv3Deposit(calculatedDeposit);
  }, [memeTokenSupply, tokenPriceInBUCC]);

  useEffect(() => {
    if (tokenPriceInBUCC && buccPriceETH && ethPriceInUSD) {
      const tokenValueInETH = tokenPriceInBUCC * buccPriceETH;
      setTokenValueETH(tokenValueInETH);

      const tokenValueInUSD = tokenValueInETH * ethPriceInUSD;
      setTokenValueUSD(tokenValueInUSD);
    } else {
      setTokenValueETH(null);
      setTokenValueUSD(null);
    }
  }, [tokenPriceInBUCC, buccPriceETH, ethPriceInUSD]);

  const handleTokenSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    if (value.length <= 6) {
      setTokenSymbol(value);
    }
  };

  const handleCreateToken = () => {
    if (!tokenSymbol || !tokenName || !imageUrl) {
      alert('Please fill in all required fields.');
      return;
    }

    const newToken = {
      id: tokenId,
      symbol: tokenSymbol,
      name: tokenName,
      imageUrl: imageUrl,
      priceBUCC: tokenPriceInBUCC,
      priceUSD: tokenValueUSD,
      percentageSold: 0,
      buyers: Math.floor(Math.random() * 100),
      sellers: Math.floor(Math.random() * 50),
    };

    addToken(newToken);

    setTokenId((prevId) => prevId + 1);
    setTokenSymbol('');
    setTokenName('');
    setImageUrl('');
    setTokenPriceInBUCC(10000);
    setTokenValueETH(null);
    setTokenValueUSD(null);

    alert('Token created successfully!');
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = typeof newValue === 'number' ? newValue : newValue[0];
    setTokenPriceInBUCC(value);
  };

  const priceMarks = [
    { value: 0.0001, label: '0.0001' },
    { value: 1, label: '1' },
    { value: 10000, label: '10000' },
  ];

  return (
    <Card variant="outlined" sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a Private Meme Token
        </Typography>
        <Stack spacing={4}>
          {/* Description Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Description:
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Token Symbol (Max 6 Characters)"
                variant="outlined"
                value={tokenSymbol}
                onChange={handleTokenSymbolChange}
                inputProps={{ maxLength: 6 }}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
              <TextField
                label="Token Name"
                variant="outlined"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
              <TextField
                label="Image URL"
                variant="outlined"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
            </Stack>
          </Box>

          {/* Market Mechanics Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              Market Mechanics:
            </Typography>
            <Stack spacing={2} alignItems="center">
              <TextField
                label="Number of Meme Tokens"
                variant="outlined"
                type="number"
                value={memeTokenSupply}
                onChange={(e) => setMemeTokenSupply(parseInt(e.target.value))}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
              <Typography>Price per Meme Token in BUCC:</Typography>
              <Slider
                value={tokenPriceInBUCC}
                onChange={handleSliderChange}
                min={0.0001}
                max={10000}
                step={0.0001}
                valueLabelDisplay="auto"
                marks={priceMarks}
                sx={{
                  width: '75%', // 25% reduced width
                  height: '10px', // Increased height
                  '& .MuiSlider-thumb': {
                    backgroundColor: `rgba(255, 255, 255, ${1 - tokenPriceInBUCC / 10000})`,
                  },
                }}
              />
            </Stack>
          </Box>

          {/* Prices Section */}
          <Box
            sx={{
              textAlign: 'center',
              border: '3px solid white',
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Prices
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                Current BUCC Price: {buccPriceETH?.toFixed(6) || '0.000000'} ETH
              </Typography>
              <Typography variant="body2">
                Token Initial Value: {tokenValueETH?.toFixed(6) || '0.000000'} ETH
              </Typography>
              <Typography variant="body2">
                Token Initial Value: ${tokenValueUSD?.toFixed(10) || '0.0000000000'} USD
              </Typography>
            </Stack>
          </Box>

          {/* BV3 Tokens to be Deposited */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h6" color="secondary" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
              BV3 Tokens to be Deposited: {bv3Deposit.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateToken}
            disabled={isTransactionInProgress || !tokenSymbol || !tokenName}
            sx={{ alignSelf: 'start' }}
          >
            Deposit BV3 & Create Tokens
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
