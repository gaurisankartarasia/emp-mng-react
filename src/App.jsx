

import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position='top-center' closeButton richColors/>
    </>
  );
}

export default App;