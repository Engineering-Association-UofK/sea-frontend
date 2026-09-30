import { Department, Gender } from "@/features/profile/api/models";

export enum Role {
  SystemSuperAdmin = "sys:super_admin",
  SystemAdmin = "sys:admin",
  SystemAdminManager = "sys:admin_manager",
  SystemUserMgr = "sys:user_manager",
  SystemSupport = "sys:tech_support",
    
  ContentEditor = "content:editor",
  ContentBlogMgr = "content:blog_manager",
  ContentEventMgr = "content:event_manager",
  ContentFormMgr = "content:form_manager",
    
  Certifier = "cert:certifier",
  CertMgr = "cert:manager",
  PaperViewer = "cert:viewer",
    
  OrgOwner = "org:owner",
  OrgMember = "org:member",
  OrgModerator = "org:moderator",
}

export enum Language {
  English = "en",
  Arabic = "ar"
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  is_verified: boolean;
  redirect_url: string;
  roles: Role[];
  token: string;
  user_id: number;
}

export interface CheckRegistrationResponse {
  reg_step: number;
}

export interface ForgotPasswordPayload {
    user_id?: number;
    email?: string;
    username?: string;
    lang: string;
}

// Step 0
export interface InitialRegistrationRequest {
    // User index
    user_id: number;
    
    // Passcode provided from the association
    passcode: string;
    email: string;

    // Language currently used by the interface
    lang: Language;
}

// Step 1 & 5
export interface PasswordRegistrationRequest {
    reg_code: string;
    password: string;
    confirm_password: string;
}

// Step 2
export interface DetailsRegistrationRequest {
    reg_code: string;
    name_ar: string;
    name_en: string;
    gender: Gender;
    uni_id: string;
    department: Department;
    phone: string;
}

// Step 3
export interface UsernameRegistrationRequest {
    reg_code: string;
    username: string;
}

// Step 4 is where no action is needed