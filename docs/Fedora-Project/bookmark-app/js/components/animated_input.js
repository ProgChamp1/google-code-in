import { Component, h } from "../@ui/ui-lib.modern.js";

export class AnimatedInput extends Component {
  constructor(props) {
    super(props);
    this.state = { isFocused: false, value: "" };
    this.onFocus = () =>
      !this.state.value && this.setState({ isFocused: true, moveDown: false });
    this.onBlur = () =>
      !this.state.value && this.setState({ isFocused: false, moveDown: true });
    this.onInput = e => this.setState({ value: e.target.value });
    this.onSubmit = () => {
      this.props.onSubmit(this.state.value);
    };
  }
  render(
    { id, buttonText, labelText, onInput, hasError },
    { isFocused, moveDown }
  ) {
    const cls = [
      "_animate",
      isFocused ? "moveup" : "",
      moveDown ? "movedown" : ""
    ];
    return h(
      "div",
      { class: "search-component" },

      h(
        "form",
        { action: "javascript:", onSubmit: this.onSubmit },
        h(
          "label",
          { class: cls, for: id, style: hasError ? { color: "red" } : null },
          hasError ? "Invalid URL" : labelText
        ),
        h(InputComponent, {
          value: this.state.value,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          id,
          onInput: e => {
            this.onInput(e);
            onInput != null ? onInput(e) : void 0;
          }
        }),
        h("button", { class: "search-button" }, buttonText)
      )
    );
  }
}

function InputComponent({ onFocus, onBlur, onInput, id, value }) {
  return h("input", {
    value,
    onFocus,
    onBlur,
    onInput,
    id,
    class: "paper-input"
  });
}
