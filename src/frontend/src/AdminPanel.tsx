import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  type Service,
  type Testimonial,
  useAddAdmin,
  useAddService,
  useAddTestimonial,
  useDeleteService,
  useDeleteSubmission,
  useDeleteTestimonial,
  useGetAllAdmins,
  useGetAllSubmissions,
  useGetServices,
  useGetTestimonials,
  useIsAdmin,
  useRemoveAdmin,
  useUpdateAdminEmail,
  useUpdateService,
  useUpdateTestimonial,
} from "@/hooks/useAdminQueries";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  AlertTriangle,
  BarChart3,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  Shield,
  ShieldCheck,
  Star,
  Trash2,
  UserPlus,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type AdminPage =
  | "dashboard"
  | "services"
  | "testimonials"
  | "submissions"
  | "admins";

// ─── Shared helpers ───────────────────────────────────────────────────────────
function FieldRow({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-foreground text-sm">
        {label}
      </Label>
      {children}
    </div>
  );
}

// ─── Login Gate ──────────────────────────────────────────────────────────────
function LoginGate({ children }: { children: React.ReactNode }) {
  const { isLoginSuccess, login, isLoggingIn, identity } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const addAdminMutation = useAddAdmin();

  if (!isLoginSuccess || !identity) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="admin-card rounded-2xl p-10 max-w-md w-full mx-4 text-center"
          data-ocid="admin.panel"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.56 0.22 264), oklch(0.52 0.24 295))",
              boxShadow: "0 0 40px oklch(0.56 0.22 264 / 30%)",
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in with Internet Identity to access the Luxe Parfum admin
            dashboard.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full admin-btn-primary"
            size="lg"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            {isLoggingIn
              ? "Signing in\u2026"
              : "Sign in with Internet Identity"}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-bg">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(0.56 0.22 264)" }}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card rounded-2xl p-10 max-w-md w-full mx-4 text-center"
          data-ocid="admin.panel"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "oklch(0.55 0.18 30 / 20%)",
              border: "1px solid oklch(0.55 0.18 30 / 40%)",
            }}
          >
            <AlertTriangle
              className="w-8 h-8"
              style={{ color: "oklch(0.75 0.18 55)" }}
            />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Not an Admin
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your principal is not registered as an admin. Register yourself as
            the first admin to access this panel.
          </p>
          <Button
            onClick={() =>
              addAdminMutation.mutate("", {
                onSuccess: () => toast.success("You are now an admin!"),
                onError: () => toast.error("Failed to register as admin."),
              })
            }
            disabled={addAdminMutation.isPending}
            className="w-full admin-btn-primary"
            data-ocid="admin.primary_button"
          >
            {addAdminMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            {addAdminMutation.isPending
              ? "Registering\u2026"
              : "Register as Admin"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({
  setPage,
}: {
  setPage: (p: AdminPage) => void;
}) {
  const { data: submissions = [], isLoading: loadingSubs } =
    useGetAllSubmissions();
  const { data: admins = [], isLoading: loadingAdmins } = useGetAllAdmins();
  const { data: services = [], isLoading: loadingServices } = useGetServices();
  const { data: testimonials = [], isLoading: loadingTestimonials } =
    useGetTestimonials();

  const loading =
    loadingSubs || loadingAdmins || loadingServices || loadingTestimonials;

  const stats = [
    {
      label: "Services",
      value: services.length,
      icon: Wrench,
      color: "oklch(0.56 0.22 264)",
      glow: "oklch(0.56 0.22 264 / 25%)",
      page: "services" as AdminPage,
    },
    {
      label: "Testimonials",
      value: testimonials.length,
      icon: Star,
      color: "oklch(0.52 0.24 295)",
      glow: "oklch(0.52 0.24 295 / 25%)",
      page: "testimonials" as AdminPage,
    },
    {
      label: "Submissions",
      value: submissions.length,
      icon: Inbox,
      color: "oklch(0.78 0.13 200)",
      glow: "oklch(0.78 0.13 200 / 25%)",
      page: "submissions" as AdminPage,
    },
    {
      label: "Admin Users",
      value: admins.length,
      icon: Users,
      color: "oklch(0.65 0.18 150)",
      glow: "oklch(0.65 0.18 150 / 25%)",
      page: "admins" as AdminPage,
    },
  ];

  return (
    <div className="space-y-8" data-ocid="dashboard.section">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm">
          Overview of your Luxe Parfum platform.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            data-ocid="dashboard.card"
          >
            <Card
              className="admin-card border-0 cursor-pointer hover:border-white/10 transition-all"
              onClick={() => setPage(s.page)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  {loading ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    <span
                      className="font-display text-4xl font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: s.glow,
                      boxShadow: `0 0 20px ${s.glow}`,
                    }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="admin-card border-0">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Inbox
              className="w-4 h-4"
              style={{ color: "oklch(0.56 0.22 264)" }}
            />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSubs ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-10 w-full" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground text-sm"
              data-ocid="dashboard.empty_state"
            >
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.slice(0, 5).map((s, i) => (
                <div
                  key={s.email + s.name}
                  className="flex items-center gap-3 p-3 rounded-lg admin-row"
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{
                        background: "oklch(0.56 0.22 264 / 20%)",
                        color: "oklch(0.56 0.22 264)",
                      }}
                    >
                      {s.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.email}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[200px] truncate hidden md:block">
                    {s.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const EMPTY_SERVICE = {
  title: "",
  description: "",
  icon: "",
  colorKey: "",
};

function ServiceModal({
  open,
  onOpenChange,
  initial,
  onSave,
  isPending,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: typeof EMPTY_SERVICE;
  onSave: (data: typeof EMPTY_SERVICE) => void;
  isPending: boolean;
  title: string;
}) {
  const [form, setForm] = useState(initial);

  // Reset form when modal opens
  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initial);
    onOpenChange(v);
  };

  function set(field: keyof typeof EMPTY_SERVICE) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="admin-dialog max-w-lg"
        data-ocid="services.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the service details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow label="Title" id="svc-title">
            <Input
              id="svc-title"
              placeholder="Workflow Automation"
              value={form.title}
              onChange={set("title")}
              className="admin-input"
              data-ocid="services.input"
            />
          </FieldRow>
          <FieldRow label="Description" id="svc-desc">
            <Textarea
              id="svc-desc"
              placeholder="Describe the service\u2026"
              value={form.description}
              onChange={set("description")}
              rows={3}
              className="admin-input resize-none"
              data-ocid="services.textarea"
            />
          </FieldRow>
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Icon (lucide name)" id="svc-icon">
              <Input
                id="svc-icon"
                placeholder="Zap"
                value={form.icon}
                onChange={set("icon")}
                className="admin-input"
                data-ocid="services.input"
              />
            </FieldRow>
            <FieldRow label="Color Key" id="svc-color">
              <Input
                id="svc-color"
                placeholder="blue"
                value={form.colorKey}
                onChange={set("colorKey")}
                className="admin-input"
                data-ocid="services.input"
              />
            </FieldRow>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="admin-btn-outline"
            data-ocid="services.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={isPending || !form.title}
            className="admin-btn-primary"
            data-ocid="services.submit_button"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ServicesPage() {
  const { data: services = [], isLoading } = useGetServices();
  const addMutation = useAddService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  function handleAdd(form: typeof EMPTY_SERVICE) {
    addMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Service added!");
        setAddOpen(false);
      },
      onError: () => toast.error("Failed to add service."),
    });
  }

  function handleEdit(form: typeof EMPTY_SERVICE) {
    if (!editTarget) return;
    updateMutation.mutate(
      { id: editTarget.id, ...form },
      {
        onSuccess: () => {
          toast.success("Service updated!");
          setEditTarget(null);
        },
        onError: () => toast.error("Failed to update service."),
      },
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Service deleted.");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete service."),
    });
  }

  return (
    <div className="space-y-6" data-ocid="services.section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Services
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage the services displayed on the public site.
          </p>
        </div>
        <Button
          size="sm"
          className="admin-btn-primary self-start sm:self-auto"
          onClick={() => setAddOpen(true)}
          data-ocid="services.open_modal_button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Add modal */}
      <ServiceModal
        open={addOpen}
        onOpenChange={setAddOpen}
        initial={EMPTY_SERVICE}
        onSave={handleAdd}
        isPending={addMutation.isPending}
        title="Add Service"
      />

      {/* Edit modal */}
      <ServiceModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        initial={
          editTarget
            ? {
                title: editTarget.title,
                description: editTarget.description,
                icon: editTarget.icon,
                colorKey: editTarget.colorKey,
              }
            : EMPTY_SERVICE
        }
        onSave={handleEdit}
        isPending={updateMutation.isPending}
        title="Edit Service"
      />

      {/* Delete confirm */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent className="admin-dialog" data-ocid="services.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Service</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.title}
              </span>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="admin-btn-outline"
              data-ocid="services.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              data-ocid="services.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="admin-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 w-full" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground text-sm"
              data-ocid="services.empty_state"
            >
              No services yet. Add your first service above.
            </div>
          ) : (
            <Table data-ocid="services.table">
              <TableHeader>
                <TableRow className="admin-table-header">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">
                    Icon
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">
                    Color Key
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((svc, i) => (
                  <TableRow
                    key={String(svc.id)}
                    className="admin-table-row"
                    data-ocid={`services.row.${i + 1}`}
                  >
                    <TableCell>
                      <span className="text-sm font-medium text-foreground">
                        {svc.title}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                        {svc.description}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        className="font-mono text-xs"
                        style={{
                          background: "oklch(0.56 0.22 264 / 15%)",
                          color: "oklch(0.75 0.15 264)",
                          border: "1px solid oklch(0.56 0.22 264 / 25%)",
                        }}
                      >
                        {svc.icon}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        className="font-mono text-xs"
                        style={{
                          background: "oklch(0.52 0.24 295 / 15%)",
                          color: "oklch(0.72 0.12 295)",
                          border: "1px solid oklch(0.52 0.24 295 / 25%)",
                        }}
                      >
                        {svc.colorKey}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditTarget(svc)}
                          data-ocid={`services.edit_button.${i + 1}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => setDeleteTarget(svc)}
                          data-ocid={`services.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const EMPTY_TESTIMONIAL = {
  name: "",
  title: "",
  company: "",
  quote: "",
  initials: "",
  colorKey: "",
};

function TestimonialModal({
  open,
  onOpenChange,
  initial,
  onSave,
  isPending,
  modalTitle,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: typeof EMPTY_TESTIMONIAL;
  onSave: (data: typeof EMPTY_TESTIMONIAL) => void;
  isPending: boolean;
  modalTitle: string;
}) {
  const [form, setForm] = useState(initial);

  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initial);
    onOpenChange(v);
  };

  function set(field: keyof typeof EMPTY_TESTIMONIAL) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="admin-dialog max-w-lg"
        data-ocid="testimonials.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">{modalTitle}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the testimonial details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Name" id="tm-name">
              <Input
                id="tm-name"
                placeholder="Sarah Chen"
                value={form.name}
                onChange={set("name")}
                className="admin-input"
                data-ocid="testimonials.input"
              />
            </FieldRow>
            <FieldRow label="Initials" id="tm-initials">
              <Input
                id="tm-initials"
                placeholder="SC"
                value={form.initials}
                onChange={set("initials")}
                className="admin-input"
                maxLength={3}
                data-ocid="testimonials.input"
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Job Title" id="tm-title">
              <Input
                id="tm-title"
                placeholder="CTO"
                value={form.title}
                onChange={set("title")}
                className="admin-input"
                data-ocid="testimonials.input"
              />
            </FieldRow>
            <FieldRow label="Company" id="tm-company">
              <Input
                id="tm-company"
                placeholder="Vertex Labs"
                value={form.company}
                onChange={set("company")}
                className="admin-input"
                data-ocid="testimonials.input"
              />
            </FieldRow>
          </div>
          <FieldRow label="Color Key" id="tm-color">
            <Input
              id="tm-color"
              placeholder="blue"
              value={form.colorKey}
              onChange={set("colorKey")}
              className="admin-input"
              data-ocid="testimonials.input"
            />
          </FieldRow>
          <FieldRow label="Quote" id="tm-quote">
            <Textarea
              id="tm-quote"
              placeholder="Write the testimonial quote here\u2026"
              value={form.quote}
              onChange={set("quote")}
              rows={4}
              className="admin-input resize-none"
              data-ocid="testimonials.textarea"
            />
          </FieldRow>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="admin-btn-outline"
            data-ocid="testimonials.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={isPending || !form.name || !form.quote}
            className="admin-btn-primary"
            data-ocid="testimonials.submit_button"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Testimonial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useGetTestimonials();
  const addMutation = useAddTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  function handleAdd(form: typeof EMPTY_TESTIMONIAL) {
    addMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Testimonial added!");
        setAddOpen(false);
      },
      onError: () => toast.error("Failed to add testimonial."),
    });
  }

  function handleEdit(form: typeof EMPTY_TESTIMONIAL) {
    if (!editTarget) return;
    updateMutation.mutate(
      { id: editTarget.id, ...form },
      {
        onSuccess: () => {
          toast.success("Testimonial updated!");
          setEditTarget(null);
        },
        onError: () => toast.error("Failed to update testimonial."),
      },
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Testimonial deleted.");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete testimonial."),
    });
  }

  return (
    <div className="space-y-6" data-ocid="testimonials.section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Testimonials
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage customer testimonials shown on the public site.
          </p>
        </div>
        <Button
          size="sm"
          className="admin-btn-primary self-start sm:self-auto"
          onClick={() => setAddOpen(true)}
          data-ocid="testimonials.open_modal_button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Add modal */}
      <TestimonialModal
        open={addOpen}
        onOpenChange={setAddOpen}
        initial={EMPTY_TESTIMONIAL}
        onSave={handleAdd}
        isPending={addMutation.isPending}
        modalTitle="Add Testimonial"
      />

      {/* Edit modal */}
      <TestimonialModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        initial={
          editTarget
            ? {
                name: editTarget.name,
                title: editTarget.title,
                company: editTarget.company,
                quote: editTarget.quote,
                initials: editTarget.initials,
                colorKey: editTarget.colorKey,
              }
            : EMPTY_TESTIMONIAL
        }
        onSave={handleEdit}
        isPending={updateMutation.isPending}
        modalTitle="Edit Testimonial"
      />

      {/* Delete confirm */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent className="admin-dialog" data-ocid="testimonials.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Delete Testimonial
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete the testimonial from{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="admin-btn-outline"
              data-ocid="testimonials.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              data-ocid="testimonials.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="admin-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 w-full" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground text-sm"
              data-ocid="testimonials.empty_state"
            >
              No testimonials yet. Add your first testimonial above.
            </div>
          ) : (
            <Table data-ocid="testimonials.table">
              <TableHeader>
                <TableRow className="admin-table-header">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">
                    Title / Company
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Quote
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">
                    Initials
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t, i) => (
                  <TableRow
                    key={String(t.id)}
                    className="admin-table-row"
                    data-ocid={`testimonials.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback
                            className="text-xs font-bold"
                            style={{
                              background: "oklch(0.52 0.24 295 / 20%)",
                              color: "oklch(0.72 0.12 295)",
                            }}
                          >
                            {t.initials || t.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {t.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {t.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t.company}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                        &ldquo;{t.quote}&rdquo;
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        className="font-mono text-xs"
                        style={{
                          background: "oklch(0.52 0.24 295 / 15%)",
                          color: "oklch(0.72 0.12 295)",
                          border: "1px solid oklch(0.52 0.24 295 / 25%)",
                        }}
                      >
                        {t.initials}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditTarget(t)}
                          data-ocid={`testimonials.edit_button.${i + 1}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => setDeleteTarget(t)}
                          data-ocid={`testimonials.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Submissions ──────────────────────────────────────────────────────────────
function Submissions() {
  const { data: submissions = [], isLoading } = useGetAllSubmissions();
  const deleteSubmission = useDeleteSubmission();
  const [search, setSearch] = useState("");
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const filtered = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.message.toLowerCase().includes(search.toLowerCase()),
  );

  function handleDelete(idx: number) {
    deleteSubmission.mutate(BigInt(idx), {
      onSuccess: () => {
        toast.success("Submission deleted.");
        setDeleteIdx(null);
      },
      onError: () => toast.error("Failed to delete submission."),
    });
  }

  return (
    <div className="space-y-6" data-ocid="submissions.section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Contact Submissions
          </h2>
          <p className="text-muted-foreground text-sm">
            All form submissions from the public site.
          </p>
        </div>
        <Badge
          className="self-start sm:self-auto px-3 py-1"
          style={{
            background: "oklch(0.56 0.22 264 / 20%)",
            color: "oklch(0.56 0.22 264)",
            border: "1px solid oklch(0.56 0.22 264 / 30%)",
          }}
        >
          {submissions.length} total
        </Badge>
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or message\u2026"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 admin-input"
          data-ocid="submissions.search_input"
        />
      </div>

      <Card className="admin-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground text-sm"
              data-ocid="submissions.empty_state"
            >
              {search
                ? "No submissions match your search."
                : "No submissions yet."}
            </div>
          ) : (
            <Table data-ocid="submissions.table">
              <TableHeader>
                <TableRow className="admin-table-header">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Message
                  </TableHead>
                  <TableHead className="text-muted-foreground w-16">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s, i) => (
                  <TableRow
                    key={s.email + s.name}
                    className="admin-table-row"
                    data-ocid={`submissions.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback
                            className="text-xs"
                            style={{
                              background: "oklch(0.52 0.24 295 / 20%)",
                              color: "oklch(0.52 0.24 295)",
                            }}
                          >
                            {s.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {s.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {s.email}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                        {s.message}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={deleteIdx === i}
                        onOpenChange={(o) => !o && setDeleteIdx(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteIdx(i)}
                            data-ocid="submissions.delete_button"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="admin-card border-0 max-w-sm">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">
                              Delete Submission?
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              This will permanently delete the submission from{" "}
                              {s.name}. This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              className="admin-btn-outline"
                              onClick={() => setDeleteIdx(null)}
                              data-ocid="submissions.cancel_button"
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(i)}
                              disabled={deleteSubmission.isPending}
                              data-ocid="submissions.confirm_button"
                            >
                              {deleteSubmission.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Admins Management ────────────────────────────────────────────────────────
function AdminsPage() {
  const { data: admins = [], isLoading } = useGetAllAdmins();
  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();
  const updateEmailMutation = useUpdateAdminEmail();
  const { identity } = useInternetIdentity();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const myPrincipal = identity?.getPrincipal().toString();

  function handleAdd() {
    addAdminMutation.mutate(newEmail, {
      onSuccess: () => {
        toast.success("Admin added successfully!");
        setAddOpen(false);
        setNewEmail("");
      },
      onError: () => toast.error("Failed to add admin."),
    });
  }

  function handleUpdateEmail() {
    updateEmailMutation.mutate(editEmail, {
      onSuccess: () => {
        toast.success("Email updated!");
        setEditOpen(false);
        setEditEmail("");
      },
      onError: () => toast.error("Failed to update email."),
    });
  }

  function handleRemoveSelf() {
    removeAdminMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("You have been removed as admin.");
        setRemoveOpen(false);
      },
      onError: () => toast.error("Failed to remove admin."),
    });
  }

  return (
    <div className="space-y-6" data-ocid="admins.section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Admin Management
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage admin access for Luxe Parfum.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="admin-btn-outline"
                data-ocid="admins.edit_button"
              >
                <Mail className="mr-2 h-4 w-4" />
                Update My Email
              </Button>
            </DialogTrigger>
            <DialogContent className="admin-dialog" data-ocid="admins.dialog">
              <DialogHeader>
                <DialogTitle className="font-display">Update Email</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Update your associated email address.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Label htmlFor="edit-email" className="text-foreground">
                  New Email
                </Label>
                <Input
                  id="edit-email"
                  placeholder="admin@example.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="admin-input"
                  data-ocid="admins.input"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  className="admin-btn-outline"
                  data-ocid="admins.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateEmail}
                  disabled={updateEmailMutation.isPending || !editEmail}
                  className="admin-btn-primary"
                  data-ocid="admins.save_button"
                >
                  {updateEmailMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="admin-btn-primary"
                data-ocid="admins.open_modal_button"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="admin-dialog" data-ocid="admins.dialog">
              <DialogHeader>
                <DialogTitle className="font-display">Add Admin</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Register a new admin by their email address. They must sign in
                  with Internet Identity from the same principal.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Label htmlFor="add-email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="add-email"
                  placeholder="admin@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="admin-input"
                  data-ocid="admins.input"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  className="admin-btn-outline"
                  data-ocid="admins.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={addAdminMutation.isPending}
                  className="admin-btn-primary"
                  data-ocid="admins.submit_button"
                >
                  {addAdminMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add Admin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="admin-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((n) => (
                <Skeleton key={n} className="h-12 w-full" />
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground text-sm"
              data-ocid="admins.empty_state"
            >
              No admins found.
            </div>
          ) : (
            <Table data-ocid="admins.table">
              <TableHeader>
                <TableRow className="admin-table-header">
                  <TableHead className="text-muted-foreground">
                    Principal
                  </TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a, i) => {
                  const isMe = a.principal.toString() === myPrincipal;
                  return (
                    <TableRow
                      key={a.principal.toString()}
                      className="admin-table-row"
                      data-ocid={`admins.row.${i + 1}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background: "oklch(0.56 0.22 264 / 20%)",
                            }}
                          >
                            <Shield
                              className="w-3.5 h-3.5"
                              style={{ color: "oklch(0.56 0.22 264)" }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground max-w-[160px] truncate">
                            {a.principal.toString()}
                          </span>
                          {isMe && (
                            <Badge
                              className="text-xs"
                              style={{
                                background: "oklch(0.78 0.13 200 / 20%)",
                                color: "oklch(0.78 0.13 200)",
                                border: "1px solid oklch(0.78 0.13 200 / 30%)",
                              }}
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {a.email || "\u2014"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {isMe && (
                          <Dialog
                            open={removeOpen}
                            onOpenChange={setRemoveOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                data-ocid="admins.delete_button"
                              >
                                Remove Self
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className="admin-dialog"
                              data-ocid="admins.dialog"
                            >
                              <DialogHeader>
                                <DialogTitle className="font-display">
                                  Remove Admin Access
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Are you sure you want to remove your own admin
                                  access? This cannot be undone unless another
                                  admin re-adds you.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setRemoveOpen(false)}
                                  className="admin-btn-outline"
                                  data-ocid="admins.cancel_button"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleRemoveSelf}
                                  disabled={removeAdminMutation.isPending}
                                  className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                                  data-ocid="admins.confirm_button"
                                >
                                  {removeAdminMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Confirm Remove
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sidebar Layout ───────────────────────────────────────────────────────────
const NAV_ITEMS: { id: AdminPage; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "services", label: "Services", icon: Wrench },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "submissions", label: "Submissions", icon: Inbox },
  { id: "admins", label: "Admins", icon: Users },
];

export default function AdminPanel() {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const { clear, identity } = useInternetIdentity();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? "";

  return (
    <LoginGate>
      <Toaster />
      <div className="min-h-screen flex admin-bg">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col admin-sidebar transform transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-auto`}
          data-ocid="admin.panel"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 h-16 px-6 shrink-0 border-b admin-sidebar-border">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.56 0.22 264), oklch(0.52 0.24 295))",
              }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-base font-bold text-foreground">
              Luxe <span className="gradient-text">Parfum</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "admin-nav-active"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                  data-ocid={`admin.${item.id}.tab`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User area */}
          <div className="px-3 pb-4 space-y-2 border-t admin-sidebar-border pt-4">
            <div className="px-3 py-2 rounded-lg admin-row">
              <p className="text-xs text-muted-foreground mb-0.5">
                Signed in as
              </p>
              <p className="text-xs font-mono text-foreground truncate">
                {principal.slice(0, 20)}\u2026
              </p>
            </div>
            <button
              type="button"
              onClick={() => clear()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <a
              href="/"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              data-ocid="admin.link"
            >
              <Zap className="w-4 h-4" />
              View Public Site
            </a>
          </div>
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header
            className="h-16 flex items-center justify-between px-6 shrink-0 admin-topbar"
            data-ocid="admin.section"
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
                aria-label="Open menu"
                data-ocid="admin.toggle"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="font-display font-semibold text-foreground capitalize">
                {page}
              </h1>
            </div>
            <Badge
              className="hidden sm:flex items-center gap-1.5 px-3"
              style={{
                background: "oklch(0.78 0.13 200 / 15%)",
                color: "oklch(0.78 0.13 200)",
                border: "1px solid oklch(0.78 0.13 200 / 30%)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.78 0.13 200)" }}
              />
              Live
            </Badge>
          </header>

          <Separator className="opacity-10" />

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {page === "dashboard" && <Dashboard setPage={setPage} />}
                {page === "services" && <ServicesPage />}
                {page === "testimonials" && <TestimonialsPage />}
                {page === "submissions" && <Submissions />}
                {page === "admins" && <AdminsPage />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 text-center text-xs text-muted-foreground border-t admin-sidebar-border">
            \u00a9 {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </footer>
        </div>
      </div>
    </LoginGate>
  );
}
