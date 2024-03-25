"use strict";

const constance = {
  plateSize: 500, // mm (centimeter)
  frequency: null, // GHz
  wavelength: null, // mm (centimeter) (Lambda)
  minimumAbsence: null, // mm (millimeter) (л/20) or (л/10)
  minSuppression: null, // dB
  maxDiameter: null, // mm (millimeter) (л/2)
  minDiameter: null, // mm (millimeter)
};

// const plateSize = 500; // mm (centimeter)
// const frequency = 7.99; // GHz
// const wavelength = 37.5; // mm (centimeter) (л)
// const minimumAbsence = 1.875; // mm (millimeter) (л/20)
// const minSuppression = 9; // dB
// const maxDiameter = 18.75; // mm (millimeter) (л/2)
// const minDiameter = 1; // mm (millimeter)

const calc = {
  circleCountInMaxDiameter(diameter) {
    const otherCircle = diameter + constance.minimumAbsence;
    const firstCircle = diameter;

    const circleCount =
      Math.ceil((constance.maxDiameter - firstCircle) / otherCircle) + 1;

    return circleCount;
  },

  worstSuppression(diameter, circleCount) {
    const result =
      20 *
      Math.log10(
        (constance.wavelength * Math.sqrt(circleCount)) / (2 * diameter)
      );

    return result;
  },

  circleCountInRowTypeOne(diameter) {
    const lastCircle = diameter + 2 * constance.minimumAbsence; // mm
    const otherCircle = diameter + constance.minimumAbsence; // mm

    const circleCount =
      Math.floor((constance.plateSize - lastCircle) / otherCircle) + 1;

    return circleCount;
  },

  circleCountInRowTypeTwo(diameter) {
    const firstCircle =
      constance.minimumAbsence +
      diameter / 2 +
      constance.minimumAbsence / 2 +
      diameter; // mm
    const otherCircle = diameter + constance.minimumAbsence; // mm
    const lastCircle =
      diameter +
      constance.minimumAbsence +
      diameter / 2 +
      constance.minimumAbsence / 2 +
      constance.minimumAbsence; // mm

    const circleCount =
      Math.floor(
        (constance.plateSize - firstCircle - lastCircle) / otherCircle
      ) + 2;

    return circleCount;

    // return this.circleCountInRowTypeOne(diameter) - 1;
  },

  circleTotalSquare(totalCircleCount, diameter) {
    const circleSquare = (Math.PI * diameter ** 2) / 4;
    const totalSquare = totalCircleCount * circleSquare;

    return totalSquare;
  },
};

const holeInSquareShape = {
  calcRowGap() {
    const gap = constance.minimumAbsence;

    return gap;
  },

  calcRowCountOnPlate(diameter) {
    const rowCount = circleCountInRowTypeOne(diameter);

    return rowCount;
  },

  calcCircleCountInPlate(circleInRow) {
    const totalCircleCount = circleInRow ** 2;
    return totalCircleCount;
  },

  calcCircleCombine() {
    const circleCombine = [];

    for (
      let i = constance.minDiameter;
      i <= constance.maxDiameter;
      i = +(i + 0.1).toFixed(2)
    ) {
      const diameter = i;
      console;
      const circleCountInMaxDiametr = calc.circleCountInMaxDiameter(diameter);
      const worstSuppression = calc.worstSuppression(
        diameter,
        circleCountInMaxDiametr
      );

      if (worstSuppression < constance.minSuppression) break;

      const rowGap = this.calcRowGap();
      const circleCountInRow = calc.circleCountInRowTypeOne(diameter);
      const circleCountInPlate = this.calcCircleCountInPlate(circleCountInRow);
      const circleTotalSquare = calc.circleTotalSquare(
        circleCountInPlate,
        diameter
      );

      const combine = {
        diameter,
        rowGap,
        worstSuppression,
        // circleCountInMaxDiametr,
        circleInRow: circleCountInRow,
        circleInPlate: circleCountInPlate,
        totalSquare: circleTotalSquare,
      };

      circleCombine.push(combine);
    }

    console.log("circleCombine.length: ", circleCombine.length);

    if (!circleCombine.length) return circleCombine;

    const lastComb = circleCombine[circleCombine.length - 1];

    const circlesTotalArea = lastComb.totalSquare;
    const plateArea = constance.plateSize ** 2;

    lastComb.occupiedSurface = +((circlesTotalArea * 100) / plateArea).toFixed(
      1
    );

    return circleCombine;
  },
};

const holeInEquilateralTriangleShape = {
  calcRowGap(diameter) {
    const gap =
      ((constance.minimumAbsence + diameter) * Math.sqrt(3)) / 2 - diameter;

    return +gap.toFixed(2);
  },

  calcRowCountOnPlate(diameter, rowGap) {
    const firstRow = constance.minimumAbsence + diameter; // mm
    const otherRow = rowGap + diameter; // mm
    const lastRow = rowGap + diameter + constance.minimumAbsence; // mm

    const rowCount =
      Math.floor((constance.plateSize - firstRow - lastRow) / otherRow) + 2;

    return rowCount;
  },

  calcCircleCountInPlate(rowCount, circleInRowTypyOne, circleInRowTypyTwo) {
    const rowTypeOneCount = Math.ceil(rowCount / 2);
    const rowTypeTwoCount = Math.floor(rowCount / 2);

    const totalCircleInRowsTypeOne = rowTypeOneCount * circleInRowTypyOne;
    const totalCircleInRowsTypeTwo = rowTypeTwoCount * circleInRowTypyTwo;

    const totalCircleCount =
      totalCircleInRowsTypeOne + totalCircleInRowsTypeTwo;

    return totalCircleCount;
  },

  calcCircleCombine() {
    const circleCombine = [];

    for (
      let i = constance.minDiameter;
      i <= constance.maxDiameter;
      i = +(i + 0.1).toFixed(2)
    ) {
      const diameter = i;

      const circleCountInMaxDiametr = calc.circleCountInMaxDiameter(diameter);
      const worstSuppression = calc.worstSuppression(
        diameter,
        circleCountInMaxDiametr
      );

      if (worstSuppression < constance.minSuppression) break;

      const rowGap = this.calcRowGap(diameter);
      const rowCountOnPlate = this.calcRowCountOnPlate(diameter, rowGap);
      const circleCountInRowTypeOne = calc.circleCountInRowTypeOne(diameter);
      const circleCountInRowTypeTwo = calc.circleCountInRowTypeTwo(diameter);
      const circleCountInPlate = this.calcCircleCountInPlate(
        rowCountOnPlate,
        circleCountInRowTypeOne,
        circleCountInRowTypeTwo
      );
      const circleTotalSquare = calc.circleTotalSquare(
        circleCountInPlate,
        diameter
      );

      const combine = {
        diameter,
        rowGap,
        worstSuppression,
        // circleCountInMaxDiametr,
        circleInRow: [circleCountInRowTypeOne, circleCountInRowTypeTwo],
        circleInPlate: circleCountInPlate,
        totalSquare: circleTotalSquare,
      };

      circleCombine.push(combine);
    }

    if (!circleCombine.length) return circleCombine;

    const lastComb = circleCombine[circleCombine.length - 1];

    const circlesTotalArea = lastComb.totalSquare;
    const plateArea = constance.plateSize ** 2;

    lastComb.occupiedSurface = +((circlesTotalArea * 100) / plateArea).toFixed(
      1
    );

    return circleCombine;
  },
};

const visualizeHoles = {
  createCircleOnPlate(shape) {
    const allCombine = shape.calcCircleCombine();

    const correctCombine = allCombine.pop();

    console.log("correctCombine: ", correctCombine);

    return correctCombine;
  },

  addPlatePadding(selector) {
    const plate = document.querySelector(selector);
    console.log(plate);
    plate.style.cssText += `
          padding-top: ${constance.minimumAbsence}px;
          padding-right: ${constance.minimumAbsence}px;
          padding-bottom: ${constance.minimumAbsence}px;
          padding-left: 0px;
      `;

    console.log(plate);
  },

  createHoleForSquare(diameter, gap, isFirstRow) {
    const hole = document.createElement("span");
    hole.classList.add("hole");

    hole.style.cssText += `
          width: ${diameter}px;
          height: ${diameter}px;
          margin-top: ${gap}px;
          margin-left: ${constance.minimumAbsence}px;
      `;

    if (isFirstRow) {
      hole.style.cssText += `
          margin-top: 0px;
      `;
    }

    return hole;
  },

  createHoleForTriangle(diameter, gap, isFirstRow, newRowStart, newRowEnd) {
    const hole = document.createElement("span");
    hole.classList.add("hole");

    hole.style.cssText += `
          width: ${diameter}px;
          height: ${diameter}px;
          margin-top: ${gap}px;
          margin-left: ${constance.minimumAbsence}px;
      `;

    if (isFirstRow) {
      hole.style.cssText += `
        margin-top: 0px;
      `;
    }

    if (newRowStart) {
      hole.style.cssText += `
        margin-left: ${
          constance.minimumAbsence + constance.minimumAbsence / 2 + diameter / 2
        }px;
      `;
    }

    if (newRowEnd) {
      hole.style.cssText += `
        margin-right: ${constance.minimumAbsence / 2 + diameter / 2}px;
      `;
    }

    return hole;
  },

  addHolesOnPlateForSquareShape(
    diameter,
    gap,
    circleInRowA,
    circleInPlate,
    plateSelector
  ) {
    const plate = document.querySelector(plateSelector);

    const holes = [];

    let isFirstRow = true;

    for (let i = 1; i <= circleInPlate; i++) {
      if (i > circleInRowA) isFirstRow = false;

      const hole = this.createHoleForSquare(diameter, gap, isFirstRow);
      holes.push(hole);
    }

    plate.append(...holes);
  },

  addHolesOnPlateForTriangleShape(
    diameter,
    gap,
    circleInRows,
    circleInPlate,
    plateSelector
  ) {
    const plate = document.querySelector(plateSelector);

    const holes = [];
    const [oddRowCount, evenRowCount] = circleInRows;

    let isFirstRow = true;

    let evenRowStartIndex = oddRowCount + 1;
    let evenRowEndIndex = oddRowCount + evenRowCount;

    for (let i = 1; i <= circleInPlate; i++) {
      const newEvenRowStart = i % evenRowStartIndex === 0;
      const newEvenRowEnd = i % evenRowEndIndex === 0;

      if (newEvenRowStart) {
        evenRowStartIndex += oddRowCount + evenRowCount;
        isFirstRow = false;
      }

      if (newEvenRowEnd) {
        evenRowEndIndex += oddRowCount + evenRowCount;
      }

      const hole = this.createHoleForTriangle(
        diameter,
        gap,
        isFirstRow,
        newEvenRowStart,
        newEvenRowEnd
      );

      holes.push(hole);
    }

    plate.append(...holes);
  },

  addPlateInfo(selector, infoObj) {
    const platInfo = document.querySelector(selector);

    const circleOnPlate = platInfo.querySelector(".circleOnPlate");
    const diameter = platInfo.querySelector(".diameter");
    const rowGap = platInfo.querySelector(".rowGap");
    const minFrequency = platInfo.querySelector(".minFrequency");
    const totalSquare = platInfo.querySelector(".totalSquare");
    const surfaceOccupied = platInfo.querySelector(".surfaceOccupied");

    circleOnPlate.textContent = infoObj.circleInPlate;
    diameter.textContent = infoObj.diameter;
    rowGap.textContent = +infoObj.rowGap.toFixed(2);
    minFrequency.textContent = +infoObj.worstSuppression.toFixed(4);
    totalSquare.textContent = +infoObj.totalSquare.toFixed(1);
    surfaceOccupied.textContent = +infoObj.occupiedSurface.toFixed(2);
  },

  addErrorMessage(selector) {
    const plate = document.querySelector(selector);
    const message = document.createElement("h3");

    message.innerText = "Holes cannot be generated for these combinations";

    plate.append(message);
  },
};

const runAlgorithm = {
  // square form
  squareAlgorithm() {
    const circleSquareShapeInfo =
      visualizeHoles.createCircleOnPlate(holeInSquareShape);

    if (!circleSquareShapeInfo) {
      visualizeHoles.addErrorMessage(".plate.square-shape");

      return;
    }

    const {
      diameter: diameterA,
      rowGap: rowGapA,
      circleInPlate: circleInPlateA,
      circleInRow: circleInRowA,
      totalSquare: totalSquareA,
      worstSuppression: worstSuppressionA,
    } = circleSquareShapeInfo;

    visualizeHoles.addPlatePadding(".plate.square-shape");
    visualizeHoles.addHolesOnPlateForSquareShape(
      diameterA,
      rowGapA,
      circleInRowA,
      circleInPlateA,
      ".plate.square-shape"
    );
    visualizeHoles.addPlateInfo(".plate-square .info", circleSquareShapeInfo);
  },

  // equilateral triangle form
  triangleAlgorithm() {
    const circleEquilateralTriangleShapeInfo =
      visualizeHoles.createCircleOnPlate(holeInEquilateralTriangleShape);

    if (!circleEquilateralTriangleShapeInfo) {
      visualizeHoles.addErrorMessage(".plate.equilateral-triangle-shape");

      return;
    }

    const {
      diameter: diameterB,
      rowGap: rowGapB,
      circleInPlate: circleInPlateB,
      circleInRow: circleInRowB,
    } = circleEquilateralTriangleShapeInfo;

    console.log(diameterB, rowGapB, circleInPlateB);

    visualizeHoles.addPlatePadding(".plate.equilateral-triangle-shape");
    visualizeHoles.addHolesOnPlateForTriangleShape(
      diameterB,
      rowGapB,
      circleInRowB,
      circleInPlateB,
      ".plate.equilateral-triangle-shape"
    );
    visualizeHoles.addPlateInfo(
      ".plate-triangle .info",
      circleEquilateralTriangleShapeInfo
    );
  },

  clearPlates() {
    const plates = document.querySelectorAll(".plate");

    plates.forEach((plate) => {
      plate.innerHTML = "";
    });
  },

  clearInfo() {
    const infoSections = document.querySelectorAll(".info");

    infoSections.forEach((info) => {
      const spans = info.querySelectorAll('span');

      spans.forEach((span) => span.innerText = '');
    });
  },
};

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  runAlgorithm.clearPlates();
  runAlgorithm.clearInfo();

  const formData = Object.fromEntries(new FormData(event.target).entries());

  const { frequency, wavelength, gap, minFrequency, minDiameter } = formData;

  constance.frequency = +(+frequency).toFixed(2);

  constance.wavelength = +((3 / constance.frequency) * 10 * 10).toFixed(1);

  constance.minimumAbsence = +(
    gap === "l/20" ? +constance.wavelength / 20 : +constance.wavelength / 10
  ).toFixed(3);

  constance.minSuppression = +minFrequency;

  constance.maxDiameter = +(constance.wavelength / 2).toFixed(2);

  constance.minDiameter = +minDiameter;

  console.log("formData: ", formData);
  console.log(Object.entries(constance));
  runAlgorithm.squareAlgorithm();
  runAlgorithm.triangleAlgorithm();
});
