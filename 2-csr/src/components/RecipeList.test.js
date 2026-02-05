import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecipeList from "./RecipeList";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    token: null,
    user: null,
  }),
}));

describe("RecipeList (CSR)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("affiche et filtre les recettes côté client à partir du searchTerm", async () => {
    // 1er fetch : recettes
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => [
        { id: 1, name: "Chocolate cake" },
        { id: 2, name: "Salade" },
      ],
    });

    // Si ton composant fait un 2e fetch (ex: favoris), décommente :
    // global.fetch.mockResolvedValueOnce({
    //   ok: true,
    //   headers: { get: () => "application/json" },
    //   json: async () => [],
    // });

    render(
      <MemoryRouter>
        <RecipeList searchTerm="cake" />
      </MemoryRouter>
    );

    expect(await screen.findByText("Toutes nos recettes")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("1 recette(s) trouvée(s)")).toBeInTheDocument();
    });

    expect(screen.getByText(/Chocolate cake/i)).toBeInTheDocument();
    expect(screen.queryByText(/Salade/i)).not.toBeInTheDocument();
  });
});
