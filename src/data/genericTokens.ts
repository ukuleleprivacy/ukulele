// src/data/genericTokens.ts

import { memeImages } from './memeImages';
import { memeSymbols } from './memeSymbols';

export const genericTokens = Array.from({ length: 20 }, (_, index) => {
  const randomImage = memeImages[index % memeImages.length];
  const randomSymbol = memeSymbols[index % memeSymbols.length];
  return {
    id: index + 1,
    symbol: randomSymbol,
    name: `${randomSymbol} Meme Token`,
    imageUrl: randomImage,
    priceUSD: parseFloat((Math.random() * 10).toFixed(2)),
    priceBUCC: parseFloat((Math.random() * 1000).toFixed(2)),
    percentageSold: Math.floor(Math.random() * 100),
    buyers: Math.floor(Math.random() * 100),
    sellers: Math.floor(Math.random() * 100),
  };
});
