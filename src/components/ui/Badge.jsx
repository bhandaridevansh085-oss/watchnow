function Badge({ children }) {
    return (
      <span
        className="
        inline-flex
        items-center
        rounded-full
        bg-blue-600/15
        border
        border-blue-500/30
        px-4
        py-2
        text-sm
        text-blue-300
        "
      >
        {children}
      </span>
    );
  }
  
  export default Badge;