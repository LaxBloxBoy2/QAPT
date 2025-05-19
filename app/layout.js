export const metadata = {
  title: 'QAPT - Property Management System',
  description: 'A modern property management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </body>
    </html>
  );
}
