const createDiffText = diffTextObject => {
  if (Object.keys(diffTextObject).length === 0) {
    return "새로 생긴 노드 입니다.";
  }

  const propertyParser = propertyString => {
    return propertyString.replaceAll(/\.\d/g, "");
  };

  const differenceTexts = {};

  for (const property in diffTextObject) {
    const value = diffTextObject[property];

    if (
      property.includes("absoluteBoundingBox") ||
      property.includes("absoluteRenderBounds")
    ) {
      if (property.includes(".x") || property.includes(".y")) {
        if (differenceTexts.Position) {
          differenceTexts.Position = {
            ...differenceTexts.Position,
            [propertyParser(property)]: value,
          };
        } else {
          differenceTexts.Position = {
            [propertyParser(property)]: value,
          };
        }
      } else if (property.includes(".width") || property.includes(".height")) {
        if (differenceTexts.Size) {
          differenceTexts.Size = {
            ...differenceTexts.Size,
            [propertyParser(property)]: value,
          };
        } else {
          differenceTexts.Size = {
            [propertyParser(property)]: value,
          };
        }
      }
    } else if (property.includes("characters") || property.includes("font")) {
      if (differenceTexts.Text) {
        differenceTexts.Text = {
          ...differenceTexts.Text,
          [propertyParser(property)]: value,
        };
      } else {
        differenceTexts.Text = {
          [propertyParser(property)]: value,
        };
      }
    } else if (property.includes("Color") || property.includes("background")) {
      if (differenceTexts.Color) {
        differenceTexts.Color = {
          ...differenceTexts.Color,
          [propertyParser(property)]: value,
        };
      } else {
        differenceTexts.Color = {
          [propertyParser(property)]: value,
        };
      }
    } else if (differenceTexts.Etc) {
      differenceTexts.Etc = {
        ...differenceTexts.Etc,
        [propertyParser(property)]: value,
      };
    } else {
      differenceTexts.Etc = {
        [propertyParser(property)]: value,
      };
    }
  }

  let differenceResult = "";

  for (const type in differenceTexts) {
    const propValue = differenceTexts[type];

    differenceResult += `\n${type}\n`;

    for (const prop in propValue) {
      const changeResult = propValue[prop];
      const [beforeValue, afterValue] = changeResult.split("=>");

      if (beforeValue === undefined && afterValue !== undefined) {
        if (!isNaN(afterValue)) {
          differenceResult += `${prop}: ${Number(afterValue).toFixed(1)} 추가됨.\n`;
        } else {
          differenceResult += `${prop}: ${afterValue} 추가됨.\n`;
        }
      } else if (beforeValue !== undefined && afterValue === undefined) {
        if (!isNaN(beforeValue)) {
          differenceResult += `${prop}: ${Number(beforeValue).toFixed(1)} 삭제됨.\n`;
        } else {
          differenceResult += `${prop}: ${beforeValue} 삭제됨.\n`;
        }
      } else if (!isNaN(beforeValue) && !isNaN(afterValue)) {
        differenceResult += `${prop}: ${Number(beforeValue).toFixed(1)} => ${Number(afterValue).toFixed(1)}.\n`;
      } else {
        differenceResult += `${prop}: ${changeResult}.\n`;
      }
    }
  }

  return differenceResult;
};
export default createDiffText;
