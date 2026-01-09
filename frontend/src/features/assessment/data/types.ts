export interface AptitudeOption {
  id: string;
  text: string;
}

export interface AptitudeQuestion {
  id: number;
  question: string;
  options: AptitudeOption[];
  correctAnswer?: string;
  explanation?: string;
}

export interface AptitudeSubCategory {
  id: string;
  name: string;
  questions: AptitudeQuestion[];
}

export interface AptitudeCategory {
  id: string;
  name: string;
  subCategories: AptitudeSubCategory[];
}
