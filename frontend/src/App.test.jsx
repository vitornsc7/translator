import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import * as klingonService from "./services/API/klingonservice";


describe("App.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o título e os elementos principais", () => {
    render(<App />);

    expect(screen.getByText("Fun Translation")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("> Type your text in english.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "[ Translate ]" })).toBeInTheDocument();
    expect(screen.getByText("> Waiting input...")).toBeInTheDocument();
  });

  it("deve mostrar aviso ao clicar em traduzir sem texto", async () => {
    render(<App />);
    const button = screen.getByRole("button", { name: "[ Translate ]" });

    fireEvent.click(button);

    expect(await screen.findByText("> Digite um texto para traduzir.")).toBeInTheDocument();
  });

  it("deve traduzir texto com sucesso (mock do service)", async () => {
    vi.spyOn(klingonService, "translate").mockResolvedValueOnce({
      translated: "Qapla'!",
    });

    render(<App />);
    const textarea = screen.getByPlaceholderText("> Type your text in english.");
    const button = screen.getByRole("button", { name: "[ Translate ]" });

    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(button);

    // Enquanto traduz
    expect(await screen.findByText("[ Traduzindo... ]")).toBeInTheDocument();

    // Resultado
    expect(await screen.findByText("> Qapla'!")).toBeInTheDocument();
  });

  it("deve mostrar erro retornado do backend", async () => {
    vi.spyOn(klingonService, "translate").mockResolvedValueOnce({
      error: "Backend fora do ar",
    });

    render(<App />);
    const textarea = screen.getByPlaceholderText("> Type your text in english.");
    const button = screen.getByRole("button", { name: "[ Translate ]" });

    fireEvent.change(textarea, { target: { value: "Hi" } });
    fireEvent.click(button);

    expect(await screen.findByText(/⚠️ Backend fora do ar/)).toBeInTheDocument();
  });

  it("deve mostrar erro genérico em caso de exceção", async () => {
    vi.spyOn(klingonService, "translate").mockRejectedValueOnce(new Error("Falha inesperada"));

    render(<App />);
    const textarea = screen.getByPlaceholderText("> Type your text in english.");
    const button = screen.getByRole("button", { name: "[ Translate ]" });

    fireEvent.change(textarea, { target: { value: "Oops" } });
    fireEvent.click(button);

    expect(await screen.findByText("> ❌ Erro ao traduzir.")).toBeInTheDocument();
  });
});
