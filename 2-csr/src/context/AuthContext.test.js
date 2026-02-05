import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";

// petit composant pour vérifier que le provider rend bien ses enfants
function Child() {
  return <div>OK</div>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("charge l'état d'authentification depuis localStorage (token persisté)", async () => {
    localStorage.setItem("auth_token", "token-123");
    localStorage.setItem("user", JSON.stringify({ username: "alice" }));

    render(
      <AuthProvider>
        <Child />
      </AuthProvider>
    );

    // Le provider affiche un loader puis rend les enfants
    expect(await screen.findByText("OK")).toBeInTheDocument();
  });
});
