// src/exchange/LatestTokens.tsx

import React, { useState, useContext, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { TokenContext } from '../context/TokenContext';
import { genericTokens } from '../data/genericTokens';

export const LatestTokens: React.FC = () => {
  const { tokens } = useContext(TokenContext)!;

  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 20;

  // Combine generic tokens with created tokens
  const allTokens = [...genericTokens, ...tokens];

  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Since functionality is to be implemented later, we won't filter or sort the tokens yet.
  const filteredTokens = allTokens; // Placeholder for future filtering and sorting

  // Calculate indices for pagination
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = filteredTokens.slice(indexOfFirstToken, indexOfLastToken);

  // Total pages
  const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Latest Tokens
      </Typography>

      {/* Search and Sort Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by ID or Symbol"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        />

        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel
            id="sort-label"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
            Sort By
          </InputLabel>
          <Select
            labelId="sort-label"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as string)}
            label="Sort By"
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="marketcap">Marketcap</MenuItem>
            <MenuItem value="mostActive">Most Active (24 hours)</MenuItem>
            <MenuItem value="mostComments">Most Comments (24 hours)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {currentTokens.length === 0 ? (
        <Typography variant="body1">No tokens to display</Typography>
      ) : (
        <Grid
          container
          spacing={2}
          columns={20}
          sx={{
            width: '100%',
            margin: '0 auto',
          }}
        >
          {currentTokens.map((token, index) => (
            <TokenCard key={index} token={token} />
          ))}
        </Grid>
      )}

      {/* Pagination Controls */}
      {filteredTokens.length > tokensPerPage && (
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Typography variant="body1">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Stack>
      )}
    </div>
  );
};

// Create a separate TokenCard component
interface TokenCardProps {
  token: any;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true; // To prevent setting state on unmounted component

    const img = new Image();
    img.src = token.imageUrl;

    img.onload = () => {
      if (isMounted) setImageLoaded(true);
    };

    img.onerror = () => {
      if (isMounted) setImageLoaded(false);
    };

    return () => {
      isMounted = false;
    };
  }, [token.imageUrl]);

  return (
    <Grid item xs={10} sm={5} md={4} lg={4} xl={4}>
      <Card
        variant="outlined"
        sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Image or Placeholder */}
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
            {imageLoaded === null ? null : imageLoaded ? (
              <img
                src={token.imageUrl}
                alt={token.name || 'Token Image'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span style={{ fontSize: '64px' }}>❔</span>
            )}
          </div>

          {/* Token Information */}
          <Typography variant="subtitle1" sx={{ marginTop: '8px' }}>
            {token.symbol || '----'}
          </Typography>
          <Typography variant="caption">ID: {token.id ?? 'N/A'}</Typography>

          {/* Price in USD */}
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            Price: ${token.priceUSD ? token.priceUSD.toFixed(2) : '0.00'}
          </Typography>

          {/* Price in BUCC on a new line */}
          <Typography variant="body2">
            {token.priceBUCC ? `${token.priceBUCC.toFixed(2)} BUCC` : '0.00 BUCC'}
          </Typography>

          {/* Buyers and Sellers */}
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            Buyers: {token.buyers ?? 0}
            <span role="img" aria-label="thumbs up" style={{ marginLeft: '4px' }}>
              👍🏻
            </span>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Sellers: {token.sellers ?? 0}
            <span role="img" aria-label="thumbs down" style={{ marginLeft: '4px' }}>
              👎🏿
            </span>
          </Typography>

          {/* Percentage sold with loading bar */}
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            Percentage Sold: {token.percentageSold ?? 0}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={token.percentageSold ?? 0}
            sx={{ marginTop: '4px', marginBottom: '16px' }} // Added marginBottom
          />

          {/* Buy button */}
          <Button variant="contained" color="primary" sx={{ marginTop: 'auto' }}>
            Buy
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};
