function PageWrapper({ children }) {
  return (
    <div className="page">
      <div className="card">
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
