import LoginForm from "../features/auth/LoginForm";
import AuthLayout from "../layouts/AuthLayout";

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
