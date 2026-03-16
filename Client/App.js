import AppNavigator from './Components/Navigation/AppNavigator'
import { DesignProvider } from './Context/DesignContext';
import { AuthProvider } from './Context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <DesignProvider>
        <AppNavigator />
      </DesignProvider>
    </AuthProvider>
  );
}