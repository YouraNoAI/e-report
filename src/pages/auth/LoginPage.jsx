import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase/config";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { School, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
  rememberMe: z.boolean().optional(),
});

const FIREBASE_ERROR_MAP = {
  "auth/invalid-credential": "Email atau password salah",
  "auth/user-not-found": "Email tidak terdaftar",
  "auth/wrong-password": "Password salah",
  "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti",
  "auth/user-disabled": "Akun telah dinonaktifkan",
  "auth/invalid-email": "Format email tidak valid",
  "auth/network-request-failed": "Koneksi jaringan bermasalah",
};

function getErrorMessage(error) {
  return FIREBASE_ERROR_MAP[error?.code] || "Terjadi kesalahan. Silakan coba lagi";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background dark:bg-dark-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  async function onSubmit(data) {
    setSubmitError("");
    try {
      await setPersistence(
        auth,
        data.rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 dark:bg-dark-bg">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center space-y-2 pb-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <School className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">E-Report SMK Texmaco</CardTitle>
          <CardDescription>Sistem Pelaporan Siswa Terintegrasi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                {...register("rememberMe")}
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal">
                Ingat saya
              </Label>
            </div>

            {submitError && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
                {submitError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
