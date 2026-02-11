import React, { useRef } from "react";
import { fetchWordCloud } from "../App"; // import your function

const TextBoxButton: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      const value = inputRef.current.value;
      fetchWordCloud(value); // call function from another file
    }
    console.log("Button Pressed!")
  };

  return (
    <div>
      <input type="text" ref={inputRef} placeholder="Type something..." />
      <button onClick={handleButtonClick}>Submit</button>
    </div>
  );
};

export default TextBoxButton;
