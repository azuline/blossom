// This file contains the global shared imports that are automatically added to test
// files by Vitest.

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// Learn more: https://github.com/testing-library/jest-dom
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

// Resets all renders after each test.
afterEach(() => cleanup());
