export type AIActionType = "examples" | "quiz" | "explanation";

export interface AIItemContext {
  levelCode: string;
  category: string;
  sectionTitle: string;
  sectionHeaders?: string[];
  itemOrder: number;
  itemCells: string[];
}

export interface AIGenerateRequest {
  level_code: string;
  category: string;
  section_title: string;
  section_headers?: string[];
  item_cells: string[];
  action_type: AIActionType;
  model?: string;
  save_as_default?: boolean;
}

export interface AIContentResponse {
  id: string;
  action_type: AIActionType;
  level_code: string;
  category: string;
  section_title: string;
  item_cells: string[];
  section_headers: string[];
  response_text: string;
  response_json: AIExamplesResponse | AIQuizResponse | AIExplanationResponse | null;
  model_used: string;
  is_saved: boolean;
  created_at: string;
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

export interface LLMModelOption {
  id: string;
  model_id: string;
  name: string;
  provider: string;
  is_default: boolean;
  approx_cost_eur: number;
}

export interface UserCreditResponse {
  credit_balance: string;
  currency: string;
}

export interface UserAIContentItem {
  id: string;
  ai_content: AIContentResponse;
  share_key: string | null;
  created_at: string;
}
