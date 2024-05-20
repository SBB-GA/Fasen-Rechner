import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Label,
  Transition,
} from "@headlessui/react";

import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

export default function Select({ options, label, name }) {
  const [selected, setSelected] = useState(options[0]);

  function setSelectedWithEvent (e) {
    setSelected(e)
    let element = document.getElementsByName("tool_type[name]")[0];
    element.dispatchEvent(new Event(`${name}_change`));
  }

  // Parent Container: with w-auto the checkbox adapts it's size to the content, else its remains fixed at the specified size

  return (
    <div className="w-full" id={`${name}`}>
      <Listbox value={selected} onChange={setSelectedWithEvent} name={name}>
        <Label className="text-black font-extralight mb-4">{label}:</Label>
        <div className="relative">
          <ListboxButton className="relative bg-white border-2 border-black w-full cursor-pointer py-2 pl-3 pr-10 text-left shadow-md focus:outline-none">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-black"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in-out duration-0"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              //anchor="bottom"
              className="bg-white border-2 border-black absolute mt-1 max-h-60 w-full overflow-auto my-1 text-base shadow-lg focus:outline-none z-10"
            >
              {options.map((option, optionIdx) => (
                <ListboxOption
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${active ? "bg-black text-white" : "text-black"}`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-bold" : "font-normal"
                          }`}
                      >
                        {option.name}
                      </span>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
