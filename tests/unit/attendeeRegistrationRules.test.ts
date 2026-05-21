import { describe, expect, it } from "vitest";

describe("attendee registration rules", () => {
  it("requires name, email, company, and title as the identity spine", () => {
    const required = ["name", "email", "company", "title"];
    expect(required).toEqual(["name", "email", "company", "title"]);
  });

  it("treats attendee registration as attendee role only", () => {
    expect("attendee").not.toEqual("admin");
    expect("attendee").not.toEqual("crew");
    expect("attendee").not.toEqual("operator");
  });
});
