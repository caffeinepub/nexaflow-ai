import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    name: string;
    email: string;
    message: string;
}
export interface Admin {
    principal: Principal;
    email: string;
}
export interface Service {
    id: bigint;
    title: string;
    description: string;
    icon: string;
    colorKey: string;
}
export interface Testimonial {
    id: bigint;
    quote: string;
    name: string;
    title: string;
    company: string;
    initials: string;
    colorKey: string;
}
export interface backendInterface {
    addAdmin(email: string): Promise<void>;
    getAllAdmins(): Promise<Array<Admin>>;
    getAllSubmissions(): Promise<Array<Submission>>;
    deleteSubmission(index: bigint): Promise<boolean>;
    isAdmin(): Promise<boolean>;
    removeAdmin(): Promise<void>;
    submitForm(name: string, email: string, message: string): Promise<void>;
    updateAdminEmail(newEmail: string): Promise<void>;
    getServices(): Promise<Array<Service>>;
    addService(title: string, description: string, icon: string, colorKey: string): Promise<bigint>;
    updateService(id: bigint, title: string, description: string, icon: string, colorKey: string): Promise<boolean>;
    deleteService(id: bigint): Promise<boolean>;
    getTestimonials(): Promise<Array<Testimonial>>;
    addTestimonial(quote: string, name: string, title: string, company: string, initials: string, colorKey: string): Promise<bigint>;
    updateTestimonial(id: bigint, quote: string, name: string, title: string, company: string, initials: string, colorKey: string): Promise<boolean>;
    deleteTestimonial(id: bigint): Promise<boolean>;
}
