export function Card({ children, className, ...props }) {
  return (
    <div className={`p-4 border rounded-lg shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

