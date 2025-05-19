import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold text-center mb-6">Login to QAPT</h1>
      <AuthForm />
    </div>
  )
}
