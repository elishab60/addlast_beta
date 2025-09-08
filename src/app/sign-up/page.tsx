import BackButton from "@/components/BackButton";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-neutral-100 relative">
            <BackButton />
            <SignUpForm />
        </div>
    );
}
