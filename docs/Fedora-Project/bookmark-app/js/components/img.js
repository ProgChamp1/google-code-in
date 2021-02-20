import { nextEvent, getSrc } from "../util.js";
import { Component, h, Fragment } from "../@ui/ui-lib.modern.js";
const svg0 = new Image();
const svg1 = new Image();

const allLoaded = Promise.all([svg0, svg1].map(x => nextEvent(x, "load")));
let loaded = false;
const imgs = ["0-svg", "1-svg"].map(getSrc);
const imgLen = imgs.length;
svg0.src = imgs[0];
svg1.src = imgs[1];

export class WelcomeImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded,
      imgs,
      cImg: 0,
      texts: [
        "Create and Manage bookmarks",
        "Your Bookmarks are stored locally"
      ]
    };
    this._loadStateChange = this._loadStateChange.bind(this);
  }
  _loadStateChange() {
    loaded = true;
    this.setState({ loaded });
  }

  componentDidMount() {
    if (!this.state.loaded) return allLoaded.then(this._loadStateChange);
  }

  render(props, state) {
    const idx = state.cImg;
    const loaded = state.loaded;
    if (!loaded) return h("div", { class: "img-skeleton" });
    return h(
      "div",
      { class: "box-main" },
      h(
        "div",
        { class: "container", style: { marginBottom: "50px" } },
        Array.from({ length: imgLen }).map((_, i) =>
          h(
            "div",
            null,
            h(ImageAnimate, {
              src: state.imgs[i],
              text: state.texts[i]
            })
          )
        )
      ),
      h(
        "button",
        { class: "get-started", onClick: props.update },
        "Get Started"
      )
    );
  }
}

function ImageAnimate(props) {
  const src = props.src;
  const text = props.text;

  return h(
    Fragment,
    null,
    h("img", {
      alt: text,
      class: "animated-img",
      src
    }),
    h("div", { class: "intro-text" }, text)
  );
}
