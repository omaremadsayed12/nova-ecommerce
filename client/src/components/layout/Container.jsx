function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-360 px-6 md:px-20 ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Container;