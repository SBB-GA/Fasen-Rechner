import Select from "../components/Select";
import Input from "../components/Input";
import React, { useState } from "react";

import cutters from "../../public/cutters.json";

function VersatzrechnerContent() {
  const tools = [{ id: 1, name: "... Custom Tool" }];
  let count = 2;
  for (const [key, value] of Object.entries(cutters)) {
    tools.push({ id: count, name: key });
    count++;
  }

  const tool_types = [
    { id: 1, name: "Fasenfräser" },
    { id: 2, name: "Kombientgrater" },
    { id: 3, name: "Schwalbenschwanz" },
  ];
  const chamfer_types = [
    { id: 1, name: "Regulär" },
    { id: 2, name: "Rückwärts", disabled: true },
  ];
  const offset_types = [
    { id: 1, name: "Oberseite" },
    { id: 2, name: "Unterseite" },
  ];

  const [selectedToolType, setSelectedToolType] = useState(null);
  const [chamferOptions, setChamferOptions] = useState(chamfer_types); // Maybe rename to chamferTypes
  const [selectedChamferType, setSelectedChamferType] = useState()

  const handleToolTypeChange = (element) => {
    // element is the whole object as its entered in the tool_types list
    setSelectedToolType(element.name);
    // possibly change to use ids instead of name / strings
    if (element.name == "Fasenfräser") {
      // handle Fasenfräser stuff
      setChamferOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.name == "Rückwärts"
            ? { ...option, disabled: true }
            : { ...option, disabled: false },
        ),
      );
      setSelectedChamferType(chamfer_types[0])
    } else if (element.name == "Kombientgrater") {
      // handle Kombientgrater stuff
      setChamferOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.name ? { ...option, disabled: false } : option,
        ),
      );
    } else if (element.name == "Schwalbenschwanz") {
      // handle Schwalbenschwanz stuff
      setChamferOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.name == "Regulär"
            ? { ...option, disabled: true }
            : { ...option, disabled: false },
        ),
      );
      setSelectedChamferType(chamfer_types[1])
    } else {
      // handle weird stuff happened
    }
  };

  return (
    <>
      <div className="py-24 px-16 w-full max-w-6xl h-full grid lg:grid-cols-2 md:grid-cols-1 gap-8">
        <section className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-light border-b-2 border-black px-4 py-2">
              Werkzeug
            </h1>
          </div>
          <div className="flex w-full gap-4 justify-stretch">
            <Select options={tools} label="Werkzeug" name="tool" client:load />
            <Select
              options={tool_types}
              label="Werkzeugart"
              name="tool_type"
              handleChange={handleToolTypeChange}
              client:load
            />
          </div>
          <div className="flex w-full gap-4 justify-stretch">
            <Input label="Schneiden-⌀" identifier="d1" />
            <Input label="Spitzen-⌀" identifier="d2" />
            <Input label="Schaft-⌀" identifier="d3" />
          </div>
          <div className="flex w-full gap-4 justify-stretch">
            <Input label="Schneidenlänge" identifier="l1" />
            <Input label="Mittellänge" identifier="l2" />
            <Input label="Stumpflänge" identifier="l3" />
          </div>
          <div className="flex w-full gap-4 justify-stretch">
            <Input label="Spitzenwinkel" identifier="a1" />
            <Input label="Schulterwinkel" identifier="a2" />
          </div>
        </section>
        <div>
          <img src="/debug_placeholder_img.png" alt="" />
        </div>
        <section className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-light border-b-2 border-black px-4 py-2">
              Fase
            </h1>
          </div>
          <div className="flex w-full gap-4 justify-stretch">
            <Select
              options={chamferOptions}
              label="Art"
              name="chamfer_type"
              selected={selectedChamferType}
              client:load
            />
            <Input label="Fase Axial" identifier="Ca" />
            <Input label="Fase Radial" identifier="Cr" />
          </div>
          <div className="flex w-full gap-4 justify-stretch">
            <Select
              options={offset_types}
              label="Versatzrichtung"
              name="offset_type"
              client:load
            />
            <Input label="Versatz Axial" identifier="Oa" />
            <Input label="Versatz Radial" identifier="Or" />
          </div>
          <div className="flex w-full justify-stretch border-b-2 border-black mt-8 mb-6"></div>
          <div className="flex w-full gap-4 justify-around">
            <div className="flex flex-col w-auto">
              <p className="font-extralight">Wandaufmass:</p>
              <p
                id="offset-wall"
                className="block w-full text-center py-2 bg-sky-100 border-black border-2 shadow-md"
              >
                -0.1
              </p>
            </div>
            <div className="flex flex-col w-auto">
              <p className="font-extralight">Bodenaufmass:</p>
              <p
                id="offset-floor"
                className="block w-full text-center py-2 bg-sky-100 border-black border-2 shadow-md"
              >
                -1.1
              </p>
            </div>
          </div>
        </section>
        <div>
          <img src="/debug_placeholder_img.png" alt="" />
        </div>
      </div>
    </>
  );
}

export default VersatzrechnerContent;
