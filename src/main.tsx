import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/darkly/bootstrap.css";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "./hooks/useAuth.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Navbar />
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </BrowserRouter>
);
