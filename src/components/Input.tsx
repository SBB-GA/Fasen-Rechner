import React, { useEffect } from 'react';

interface Props {
  label: string;
  identifier: string;
  disabled?: boolean;
}

const NumberInput: React.FC<Props> = ({ label, identifier, disabled = false }) => {

  useEffect(() => {
    function formatNumber() {
      const numberInput = document.getElementById(identifier) as HTMLInputElement;
      // dispatch event to signal that a field changed (used to detect number input changes)
      window.dispatchEvent(new Event('number_input_changed'))
      console.log('number_input_changed dispatched from input.tsx')

      const valueIn = numberInput.value;

      if (valueIn === "") {
        return;
      }

      const valueInArray = valueIn.split(".");
      if (valueInArray.length > 2) {
        alert("invalid input");
        numberInput.value = "";
        return;
      }

      if (valueInArray.length === 1 || valueInArray[1] === "" || parseFloat(valueInArray[1]) === 0) {
        numberInput.value = `${valueInArray[0]}.0`;
        return;
      }

      numberInput.value = `${parseFloat(parseFloat(valueIn).toFixed(3))}`;
    }

    const inputElement = document.getElementById(identifier);
    inputElement.addEventListener("blur", formatNumber);
    inputElement.addEventListener("format_number_input", formatNumber);

    return () => {
      inputElement.removeEventListener("blur", formatNumber);
      inputElement.removeEventListener("format_number_input", formatNumber);
    };
  }, [identifier]);

  return (
    <div data-identifier={identifier} className="w-full">
      <div>
        <p className="text-black font-extralight">{label}:</p>
        <input
          type="text"
          name={identifier}
          id={identifier}
          disabled={disabled}
          className={`w-full border-2 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none ${disabled ? "bg-gray-200 border-gray-600 text-gray-700" : "border-black text-black"}`}
        />
      </div>
    </div>
  );
}

export default NumberInput;

