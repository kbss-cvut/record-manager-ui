import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Loader, { LoaderMask, ContainerLoaderMask, LoaderCard, LoaderSmall } from "../../../src/components/Loader.jsx"; // Adjust path as needed

describe("Loader Components", () => {
  it("renders loader", () => {
    const { container } = render(<Loader />);
    const loaderSpin = container.querySelector(".loader-spin");
    expect(loaderSpin).not.toBeNull();
    expect(container.querySelectorAll(".circle")).toHaveLength(4);
  });

  it("renders loader with card", () => {
    const headerText = "Loading Data...";
    const { getByText, container } = render(<LoaderCard header={headerText} />);
    expect(getByText(headerText)).toBeInTheDocument();
    const cardBody = container.querySelector(".card-body");
    expect(cardBody).not.toBeNull();
    const loaderSpin = cardBody.querySelector(".loader-spin");
    expect(loaderSpin).not.toBeNull();
  });

  it("renders loader as mask", () => {
    const { container } = render(<LoaderMask />);
    const mask = container.querySelector(".mask");
    expect(mask).not.toBeNull();
    const spinnerContainer = container.querySelector(".spinner-container");
    expect(spinnerContainer).not.toBeNull();
    const loaderSpin = spinnerContainer.querySelector(".loader-spin");
    expect(loaderSpin).not.toBeNull();
  });

  it("renders container loader mask", () => {
    const { container } = render(<ContainerLoaderMask />);
    const maskContainer = container.querySelector(".mask-container");
    expect(maskContainer).not.toBeNull();
    const spinnerContainer = container.querySelector(".spinner-container");
    expect(spinnerContainer).not.toBeNull();
    const loaderSpin = spinnerContainer.querySelector(".loader-spin");
    expect(loaderSpin).not.toBeNull();
  });

  it("renders small loader", () => {
    const { container } = render(<LoaderSmall />);
    const loaderSmall = container.querySelector(".loader");
    expect(loaderSmall).not.toBeNull();
    expect(loaderSmall).toHaveClass("align-self-center");
  });
});
