import { useContext } from 'react';
import { EdgeAIContext } from '../Context/EdgeAIContext';

export const useEdgeAI = () => {
  const context = useContext(EdgeAIContext);
  if (!context) {
    throw new Error('useEdgeAI must be used within an EdgeAIProvider');
  }
  return context;
};
