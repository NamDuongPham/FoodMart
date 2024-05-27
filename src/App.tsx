import { BrowserRouter } from "react-router-dom";
import { Router } from "./routers/Router";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "@/stores";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
