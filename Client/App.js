import AppNavigator from './Components/Navigation/AppNavigator'
import { DesignProvider } from './Context/DesignContext';
import { AuthProvider } from './Context/AuthContext';
import { EdgeAIProvider } from './Context/EdgeAIContext';

export default function App() {
  return (
    <AuthProvider>
      <DesignProvider>
        <EdgeAIProvider>
          <AppNavigator />
        </EdgeAIProvider>
      </DesignProvider>
    </AuthProvider>
  );
}