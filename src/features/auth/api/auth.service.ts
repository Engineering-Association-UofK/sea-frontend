import apiClient from "../../../api/axiosClient";
import {
  LoginParams,
  LoginResponse,
  CheckRegistrationResponse,
  ForgotPasswordPayload,
  InitialRegistrationRequest,
  PasswordRegistrationRequest,
  DetailsRegistrationRequest,
  UsernameRegistrationRequest,
} from "./models";

const ENDPOINT = "/v1/auth";

export const authService = {
  login: async (credentials: LoginParams): Promise<LoginResponse> => {
    const response = await apiClient.post(`${ENDPOINT}/login`, credentials, {
      skipAuth: true,
    });
    return response;
  },

  checkRegistration: async (
    regCode: string,
  ): Promise<CheckRegistrationResponse> => {
    return await apiClient.post(`${ENDPOINT}/register/check`, {
      reg_code: regCode,
    });
  },

  doRegistrationStep: async (
    step: number | string,
    data:
      | InitialRegistrationRequest
      | PasswordRegistrationRequest
      | DetailsRegistrationRequest
      | UsernameRegistrationRequest
      | Record<string, any>,
  ) => {
    return await apiClient.post(`${ENDPOINT}/register/step`, {
      step: Number(step),
      data,
    });
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    return await apiClient.post(`${ENDPOINT}/forgot-password`, payload);
  },

  logout: async (): Promise<void> => {
    // Optional backend session invalidation call
  },
};
