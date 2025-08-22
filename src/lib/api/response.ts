export const submitSurveyResponse = async (
  invitationCode: string,
  surveyId: number,
  participant: {
    gender: string;
    birth_range: string;
    position: string;
    name: string;
    email: string;
  },
  answers: number[]
): Promise<boolean> => {
  try {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    const apiKey = import.meta.env.VITE_API_KEY;
    
    if (!apiKey) {
      console.error('API key not found in environment variables');
      throw new Error('API key not found');
    }

    const response = await fetch(`${apiEndpoint}/response/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`,
      },
      body: JSON.stringify({
        invitation_code: invitationCode,
        survey_id: surveyId,
        participant,
        answers
      }),
    });

    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    return true;
  } catch (error) {
    console.error('Error submitting survey response:', error);
    throw error;
  }
}; 