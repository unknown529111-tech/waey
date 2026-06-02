import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/useAuth";
import { sanitizeString, sanitizeEmail, sanitizePassword } from "@/lib/sanitize";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const sName = sanitizeString(name, 100);
    const sEmail = sanitizeEmail(email);
    const sPassword = sanitizePassword(password);

    const err = await (mode === "signin"
      ? signIn(sEmail, sPassword)
      : signUp(sName, sEmail, sPassword));

    if (err) {
      setError(err);
      setLoading(false);
    } else {
      handleClose();
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="auth-name">الاسم</Label>
                <Input
                  id="auth-name"
                  type="text"
                  placeholder="محمد أحمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  dir="rtl"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="auth-email">البريد الإلكتروني</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">كلمة المرور</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              className="text-left"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>ليس لديك حساب؟ <button onClick={switchMode} className="text-primary font-bold hover:underline">إنشاء حساب</button></>
          ) : (
            <>لديك حساب بالفعل؟ <button onClick={switchMode} className="text-primary font-bold hover:underline">تسجيل الدخول</button></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
