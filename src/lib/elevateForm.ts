import { FormDefinition, FormStep } from "@/types/form";
import { supabase } from "./supabaseClient";

export const ACCREDITED_STEP = (nextId: string): FormStep => ({
  id: "accredited",
  type: "choice",
  prompt:
    "Are you an accredited investor?\n\n" +
    "To be considered accredited, you must meet income or net worth requirements.",
  options: ["Yes", "No"],
  next: () => nextId,
});

export const OBJECTIVE_STEP = (nextId: string): FormStep => ({
  id: "objective",
  type: "choice",
  prompt: "What is your primary objective in joining Elevate?",
  options: [
    "A curated network of like-minded individuals",
    "Vetted deal flow",
    "New Friendships",
    "Business opportunities",
    "Just a good time",
  ],
  next: () => nextId,
});

export const REFERRED_STEP: FormStep = {
  id: "referred",
  type: "choice",
  prompt: "Are you referred by an Elevate member?",
  options: ["Yes", "No"],
  next: (a: string) => (a === "Yes" ? "referrer_name" : null),
};

export const REFERRER_NAME_STEP: FormStep = {
  id: "referrer_name",
  type: "text",
  prompt: "Please provide the first and last name of your referrer.",
  next: () => null,
};

export const ELEVATE_SMS_FORM: FormDefinition = {
  start: "role",
  steps: {
    role: {
      id: "role",
      type: "choice",
      prompt: "Hi! This is Ellie 👋. Quick Question!.\n\n" +
        "How would you best describe yourself?",
      options: ["Executive", "Venture Capitalist", "Angel Investor", "Founder", "Other"],
      next: () => null,
    //   next: (a: string) => 
    //     {
    //     return {
    //       Executive: "exec_corp",
    //       "Venture Capitalist": "vc_fund",
    //       "Angel Investor": "angel_volume",
    //       Founder: "founder_startup",
    //       Other: "other_role",
    //     }[a] || null;
    //   },
    },

    // Executive
    exec_corp: { id: "exec_corp", type: "text", prompt: "What is the name of your corporation?", next: () => "exec_title" },
    exec_title: {
      id: "exec_title",
      type: "choice",
      prompt: "What is your title at the corporation?",
      options: ["C-Level", "VP", "Director", "Other"],
      next: () => "accredited",
    },

    // VC
    vc_fund: { id: "vc_fund", type: "text", prompt: "What is the name of your fund?", next: () => "vc_title" },
    vc_title: {
      id: "vc_title",
      type: "choice",
      prompt: "What is your title at the fund?",
      options: ["General Partner", "Partner", "Principal", "Associate", "Other"],
      next: () => "accredited",
    },

    // Angel
    angel_volume: {
      id: "angel_volume",
      type: "choice",
      prompt: "How many investments have you made in the last 12 months?",
      options: ["0-10", "10-20", "20-40", "40+"],
      next: () => "angel_check",
    },
    angel_check: {
      id: "angel_check",
      type: "choice",
      prompt: "What is your average check size per investment?",
      options: ["0-$15K", "$15-$50K", "$50K-$150K", "$150K-$500K", "$500K+"],
      next: () => "accredited",
    },

    // Founder
    founder_startup: { id: "founder_startup", type: "text", prompt: "What is the name of your startup?", next: () => "accredited" },

    // Other
    other_role: { id: "other_role", type: "text", prompt: "Please specify your role.", next: () => "other_achievements" },
    other_achievements: { id: "other_achievements", type: "text", prompt: "Please specify your biggest achievements.", next: () => "accredited" },

    // Shared Steps
    accredited: ACCREDITED_STEP("objective"),
    objective: OBJECTIVE_STEP("attended"),
    attended: {
      id: "attended",
      type: "choice",
      prompt: "Have you attended any Elevate events before?",
      options: ["Yes", "No"],
      next: () => "referred",
    },
    referred: REFERRED_STEP,
    referrer_name: REFERRER_NAME_STEP,
  },
};

// Helpers
export function getStep(stepId: string): FormStep {
  return ELEVATE_SMS_FORM.steps[stepId];
}

export function formatStepMessage(step: FormStep): string {
  if (step.type === "choice" && step.options) {
    return step.prompt + "\n\n" + step.options.map((o, i) => `${i + 1}. ${o}`).join("\n");
  }
  return step.prompt;
}
