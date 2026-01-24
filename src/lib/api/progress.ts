import type { FormResponse, GuestCodeResponse, EmailResponse } from '../../store/formStore';

export interface ProgressData {
    email: string;
    survey_id: number;
    current_screen: number;
    data: {
        guestCodeResponse: GuestCodeResponse | null;
        emailResponse: EmailResponse | null;
        responses: FormResponse[];
    };
}

export interface SaveProgressPayload {
    email: string;
    survey: number;
    current_screen: number;
    data: {
        guestCodeResponse: GuestCodeResponse | null;
        emailResponse: EmailResponse | null;
        responses: FormResponse[];
    };
}

/**
 * Save the current form progress to the backend
 */
export const saveProgress = async (payload: SaveProgressPayload): Promise<boolean> => {
    try {
        const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
            console.error('API key not found in environment variables');
            throw new Error('API key not found');
        }

        const response = await fetch(`${apiEndpoint}/progress/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Save progress API request failed:', response.status, response.statusText);
            throw new Error(`Save progress failed: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error saving progress:', error);
        throw error;
    }
};

/**
 * Fetch saved progress for a given email and survey
 */
export const fetchProgress = async (email: string, surveyId: number): Promise<ProgressData | null> => {
    try {
        const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
            console.error('API key not found in environment variables');
            throw new Error('API key not found');
        }

        const response = await fetch(
            `${apiEndpoint}/progress/?email=${encodeURIComponent(email)}&survey=${surveyId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${apiKey}`,
                },
            }
        );

        if (response.status === 404) {
            // No saved progress found
            return null;
        }

        if (!response.ok) {
            console.error('Fetch progress API request failed:', response.status, response.statusText);
            throw new Error(`Fetch progress failed: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching progress:', error);
        throw error;
    }
};

/**
 * Mark progress as complete (delete or flag as completed)
 */
export const completeProgress = async (email: string, surveyId: number): Promise<boolean> => {
    try {
        const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!apiKey) {
            console.error('API key not found in environment variables');
            throw new Error('API key not found');
        }

        const response = await fetch(
            `${apiEndpoint}/progress/?email=${encodeURIComponent(email)}&survey=${surveyId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            console.error('Complete progress API request failed:', response.status, response.statusText);
            throw new Error(`Complete progress failed: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error completing progress:', error);
        throw error;
    }
};
