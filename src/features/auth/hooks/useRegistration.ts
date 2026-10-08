import { useState, useCallback } from "react";
import { authService } from "../api/auth.service";
import { useLanguage } from "../../../context/LanguageContext";
import {
  InitialRegistrationRequest,
  PasswordRegistrationRequest,
  DetailsRegistrationRequest,
  UsernameRegistrationRequest,
  Language,
} from "../api/models";
import { Department, Gender } from "@/features/profile/api/models";

// Input types for callers (supports legacy camelCase JS calls)
export interface InitialInput {
  userId: number | string;
  passcode: string;
  email: string;
}

export interface DetailsInput {
  nameAr: string;
  nameEn: string;
  gender: Gender | string;
  uniId: number | string;
  department: Department | string;
  phone?: string;
}

export interface UseRegistrationReturn {
  loading: boolean;
  error: string | null;
  currentStep: number | null;
  clearError: () => void;
  checkState: (regCode: string) => Promise<number | undefined>;
  submitInitial: (data: InitialInput) => Promise<any>;
  submitPassword: (
    regCode: string,
    stepNumber: number | string,
    password: string,
    confirmPassword: string,
  ) => Promise<any>;
  submitDetails: (regCode: string, detailsData: DetailsInput) => Promise<any>;
  submitUsername: (regCode: string, username: string) => Promise<any>;
}

export const useRegistration = (): UseRegistrationReturn => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const clearError = () => setError(null);

  // Check state step via registration code
  const checkState = useCallback(async (regCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.checkRegistration(regCode);
      const step = response?.reg_step;
      if (typeof step === "number") {
        setCurrentStep(step);
      }
      return step;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to verify registration code.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Step 0: Initial Registration
  const submitInitial = async ({ userId, passcode, email }: InitialInput) => {
    setLoading(true);
    setError(null);
    try {
      const payload: InitialRegistrationRequest = {
        user_id: Number(userId),
        passcode,
        email,
        lang: (language as Language) || Language.English,
      };
      return await authService.doRegistrationStep(0, payload);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Initial registration failed.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 1 & Step 5: Password Credentials
  const submitPassword = async (
    regCode: string,
    stepNumber: number | string,
    password: string,
    confirmPassword: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const payload: PasswordRegistrationRequest = {
        reg_code: regCode,
        password,
        confirm_password: confirmPassword,
      };
      return await authService.doRegistrationStep(stepNumber, payload);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Password submission failed.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Student Details
  const submitDetails = async (regCode: string, detailsData: DetailsInput) => {
    setLoading(true);
    setError(null);
    try {
      const payload: DetailsRegistrationRequest = {
        reg_code: regCode,
        name_ar: detailsData.nameAr,
        name_en: detailsData.nameEn,
        gender: detailsData.gender as Gender,
        uni_id: String(detailsData.uniId),
        department: detailsData.department as Department,
        phone: detailsData.phone || "",
      };
      return await authService.doRegistrationStep(2, payload);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Details submission failed.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Username Setup
  const submitUsername = async (regCode: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload: UsernameRegistrationRequest = {
        reg_code: regCode,
        username,
      };
      return await authService.doRegistrationStep(3, payload);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Username registration failed.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    currentStep,
    clearError,
    checkState,
    submitInitial,
    submitPassword,
    submitDetails,
    submitUsername,
  };
};
