function Button({
    children,
    type = "button",
    onClick,
    variant = "primary",
    className = "",
    disabled = false,
  }) {
  
    const variants = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30",
  
      secondary:
        "bg-zinc-900 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 text-white",
  
      danger:
        "bg-red-600 hover:bg-red-700 text-white",
    };
  
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`
        inline-flex
        items-center
        justify-center
        gap-2
        h-12
        px-6
        rounded-2xl
        font-semibold
        whitespace-nowrap
        transition-all
        duration-300
        hover:scale-105
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
        `}
      >
        {children}
      </button>
    );
  }
  
  export default Button;