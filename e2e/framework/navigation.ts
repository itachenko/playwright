import { Page } from "@playwright/test";
import { urls } from "./constants";

export class Navigation {
  constructor(private _page: Page) {}

  public async mainPage(): Promise<void> {
    await this._page.goto(urls.mainPage);
  }
}
