import { expect } from "@playwright/test";
import { Todo } from "./types";

export class Assertion {
  constructor() {}

  public areEqual(left: Todo, right: Todo): void;
  public areEqual(left: number, right: number): void;
  public areEqual(left: boolean, right: boolean): void;
  public areEqual(left: string, right: string): void;
  public areEqual(left: any, right: any): void {
    expect(left).toEqual(right);
  }
}
