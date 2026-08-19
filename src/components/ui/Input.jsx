function Input({
    value,
    onChange,
    placeholder,
    type = "text",
    className = "",
  }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          h-12
          px-5
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          text-white
          placeholder:text-zinc-500
          focus:border-blue-500
          focus:outline-none
          transition
          ${className}
        `}
      />
    );
  }
  
  export default Input;