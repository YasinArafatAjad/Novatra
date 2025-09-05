import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SEOHelmet } from "./components/SEOHelmet";
import Router from "./Router/Router";

function App() {

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <SEOHelmet />
          <Router />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
