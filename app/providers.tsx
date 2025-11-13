"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "0.9rem",
            fontFamily: "Inter, sans-serif",
            borderRadius: "8px",
          },
        }}
      />
      {children}
    </Provider>
  );
}
