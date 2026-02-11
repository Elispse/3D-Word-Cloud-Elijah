import React, { useRef } from "react";
import { fetchWordCloud } from "../App";
import type { WordType } from "../App"

type TextBoxButtonProps = 
{
  setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
}

const TextBoxButton: React.FC<TextBoxButtonProps> = ({ setWords }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = async () => {
    if (inputRef.current) {
      const value = inputRef.current.value;
      const data = await fetchWordCloud(value);
      setWords(data);
    }
  };

  return (
    <div className="top-center-container">
      <input type="text" ref={inputRef} placeholder="Type URL..." />
      <button onClick={handleButtonClick}>Submit</button>
    </div>
  );
};

export default TextBoxButton;
