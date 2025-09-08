import BackButton from "@/components/BackButton";
import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-neutral-100 relative">
            <BackButton />
            <SignInForm />
        </div>
    );
}
