export const validateEmail = async (email: string): Promise<boolean> => {
  try {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
    const apiKey = import.meta.env.VITE_API_KEY;
    const surveyId = import.meta.env.VITE_SURVEY_ID;
    
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return false;
    }

    const response = await fetch(`${apiEndpoint}/participant/has-answer/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        survey_id: surveyId,
      }),
    });

    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return false;
    }

    const result = await response.json();
    
    // You can adjust this logic based on your actual API response structure
    if (result.success || result.valid || response.status === 200) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating email:', error);
    return false;
  }
}; 