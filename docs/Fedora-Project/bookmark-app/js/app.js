import { h, render, Router, absolutePath } from "./@ui/ui-lib.modern.js";
import { OnBoarding } from "./components/onboarding.js";
import { BookMarksApp } from "./components/bookmarksapp.js";
const path = window.pathname;
const App = h(
  Router,
  null,
  h(OnBoarding, { path: absolutePath(path) }),
  h(BookMarksApp, { path: absolutePath(path + "app") })
);

render(App, document.querySelector("main"));
