import AppNavigator from './Components/Navigation/AppNavigator'
import { DesignProvider } from './Context/DesignContext';

export default function App() {
  return (
    <DesignProvider>
      <AppNavigator />
    </DesignProvider>
  );
}