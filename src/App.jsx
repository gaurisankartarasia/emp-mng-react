

import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster  position='top-center' toastOptions={{
    style: {
      background: 'var(--popover)',
      boxShadow:"none",
      borderRadius:'var(--radius)'
    }
  }}
  
   expand visibleToasts={3}
   
  />
    </>
  );
}

export default App;