// src/context/TokenContext.tsx

import React, { createContext, useState } from 'react';

export interface Token {
  id: number;
  symbol: string;
  name: string;
  imageUrl: string;
  priceUSD: number | null;
  priceBUCC: number;
  percentageSold: number;
  buyers: number;
  sellers: number;
}


interface TokenContextType {
  tokens: Token[];
  addToken: (token: Token) => void;
}

export const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const addToken = (token: Token) => {
    setTokens((prevTokens) => [token, ...prevTokens]);
  };

  return (
    <TokenContext.Provider value={{ tokens, addToken }}>
      {children}
    </TokenContext.Provider>
  );
};
