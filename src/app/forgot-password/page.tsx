import BackButton from "@/components/BackButton";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-neutral-100 relative">
            <BackButton />
            <ForgotPasswordForm />
        </div>
    );
}
