import "./AuthLayout.css";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <section className="form-container">{children}</section>
    </div>
  );
}

export default AuthLayout;
