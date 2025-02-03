import { useState, useEffect } from "react";

const useCSSVariable = (variableName) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const root = document.documentElement;

    const updateVariable = () => {
      const newValue = getComputedStyle(root).getPropertyValue(variableName).trim();
      setValue(newValue);
    };

 
    updateVariable();

    const observer = new MutationObserver(updateVariable);
    observer.observe(root, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, [variableName]);

  return value;
};

export default useCSSVariable 