import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full flex flex-col items-center p-2 md: pt-12">
      <form
        className="flex-1 flex flex-col w-full max-w-80 bg-background p-3 md:p-6 rounded-md
      border-2 border-muted-foreground"
      >
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm">
          Don't have an account?{" "}
          <Link className="font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 [&>input]:bg-white mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link className="text-sm underline" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <Input type="password" name="password" required />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
