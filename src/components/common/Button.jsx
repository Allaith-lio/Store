const Button = ({children, className, onClick, disabled, ariaLabel, type}, ref) => {
  
  return (
    <button
    ref={ref} 
    type = {type}
    className={className}
    onClick={onClick} 
    disabled={disabled}
    aria-label= {ariaLabel}>
      {children}
    </button>
  )
}
Button.displayName = "Button";
export default Button