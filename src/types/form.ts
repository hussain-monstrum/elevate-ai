export type StepType = "choice" | "text";

export type FormStep = {
  id: string;
  type: StepType;
  prompt: string;
  options?: string[];
  next: (answer: string) => string | null;
};

export type FormDefinition = {
  start: string;
  steps: Record<string, FormStep>;
};
