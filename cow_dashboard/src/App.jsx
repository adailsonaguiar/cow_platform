import { useState, useEffect } from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { Toaster } from '@/components/ui/Toast';

function App() {
  return (
    <>
      <Dashboard />
      <Toaster />
    </>
  );
}

export default App;
