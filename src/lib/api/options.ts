export interface FormOption {
  value: string;
  label: string;
}

export interface FormOptionsResponse {
  status: FormOption[];
  gender: FormOption[];
  birth_range: FormOption[];
  position: FormOption[];
}

export const fetchOptions = async (): Promise<FormOptionsResponse> => {
  try {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    const apiKey = import.meta.env.VITE_API_KEY;
    
    if (!apiKey) {
      console.error('API key not found in environment variables');
      throw new Error('API key not found');
    }

    const response = await fetch(`${apiEndpoint}/options/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching options:', error);
    throw error;
  }
};
