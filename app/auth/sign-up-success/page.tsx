import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LinkIcon, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">LinkHub</span>
          </div>
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>We sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to confirm your account and start creating your link page.
              </p>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
