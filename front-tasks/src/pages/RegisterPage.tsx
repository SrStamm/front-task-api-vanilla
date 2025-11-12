import RegisterForm from "../features/auth/RegisterForm";
import AuthLayout from "../layouts/AuthLayout";

function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
