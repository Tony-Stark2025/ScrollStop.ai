import { CarouselData, GenerateRequest } from '../types';

export async function generateCarouselStructure(requestData: GenerateRequest): Promise<CarouselData> {
  try {
    const formData = new FormData();
    formData.append('topic', requestData.topic);
    formData.append('audience', requestData.audience);
    formData.append('tone', requestData.tone);
    formData.append('goal', requestData.goal);
    if (requestData.file) {
      formData.append('file', requestData.file);
    }

    const response = await fetch('/api/generate-structure', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate carousel structure from the API.');
    }

    const data = await response.json();
    return data as CarouselData;
  } catch (error) {
    console.error("Error generating carousel structure:", error);
    throw error;
  }
}

export async function generateSlideImage(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate slide image from the API.');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating slide image:", error);
    throw error;
  }
}
