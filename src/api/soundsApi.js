export const fetchSoundStates = async () => {
  const response = await fetch('https://afisha-api.onrender.com/api/sounds')
  
  if (!response.ok) {
    throw new Error('Failed to fetch sound states')
  }
  
  const data = await response.json()
  
  // map _id from MongoDB to id for React
  return data.map(sound => ({
    ...sound,
    id: sound._id
  }))
}