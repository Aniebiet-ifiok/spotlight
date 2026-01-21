import {
  ValidationErrors,
  validateAdditionalInfo,
  validateBasicInfo,
  validateCTA,
} from "@/lib/type";
import { CtaTypeEnum } from "@prisma/client";
import { create } from "zustand";

/* -------------------- FORM STATE -------------------- */

export type WebinarFormState = {
  basicInfo: {
    webinarName?: string;
    description?: string;
    date?: Date;
    time?: string;
    timeFormat?: "AM" | "PM";
  };
  cta: {
    ctaLabel?: string;
    tags?: string[];
    ctaType: CtaTypeEnum;
    aiAgent?: string;
    priceId?: string;
  };
  additionalInfo: {
    lockChat?: boolean;
    couponCode?: string;
    couponEnabled?: boolean;
  };
};

/* -------------------- VALIDATION STATE -------------------- */

type ValidationState = {
  basicInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
  cta: {
    valid: boolean;
    errors: ValidationErrors;
  };
  additionalInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
};

/* -------------------- STORE TYPE -------------------- */

type WebinarStore = {
  isModalOpen: boolean;
  isComplete: boolean;
  isSubmitting: boolean;

  formData: WebinarFormState;
  validation: ValidationState;

  setModalOpen: (open: boolean) => void;
  setComplete: (complete: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  updateBasicInfoField: <K extends keyof WebinarFormState["basicInfo"]>(
    field: K,
    value: WebinarFormState["basicInfo"][K]
  ) => void;

  updateCtaField: <K extends keyof WebinarFormState["cta"]>(
    field: K,
    value: WebinarFormState["cta"][K]
  ) => void;

  updateAdditionalInfoField: <
    K extends keyof WebinarFormState["additionalInfo"]
  >(
    field: K,
    value: WebinarFormState["additionalInfo"][K]
  ) => void;

  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;

  validateStep: (stepId: keyof WebinarFormState) => boolean;
  getStepValidationErrors: (
    stepId: keyof WebinarFormState
  ) => ValidationErrors;

  resetForm: () => void;
};

/* -------------------- INITIAL STATE -------------------- */

const initialState: WebinarFormState = {
  basicInfo: {
    webinarName: "",
    description: "",
    date: undefined,
    time: "",
    timeFormat: "AM",
  },
  cta: {
    ctaLabel: "",
    tags: [],
    ctaType: CtaTypeEnum.BOOK_A_CALL,
    aiAgent: "",
    priceId: "",
  },
  additionalInfo: {
    lockChat: false,
    couponCode: "",
    couponEnabled: false,
  },
};

const initialValidation: ValidationState = {
  basicInfo: { valid: false, errors: {} },
  cta: { valid: false, errors: {} },
  additionalInfo: { valid: true, errors: {} },
};

/* -------------------- ZUSTAND STORE -------------------- */

export const useWebinarStore = create<WebinarStore>((set, get) => ({
  isModalOpen: false,
  isComplete: false,
  isSubmitting: false,

  formData: initialState,
  validation: initialValidation,

  setModalOpen: (open) => set({ isModalOpen: open }),
  setComplete: (complete) => set({ isComplete: complete }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  /* ---------- BASIC INFO ---------- */
  updateBasicInfoField: (field, value) =>
    set((state) => {
      const newBasicInfo = {
        ...state.formData.basicInfo,
        [field]: value,
      };

      return {
        formData: {
          ...state.formData,
          basicInfo: newBasicInfo,
        },
        validation: {
          ...state.validation,
          basicInfo: validateBasicInfo(newBasicInfo),
        },
      };
    }),

  /* ---------- CTA ---------- */
  updateCtaField: (field, value) =>
    set((state) => {
      const newCTA = {
        ...state.formData.cta,
        [field]: value,
      };

      return {
        formData: {
          ...state.formData,
          cta: newCTA,
        },
        validation: {
          ...state.validation,
          cta: validateCTA(newCTA),
        },
      };
    }),

  addTag: (tag) =>
    set((state) => {
      const tags = state.formData.cta.tags || [];
      if (tags.includes(tag)) return state;

      const newCTA = {
        ...state.formData.cta,
        tags: [...tags, tag],
      };

      return {
        formData: {
          ...state.formData,
          cta: newCTA,
        },
        validation: {
          ...state.validation,
          cta: validateCTA(newCTA),
        },
      };
    }),

  removeTag: (tagToRemove) =>
    set((state) => {
      const newCTA = {
        ...state.formData.cta,
        tags: (state.formData.cta.tags || []).filter(
          (tag) => tag !== tagToRemove
        ),
      };

      return {
        formData: {
          ...state.formData,
          cta: newCTA,
        },
        validation: {
          ...state.validation,
          cta: validateCTA(newCTA),
        },
      };
    }),

  /* ---------- ADDITIONAL INFO ---------- */
  updateAdditionalInfoField: (field, value) =>
    set((state) => {
      const newAdditionalInfo = {
        ...state.formData.additionalInfo,
        [field]: value,
      };

      return {
        formData: {
          ...state.formData,
          additionalInfo: newAdditionalInfo,
        },
        validation: {
          ...state.validation,
          additionalInfo: validateAdditionalInfo(newAdditionalInfo),
        },
      };
    }),

  /* ---------- VALIDATION ---------- */
  validateStep: (stepId) => {
    const { formData } = get();

    const validationResult =
      stepId === "basicInfo"
        ? validateBasicInfo(formData.basicInfo)
        : stepId === "cta"
        ? validateCTA(formData.cta)
        : validateAdditionalInfo(formData.additionalInfo);

    set((state) => ({
      validation: {
        ...state.validation,
        [stepId]: validationResult,
      },
    }));

    return validationResult.valid;
  },

  getStepValidationErrors: (stepId) =>
    get().validation[stepId].errors,

  /* ---------- RESET ---------- */
  resetForm: () =>
    set({
      isComplete: false,
      isSubmitting: false,
      formData: initialState,
      validation: initialValidation,
    }),
}));
