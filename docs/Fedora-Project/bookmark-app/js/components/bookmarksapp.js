import { Component, h, Fragment } from "../@ui/ui-lib.modern.js";
import { AnimatedInput } from "./animated_input.js";
import { getJson, setJson } from "../storage-manager.js";
import { getSrc } from "../util.js";
const BOOKMARKS = "bookmarks";
const NO_SRC = getSrc("NO_SRC");
const SAFE_PROTO_IMG = getSrc("SAFE_PROTO_IMG");
const UNSAFE_IMG = getSrc("UNSAFE_IMG");

export class BookMarksApp extends Component {
  constructor() {
    super();
    this.state = { bookmarksArray: getJson(BOOKMARKS, []) };
    this.addBookMark = this.addBookMark.bind(this);
    this.removeBookMark = this.removeBookMark.bind(this);
  }
  _updateBM(bm) {
    setJson(BOOKMARKS, bm);
    return { bookmarksArray: bm };
  }
  addBookMark(url) {
    this.setState(ps => {
      /**
       * @type {Array<string>}
       */
      const bm = ps.bookmarksArray;
      if (!bm.includes(url)) {
        bm.unshift(url);
        return this._updateBM(bm);
      }
    });
  }
  removeBookMark(index) {
    this.setState(ps => {
      const bm = ps.bookmarksArray;
      bm.splice(index, 1);
      return this._updateBM(bm);
    });
  }
  render(props, state) {
    return h(
      "div",
      { class: "box-bookmarks" },
      h("div", { class: "ybm" }, "Your Bookmarks"),
      h("div", { class: "sort-options" }),
      h(AddBookMarkComponent, { update: this.addBookMark }),
      h(
        "div",
        { class: "bookmark-arr" },
        state.bookmarksArray.map((url, index) =>
          h(BookMarkLink, { url, index, deleteBM: this.removeBookMark })
        )
      )
    );
  }
}

class AddBookMarkComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", hasError: false };
    this.handleInput = e => this.setState({ value: e.target.value });
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    let url = this.state.value;
    try {
      url = getURL(url);
    } catch (e) {
      return this.setState({ hasError: true });
    }

    this.setState({ hasError: false });
    this.props.update(url);
  }
  render(props, state) {
    return h(AnimatedInput, {
      onInput: this.handleInput,
      onSubmit: this.handleSubmit,
      hasError: state.hasError,
      buttonText: "Add",
      labelText: "Add BookMark",
      id: "bookmark-add"
    });
  }
}

function BookMarkLink(props) {
  const url = props.url;
  const index = props.index;
  const deleteBM = props.deleteBM;
  return h(
    "div",
    { class: "bookmarked-element" },
    h("img", {
      alt: "favicon for:" + url,
      src: faviconLink(url),
      style: { width: "20px", height: "20px" },
      onError: e => (e.target.src = NO_SRC)
    }),
    h("a", { class: "unstyled-link", href: url }, h(FormatURL, { url })),
    h("button", { class: "close-button", onClick: () => deleteBM(index) }, "X")
  );
}

function FormatURL(props) {
  const url = props.url;
  const u = new URL(url);
  const domain = u.hostname;
  const proto = h("img", {
    alt: u.protocol,
    style: { height: "20px", width: "20px" },
    src: u.protocol === "https:" ? SAFE_PROTO_IMG : UNSAFE_IMG
  });
  const rest = u.pathname + u.search;
  return h(
    Fragment,
    null,
    proto,
    h("span", { class: "bold" }, domain),
    h("span", { class: "light" }, rest)
  );
}

const faviconLink = url => "https://" + new URL(url).hostname + "/favicon.ico";

function getURL(url) {
  try {
    return new URL(url).toString();
  } catch (e) {
    return new URL("http://" + url).toString();
  }
}
