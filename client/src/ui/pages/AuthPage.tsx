import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CartMark } from "../components/Logo";
import { Spinner } from "../components/Icons";

interface FormErrors {
  email?: string;
  pass?: string;
  pass2?: string;
}

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const { login, signup, status, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = async () => {
    const nextErrors: FormErrors = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "That doesn't look like a valid email.";
    if (!pass) nextErrors.pass = "Enter a password.";
    else if (pass.length < 8) nextErrors.pass = "Use at least 8 characters.";
    if (isSignup) {
      if (!pass2) nextErrors.pass2 = "Confirm your password.";
      else if (pass2 !== pass) nextErrors.pass2 = "Passwords don't match.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const action = isSignup
      ? await signup({ name: name.trim() || email.split("@")[0], email, password: pass })
      : await login({ email, password: pass });

    if (action.meta.requestStatus === "fulfilled") {
      navigate("/products", { replace: true });
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="grain" aria-hidden="true" />
        <div className="brand-mark">
          <div className="brand-logo">
            <CartMark />
          </div>
          <div className="brand-name">HypeCart</div>
        </div>
        <div className="auth-headline">
          <h1>A quieter place to run your shop.</h1>
          <p>
            Add pieces, adjust prices, retire what has sold. Everything in one
            catalogue you actually enjoy opening.
          </p>
        </div>
        <div className="mono" style={{ fontSize: 11.5, letterSpacing: "0.06em", color: "#8ea192" }}>
          SELLER CONSOLE · v2.4
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form">
          <div className="auth-kicker mono">{isSignup ? "Create account" : "Welcome back"}</div>
          <div className="auth-title">{isSignup ? "Set up your studio" : "Sign in to your studio"}</div>
          <div className="auth-sub">
            {isSignup
              ? "Your catalogue, orders and pricing in one place."
              : "Pick up where you left off."}
          </div>

          <div className="auth-fields">
            {isSignup && (
              <label className="field">
                <span className="field-label">Name</span>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your studio name"
                />
              </label>
            )}

            <label className="field">
              <span className="field-label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                placeholder="you@studio.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="input"
                type="password"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  setErrors({});
                }}
                placeholder="At least 8 characters"
              />
              {errors.pass && <span className="field-error">{errors.pass}</span>}
            </label>

            {isSignup && (
              <label className="field">
                <span className="field-label">Confirm password</span>
                <input
                  className="input"
                  type="password"
                  value={pass2}
                  onChange={(e) => {
                    setPass2(e.target.value);
                    setErrors({});
                  }}
                  placeholder="Repeat your password"
                />
                {errors.pass2 && <span className="field-error">{errors.pass2}</span>}
              </label>
            )}
          </div>

          {!isSignup && (
            <div className="auth-forgot">
              <span style={{ cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
                Forgot password
              </span>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary auth-cta"
            onClick={submit}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="btn-loading">
                <Spinner />
                Please wait
              </span>
            ) : isSignup ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </button>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-swap">
            {isSignup ? "Already selling with us? " : "New to HypeCart? "}
            <button
              type="button"
              className="auth-swap-link"
              onClick={() => navigate(isSignup ? "/login" : "/signup")}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
