import createFabric from "./createFabricObjects";

import fixCoordinate from "../utils/fixCoordinate";
import isOwnProperty from "../utils/isOwnProperty";

import FABRIC_RENDER from "../constants/renderConstants";

const renderFabricFrame = async function (frameJSON, imageUrl) {
  const fabricObject = new Map();

  if (frameJSON.type === "NEW_FRAME") {
    frameJSON.type = "";
  }

  const frameRootObject = await createFabric(
    frameJSON,
    fixCoordinate(frameJSON),
  );

  frameRootObject.stroke = FABRIC_RENDER.STROKE_COLOR;
  frameRootObject.strokeWidth = FABRIC_RENDER.STROKE_WIDTH;

  fabricObject.set(frameJSON.frameId, frameRootObject);

  for (const nodeId in frameJSON.nodes) {
    if (isOwnProperty(frameJSON.nodes, nodeId)) {
      const isIncludeImage =
        frameJSON.nodes[nodeId].property.fills[0]?.imageRef;
      if (isIncludeImage) {
        const { imageRef } = frameJSON.nodes[nodeId].property.fills[0];
        if (imageUrl[imageRef]) {
          frameJSON.nodes[nodeId].property.imageURL = imageUrl[imageRef];
        }
      }
    }

    fabricObject.set(
      nodeId,
      await createFabric(frameJSON.nodes[nodeId], fixCoordinate(frameJSON)),
    );
  }

  for (const nodeId in frameJSON.nodes) {
    const targetNode = frameJSON.nodes[nodeId];
    const childrenIds = [];

    if (targetNode.property.clipsContent) {
      const clipTargetNode = fabricObject.get(nodeId);

      clipTargetNode.absolutePositioned = true;
      fabricObject.set(nodeId, clipTargetNode);

      targetNode.property.overrides?.forEach(innerNode => {
        if (innerNode.overriddenFields.includes("fills")) {
          childrenIds.push(innerNode.id);
        }
      });
    }

    while (childrenIds.length) {
      const clippedTargetNodeId = childrenIds.pop();

      const clipTargetNode = fabricObject.get(nodeId);
      const fabricChildObject = fabricObject.get(clippedTargetNodeId);

      fabricChildObject.clipPath = clipTargetNode;
      fabricObject.set(clippedTargetNodeId, fabricChildObject);
    }
  }

  if (frameJSON.property.clipsContent === true) {
    const clipTargetNode = fabricObject.get(frameJSON.frameId);

    clipTargetNode.absolutePositioned = true;

    fabricObject.set(frameJSON.frameId, clipTargetNode);

    for (const fabricEntries of fabricObject) {
      const isChildOfFrame = fabricEntries[0] !== frameJSON.frameId;
      const isNotClipped = !fabricObject.get(fabricEntries[0])?.clipPath;

      if (isChildOfFrame && isNotClipped) {
        const clippedTargetNode = fabricObject.get(fabricEntries[0]);

        clippedTargetNode.clipPath = clipTargetNode;
        fabricObject.set(fabricEntries[0], clippedTargetNode);
      }
    }
  }

  const fabricObjectArray = [...fabricObject.values()];

  fabricObjectArray.forEach(fabricObject => {
    this.add(fabricObject);
  });
};

export default renderFabricFrame;
