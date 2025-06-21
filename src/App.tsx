import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AppRoutes } from "@/routes";
import ErrorBoundary from "@/components/error-boundary";
import { Toaster } from "./components/ui/toaster";
import { useTranslation } from "react-i18next";

function App() {
  
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("appLang");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
