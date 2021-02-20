import { Component, loadURL, h } from "../@ui/ui-lib.modern.js";
import { getJson, setJson } from "../storage-manager.js";
import { WelcomeImages } from "./img.js";
const ONBOARDING = "$$onboarding";
export class OnBoarding extends Component {
  constructor() {
    super();
    this.state = { seenOnBoarding: getJson(ONBOARDING) };
    this._update = this._update.bind(this);
  }
  _update() {
    const obj = { ts: +new Date() };
    setJson(ONBOARDING, obj);
    loadURL(window.pathname + "app");
  }
  render() {
    return h(WelcomeImages, { update: this._update });
  }
  componentDidMount() {
    if (this.state.seenOnBoarding.ts) {
      return loadURL(window.pathname + "app");
    }
  }
}
