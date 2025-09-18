import RoutesDef from './routes.jsx';
import { AuthProvider } from './utils/auth.jsx';
import { StoreProvider } from './utils/store.jsx';

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RoutesDef />
      </StoreProvider>
    </AuthProvider>
  );
}




