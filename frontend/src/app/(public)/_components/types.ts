export interface FeatureItem {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ExamCard {
  level: string;
  levelBg: string;
  levelColor: string;
  name: string;
  description: string;
  status: "available" | "coming-soon";
}

export interface TopUpPlan {
  credits: string;
  price: string;
  perCredit: string;
  popular?: boolean;
}

export interface AiFeatureItem {
  text: React.ReactNode;
}
