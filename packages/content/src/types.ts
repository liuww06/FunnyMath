export interface InteractiveContent {
  id: string;
  title: string;
  grade: string; // "3-4" for 3rd-4th grade
  difficulty: 1 | 2 | 3;
  component: React.ComponentType;
  learningObjectives: string[];
}

export interface GeometryContent extends InteractiveContent {
  category: 'plane' | 'solid' | 'transform';
}
