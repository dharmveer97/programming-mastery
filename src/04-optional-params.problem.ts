import { expect, it } from "vitest";

export const getName = (first: string, last?: string) => {
  if (last) {
    return `${first} ${last}`;
  }
  return first;
};

it("Should work with just the first name", () => {
  const name = getName("John");

  expect(name).toEqual("John");
});

it("Should work with the first and last name", () => {
  const name = getName("John", "Doe");

  expect(name).toEqual("John Doe");
});
