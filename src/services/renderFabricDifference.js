import createFabric from "./createFabricObjects";

import getRGBNumber from "../utils/getRGBNumber";

const renderFabricDifference = async function (differences, fixCoord, frameId) {
  const differenceArray = [];

  if (differences.isNew) {
    differences.type = "NEW_FRAME";
    const fabricObjects = await createFabric(differences, fixCoord);
    const [rectObject, textObject] = fabricObjects;

    rectObject.on("mouseover", () => {
      const [r, g, b, o] = getRGBNumber(rectObject.fill);
      const mouseoverColor = `rgba(${r}, ${g}, ${b}, 0.5)`;

      rectObject.set({
        fill: mouseoverColor,
      });
      textObject.set({
        visible: true,
      });
      this.renderAll();
    });

    rectObject.on("mouseout", () => {
      const [r, g, b, o] = getRGBNumber(rectObject.fill);
      const mouseoutColor = `rgba(${r}, ${g}, ${b}, 0)`;

      rectObject.set({
        fill: mouseoutColor,
      });
      textObject.set({
        visible: false,
      });
      this.renderAll();
    });

    differenceArray.push(rectObject, textObject);
  } else {
    for (const nodeId in differences) {
      if (differences[nodeId].frameId === frameId) {
        const fabricObjects = await createFabric(differences[nodeId], fixCoord);
        const [rectObject, textObject] = fabricObjects;

        rectObject.on("mouseover", () => {
          const [r, g, b, o] = getRGBNumber(rectObject.fill);
          const mouseoverColor = `rgba(${r}, ${g}, ${b}, 0.5)`;

          rectObject.set({
            fill: mouseoverColor,
          });
          textObject.set({
            visible: true,
          });
          this.renderAll();
        });

        rectObject.on("mouseout", () => {
          const [r, g, b, o] = getRGBNumber(rectObject.fill);
          const mouseoutColor = `rgba(${r}, ${g}, ${b}, 0)`;

          rectObject.set({
            fill: mouseoutColor,
          });
          textObject.set({
            visible: false,
          });
          this.renderAll();
        });

        differenceArray.push(rectObject, textObject);
      }
    }
  }

  this.add(...differenceArray);
  this.renderAll();
};

export default renderFabricDifference;
