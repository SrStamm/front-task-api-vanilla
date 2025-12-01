import RegisterForm from "../features/auth/RegisterForm";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
