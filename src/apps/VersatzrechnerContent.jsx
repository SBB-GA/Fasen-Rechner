import Select from "../components/Select";
import Input from "../components/Input";
import ToolRender from "../components/ToolRender";
import ChamferRender from "../components/ChamferRender";
import { useState, useEffect } from "react";

import cutters from "../../public/cutters.json";

function VersatzrechnerContent() {
  const tools = [{ id: 1, name: "... Custom Tool" }];
  let count = 2;
  for (const [key, value] of Object.entries(cutters)) {
    tools.push({ id: count, name: key, cutter: value });
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
  const [selectedChamferType, setSelectedChamferType] = useState();

  useEffect(() => {
    // Example of how to handle side effects when selectedToolType changes
    // if (selectedToolType) {
    //   console.log(`Selected Tool Type: ${selectedToolType}`);
    // }
  }, [selectedToolType]);

  const populateToolDimensions = (element) => {
    if (element.id == 1) {
      return;
    } // if custom tool is selected we can stop
    const cutter = element.cutter;
    if (cutter.tool_type !== undefined) {
      if (cutter.tool_type == 0) {
        // Fasenfräser
        setSelectedToolType(tool_types[0]);
        handleToolTypeChange({ name: "Fasenfräser" }); // update available chamfer types
      } else if (cutter.tool_type == 1) {
        // Kombientgrater
        setSelectedToolType(tool_types[1]);
        handleToolTypeChange({ name: "Kombientgrater" }); // update available chamfer types
      } else if (cutter.tool_type == 2) {
        // Schwalbenschwanz
        setSelectedToolType(tool_types[2]);
        handleToolTypeChange({ name: "Schwalbenschwanz" }); // update availablel chamfer types
      }
    }
    document
      .getElementsByName("tool_type[name]")[0]
      .dispatchEvent(new Event("tool_type_change")); // triggering the enabling / disabling of the inputs which are needed for the selected tool
    document.getElementById("a1").value = cutter.a1 ? cutter.a1 : "0";
    document.getElementById("a2").value = cutter.a2 ? cutter.a2 : "0";
    document.getElementById("d1").value = cutter.d1 ? cutter.d1 : "0";
    document.getElementById("d2").value = cutter.d2 ? cutter.d2 : "0";
    document.getElementById("d3").value = cutter.d3 ? cutter.d3 : "0";
    document.getElementById("l1").value = cutter.l1 ? cutter.l1 : "0";
    document.getElementById("l2").value = cutter.l2 ? cutter.l2 : "0";
    document.getElementById("l3").value = cutter.l3 ? cutter.l3 : "0";

    // this triggers the update of the chamfer elements. Is needed because the tool angle could possibly be different if another tool is selected, thus we need to dispatch the event that the toolangel has changed.
    document.getElementById("Ca").dispatchEvent(new Event("blur"))
    document.getElementById("Oa").dispatchEvent(new Event("blur"))
    console.debug("dispatched Event 'Blur' on Element 'Ca' and 'Oa'")
  };

  const handleToolTypeChange = (element) => {
    // element is the whole object as its entered in the tool_types list
    setSelectedToolType(element);
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
      setSelectedChamferType(chamfer_types[0]);
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
      setSelectedChamferType(chamfer_types[1]);
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
            <Select
              options={tools}
              label="Werkzeug"
              name="tool"
              handleChange={populateToolDimensions}
              client:load
            />
            <Select
              options={tool_types}
              label="Werkzeugart"
              name="tool_type"
              selected={selectedToolType}
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
          <ToolRender client:load/>
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
                -
              </p>
            </div>
            <div className="flex flex-col w-auto">
              <p className="font-extralight">Bodenaufmass:</p>
              <p
                id="offset-floor"
                className="block w-full text-center py-2 bg-sky-100 border-black border-2 shadow-md"
              >
                -
              </p>
            </div>
          </div>
        </section>
        <div>
          <ChamferRender client:load />
        </div>
      </div>
    </>
  );
}

export default VersatzrechnerContent;
