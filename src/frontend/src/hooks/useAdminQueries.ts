import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ─── Admin ────────────────────────────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAdmins() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allAdmins"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdmins();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteSubmission() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteSubmission(index);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allSubmissions"] }),
  });
}

export function useAddAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.addAdmin(email);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allAdmins"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.removeAdmin();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allAdmins"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useUpdateAdminEmail() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newEmail: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateAdminEmail(newEmail);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allAdmins"] });
    },
  });
}

// ─── Services ─────────────────────────────────────────────────────────────────
export interface Service {
  id: bigint;
  title: string;
  description: string;
  icon: string;
  colorKey: string;
}

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      icon: string;
      colorKey: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addService(
        data.title,
        data.description,
        data.icon,
        data.colorKey,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      icon: string;
      colorKey: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateService(
        data.id,
        data.title,
        data.description,
        data.icon,
        data.colorKey,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export interface Testimonial {
  id: bigint;
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
  colorKey: string;
}

export function useGetTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      quote: string;
      name: string;
      title: string;
      company: string;
      initials: string;
      colorKey: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addTestimonial(
        data.quote,
        data.name,
        data.title,
        data.company,
        data.initials,
        data.colorKey,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      quote: string;
      name: string;
      title: string;
      company: string;
      initials: string;
      colorKey: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateTestimonial(
        data.id,
        data.quote,
        data.name,
        data.title,
        data.company,
        data.initials,
        data.colorKey,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteTestimonial(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}
