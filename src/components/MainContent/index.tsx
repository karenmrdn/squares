import { useState, useMemo, useEffect, useRef } from "react";
import ReactSelect, { ActionMeta, SingleValue } from "react-select";

import { DifficultyLevel, SelectOption } from "models";
import { getDifficultyLevels } from "api";

import { Button } from "../Button";
import { Square } from "./Square";

export const MainContent = () => {
  const startBtnRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const [hoveredSquares, setHoveredSquares] = useState<number[]>([]);
  const [history, setHistory] = useState<{ id: string; value: string }[]>([]);

  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);
  const diffLvlOptions = useMemo(
    () => difficultyLevels.map((diffLvlItem) => ({ value: diffLvlItem.field, label: diffLvlItem.name })),
    [difficultyLevels]
  );
  const [selectedDiffLvl, setSelectedDiffLvl] = useState(diffLvlOptions[0]);

  const [currDiffLvl, setCurrDiffLvl] = useState(selectedDiffLvl);
  const currDiffLvlValue = currDiffLvl?.value || 5;

  useEffect(() => {
    getDifficultyLevels().then((levels) => {
      if (levels) {
        setDifficultyLevels(levels);
        setSelectedDiffLvl({ value: levels[0].field, label: levels[0].name });
      }
    });
  }, []);

  const arrOfSquares = useMemo(() => [...new Array(currDiffLvlValue * currDiffLvlValue)], [currDiffLvlValue]);

  const handleStart = () => {
    setCurrDiffLvl(selectedDiffLvl);
    setHistory([]);
    setHoveredSquares([]);
  };

  const handleChange = (newValue: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
    setSelectedDiffLvl(newValue as SelectOption);
    startBtnRef.current.focus();
  };

  const handleMouseEnter = (index: number) => {
    const hoveredSquareRow = Math.ceil((index + 1) / currDiffLvlValue);
    const hoveredSquareCol = index - currDiffLvlValue * (hoveredSquareRow - 1) + 1;
    setHistory((prev) => [
      { id: window.crypto.randomUUID(), value: `row ${hoveredSquareRow}, col ${hoveredSquareCol}` },
      ...prev,
    ]);

    setHoveredSquares((prev) => {
      const prevCopy = [...prev];
      const currentSquareIndexInArr = prevCopy.indexOf(index);

      if (currentSquareIndexInArr === -1) {
        prevCopy.push(index);
      } else {
        prevCopy.splice(currentSquareIndexInArr, 1);
      }

      return prevCopy;
    });
  };

  return (
    <main className="mx-auto min-h-screen70 max-w-3xl px-4">
      <h1 className="mb-4 text-xl font-bold">Hover over squares!</h1>
      <div className="grid grid-cols-squares-board gap-6">
        <div>
          <div className="mb-4 flex gap-4">
            <ReactSelect
              value={selectedDiffLvl}
              options={diffLvlOptions}
              onChange={handleChange}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  minWidth: "120px",
                }),
              }}
            />
            <Button ref={startBtnRef} title="Start" onClick={handleStart} />
          </div>
          <div className="grid grid-cols-squares-board items-start gap-4">
            <div className={`grid grid-cols-${currDiffLvlValue} border-l border-b border-black`}>
              {arrOfSquares.map((_, index) => (
                <Square
                  key={index}
                  isHovered={hoveredSquares.includes(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  selectedDiffLvlValue={currDiffLvlValue}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-xs">
          <h2 className="mb-2 font-bold">History</h2>
          <div className={`flex max-h-${currDiffLvlValue}-squares flex-col gap-2 overflow-auto`}>
            {history.length > 0
              ? history.map((historyItem) => (
                  <p
                    key={historyItem.id}
                    className="max-w-[160px] animate-slide-in rounded border border-secondary bg-primary-100 p-2 text-xs font-bold text-secondary"
                  >
                    {historyItem.value}
                  </p>
                ))
              : "No hovered squares yet"}
          </div>
        </div>
      </div>
    </main>
  );
};
