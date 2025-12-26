// Reusable Button Component
const ButtonHero = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default" | "outline"; className?: string }) => {
    const base = "px-6 py-4 rounded-xl flex items-center gap-2.5 transition";
    const variants = {
        default: "bg-violet-600 hover:bg-violet-700 text-white",
        outline: "bg-transparent border border-neutral-800 hover:bg-neutral-800 text-neutral-400"
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

export default ButtonHero;