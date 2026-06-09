export interface AIItemContext {
  levelCode: string;
  category: string;
  sectionTitle: string;
  sectionHeaders?: string[];
  itemOrder: number;
  itemCells: string[];
}

export interface AIExamplesResponse {
  examples: { german: string; english: string }[];
}

export interface AIQuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface AIQuizResponse {
  questions: AIQuizQuestion[];
}

export interface AIExplanationResponse {
  title: string;
  explanation: string;
  key_points: string[];
  common_mistakes: string[];
}
