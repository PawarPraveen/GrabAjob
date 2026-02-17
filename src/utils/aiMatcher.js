/**
 * AI Match Engine - TF-IDF + Cosine Similarity for job-resume matching
 */

// Tokenize text into lowercase words, remove punctuation and stopwords
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'was', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'must',
  'shall', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'same',
  'so', 'than', 'too', 'very', 'just', 'if', 'because', 'while', 'also', 'up', 'down',
  'out', 'off', 'over', 'under', 'about', 'your', 'their', 'his', 'her', 'its', 'my', 'our'
])

export const tokenize = (text) => {
  if (!text || typeof text !== 'string') return []
  
  return text
    .toLowerCase()
    .match(/\b\w+\b/g) // extract words
    .filter(word => !STOP_WORDS.has(word) && word.length > 2) // remove stopwords and single letters
}

// Document Frequency for TF-IDF
const calculateDocumentFrequency = (documents) => {
  const df = {}
  
  documents.forEach(doc => {
    const uniqueWords = new Set(doc)
    uniqueWords.forEach(word => {
      df[word] = (df[word] || 0) + 1
    })
  })
  
  return df
}

// TF-IDF vectorization
const calculateTFIDF = (tokens, allDocuments) => {
  const df = calculateDocumentFrequency(allDocuments)
  const totalDocs = allDocuments.length
  const vector = {}
  
  // Term Frequency (TF)
  const tf = {}
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1
  })
  
  // TF-IDF = TF * log(N / DF)
  tokens.forEach(token => {
    const tfScore = tf[token] / tokens.length
    const idfScore = Math.log(totalDocs / (df[token] || 1))
    vector[token] = tfScore * idfScore
  })
  
  return vector
}

// Convert vector to array for cosine similarity
const vectorToArray = (vector, allTokens) => {
  return allTokens.map(token => vector[token] || 0)
}

// Cosine similarity
const cosineSimilarity = (vec1, vec2) => {
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    magnitude1 += vec1[i] * vec1[i]
    magnitude2 += vec2[i] * vec2[i]
  }
  
  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0
  return (dotProduct / (magnitude1 * magnitude2)) * 100 // return as percentage
}

// Match job description with resume
export const matchJobWithResume = (jobDescription, resumeData) => {
  try {
    // Extract tokens
    const jobTokens = tokenize(jobDescription)
    const resumeTokens = tokenize(resumeData)
    
    if (jobTokens.length === 0 || resumeTokens.length === 0) {
      return {
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        message: 'Unable to extract keywords. Please provide more information.'
      }
    }
    
    // Get unique tokens across both documents
    const allTokens = Array.from(new Set([...jobTokens, ...resumeTokens]))
    
    // Calculate TF-IDF vectors
    const allDocuments = [jobTokens, resumeTokens]
    const jobVector = calculateTFIDF(jobTokens, allDocuments)
    const resumeVector = calculateTFIDF(resumeTokens, allDocuments)
    
    // Convert to arrays for cosine similarity
    const jobArray = vectorToArray(jobVector, allTokens)
    const resumeArray = vectorToArray(resumeVector, allTokens)
    
    // Calculate similarity score
    const similarityScore = Math.round(cosineSimilarity(jobArray, resumeArray))
    
    // Find matched and missing keywords
    const matchedKeywords = jobTokens.filter(keyword => resumeTokens.includes(keyword))
    const missingKeywords = jobTokens.filter(keyword => !resumeTokens.includes(keyword))
    
    // Determine message
    let message = ''
    if (similarityScore > 85) {
      message = '✅ Strong match! Go ahead and apply with confidence.'
    } else if (similarityScore > 70) {
      message = '⚠️ Good match but you should update your resume with missing keywords.'
    } else {
      message = '❌ Low match. Consider updating your resume with the suggested keywords.'
    }
    
    return {
      score: similarityScore,
      matchedKeywords: [...new Set(matchedKeywords)],
      missingKeywords: [...new Set(missingKeywords)],
      message,
      jobTokens: jobTokens.slice(0, 20), // top keywords from job
      resumeTokens: resumeTokens.slice(0, 20), // top keywords from resume
    }
  } catch (error) {
    console.error('Error in matching:', error)
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      message: 'Error processing match. Please try again.',
      error: error.message
    }
  }
}

// Extract keywords from text by frequency
export const extractKeywords = (text, limit = 15) => {
  const tokens = tokenize(text)
  const frequency = {}
  
  tokens.forEach(token => {
    frequency[token] = (frequency[token] || 0) + 1
  })
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, freq]) => ({ keyword, frequency: freq }))
}

// Get learning resources (placeholder - will use YouTube + GeeksforGeeks APIs)
export const getLearningResources = (missingKeywords, domain = 'general') => {
  const resources = []
  
  missingKeywords.slice(0, 5).forEach(keyword => {
    // YouTube resources
    resources.push({
      type: 'youtube',
      title: `Learn ${keyword}`,
      url: `https://www.youtube.com/results?search_query=learn+${keyword}+tutorial`,
      platform: 'YouTube'
    })
    
    // GeeksforGeeks resources
    resources.push({
      type: 'geeksforgeeks',
      title: `${keyword} - GeeksforGeeks`,
      url: `https://www.geeksforgeeks.org/?s=${keyword}`,
      platform: 'GeeksforGeeks'
    })
  })
  
  return resources
}

// Suggestion engine - what to add to resume
export const generateSuggestions = (score, missingKeywords, matchedKeywords) => {
  const suggestions = []
  
  if (score < 85 && missingKeywords.length > 0) {
    suggestions.push({
      type: 'resume_update',
      title: 'Update Your Resume',
      description: `Add the following ${missingKeywords.length} missing keywords to strengthen your profile:`,
      keywords: missingKeywords.slice(0, 10)
    })
  }
  
  if (score < 70) {
    suggestions.push({
      type: 'skill_gap',
      title: 'Skill Gap Analysis',
      description: 'Consider learning these skills before applying:',
      keywords: missingKeywords.slice(0, 5)
    })
  }
  
  if (matchedKeywords.length > 0) {
    suggestions.push({
      type: 'strengths',
      title: 'Your Strengths',
      description: 'You already have these valuable keywords:',
      keywords: matchedKeywords.slice(0, 8)
    })
  }
  
  return suggestions
}
