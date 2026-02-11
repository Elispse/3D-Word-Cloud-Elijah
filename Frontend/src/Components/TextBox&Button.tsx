import React, { useRef } from "react";
import { fetchWordCloud } from "../App"; // Function to fetch word cloud data from backend
import type { WordType } from "../App";  // Type for each word and its weight

// Define the props for this component
// setWords allows this component to update the words in the parent App component
type TextBoxButtonProps = {
  setWords: React.Dispatch<React.SetStateAction<WordType[]>>;
};

// Functional component for the text input and submit button
const TextBoxButton: React.FC<TextBoxButtonProps> = ({ setWords }) => {
  // Reference to the input element so we can read its value
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle the button click
  // - Reads the value from the input
  // - Calls fetchWordCloud to get the word cloud data from backend
  // - Updates the parent's state with setWords
  const handleButtonClick = async () => {
    if (inputRef.current) {
      const value = inputRef.current.value; // Get user input
      const data = await fetchWordCloud(value); // Fetch words from backend
      setWords(data); // Update parent state to render word cloud
    }
  };

  return (
    <div className="top-center-container">
      {/* Text input for URL */}
      <input type="text" ref={inputRef} placeholder="Type URL..." />
      {/* Button to trigger fetch */}
      <button onClick={handleButtonClick}>Submit</button>
    </div>
  );
};

export default TextBoxButton;
