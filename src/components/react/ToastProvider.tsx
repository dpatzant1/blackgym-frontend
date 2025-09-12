import React from 'react';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #2d2d2d',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              border: '1px solid #00ff41',
            },
            iconTheme: {
              primary: '#00ff41',
              secondary: '#000000',
            },
          },
          error: {
            style: {
              border: '1px solid #dc2626',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              border: '1px solid #6b7280',
            },
            iconTheme: {
              primary: '#6b7280',
              secondary: '#ffffff',
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default ToastProvider;
