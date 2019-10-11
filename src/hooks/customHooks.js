import { useState, useEffect, useRef } from 'react';

export const useResize = (windowInnerWidth) => {
  const [innerWidth, setWidth] = useState(windowInnerWidth);

  useEffect(
    () => {
      window.addEventListener("resize", () => setWidth(window.innerWidth));
      return () => {
        window.removeEventListener("resize", () => setWidth(window.innerWidth));
      };
    },
    []
  );

  return [innerWidth, setWidth]
}

export const usePrevious = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}


