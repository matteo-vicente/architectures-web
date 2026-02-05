import { getRecettes } from "./api";

describe("services/api (API REST)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("getRecettes() appelle GET /recipes sur le serveur de données", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => [{ id: 1, name: "Pâtes" }],
    });

    const data = await getRecettes();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://gourmet.cours.quimerch.com/recipes",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Accept: "application/json" }),
      })
    );

    expect(data).toEqual([{ id: 1, name: "Pâtes" }]);
  });
});
