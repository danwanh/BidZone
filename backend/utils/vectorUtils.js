export const dotProduct = (vecA, vecB) => {
  return Object.keys(vecA).reduce((sum, key) => {
    return sum + (vecA[key] || 0) * (vecB[key] || 0);
  }, 0);
};

export const magnitude = (vec) => {
  const sumOfSquares = Object.values(vec).reduce((sum, val) => {
    return sum + val * val;
  }, 0);
  return Math.sqrt(sumOfSquares);
};

export const cosineSimilarity = (vecA, vecB) => {
  const dot = dotProduct(vecA, vecB);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

export const normalize = (val, min, max) => {
  if (max === min) return 0;
  return (val - min) / (max - min);
};
