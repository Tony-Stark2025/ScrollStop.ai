
export interface Slide {
  id: string;
  title: string;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface CarouselData {
  topic: string;
  slides: Slide[];
}

export interface GenerateRequest {
  topic: string;
  audience: string;
  tone: string;
  goal: string;
  file?: File | null;
}
