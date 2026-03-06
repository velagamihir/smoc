import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInPage } from "@/components/ui/sign-in";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate("/app");
    }
  };

  return <SignInPage onSignIn={handleSignIn} error={error} loading={loading} />;
}
