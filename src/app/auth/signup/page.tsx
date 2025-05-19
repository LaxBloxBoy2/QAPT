import { AuthForm } from '@/components/auth/auth-form'

export default function SignupPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold text-center mb-6">Create a QAPT Account</h1>
      <AuthForm />
    </div>
  )
}
