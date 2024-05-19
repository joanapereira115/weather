import "./Input.css";

export default function Input(props) {
  return (
    <div className="input-group">
      <label htmlFor={props.id} className="input-label">
        {props.label}
      </label>
      <input
        type={props.type}
        id={props.id}
        placeholder=" "
        value={props.value}
        onChange={(e) => props.onChangeHandler(e.target.value)}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        max={props.max}
        min={props.min}
        required
      />
      {props.children}
    </div>
  );
}
