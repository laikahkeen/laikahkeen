import axios, { type AxiosInstance } from 'axios';

// Web3Forms API configuration
const WEB3FORMS_API_URL = 'https://api.web3forms.com/submit';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Contact form data interface
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Web3Forms API response interface
export interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

/**
 * Submit contact form to Web3Forms
 * @param formData - The contact form data
 * @returns Promise with the API response
 * @throws Error if submission fails
 */
export const submitContactForm = async (
  formData: ContactFormData
): Promise<Web3FormsResponse> => {
  try {
    const response = await apiClient.post<Web3FormsResponse>(WEB3FORMS_API_URL, {
      access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_TOKEN,
      ...formData,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit form');
    }
    throw error;
  }
};
