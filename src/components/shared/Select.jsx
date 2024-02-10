import styled from "styled-components";

function Select({ selectInfo }) {
  return (
    selectInfo && (
      <SelectWrapper>
        {selectInfo.label && (
          <label htmlFor={selectInfo.id} className="label">
            {selectInfo.label}
          </label>
        )}
        {selectInfo.selects.map(select => (
          <select
            className={select.className}
            key={select.className}
            id={select.className}
            onChange={select.handleChange}
          >
            <option className="disabled hidden">{select.placeholder}</option>
            {select.options}
          </select>
        ))}
        {selectInfo.description && (
          <span className="description">{selectInfo.description}</span>
        )}
      </SelectWrapper>
    )
  );
}

const SelectWrapper = styled.div`
  box-sizing: border-box;
  padding-top: 48px;
  margin-right: 24px;

  select {
    display: flex;
    width: 440px;
    height: 64px;
    padding: 0px 24px;
    border-radius: 8px;
    border: 2px solid #000000;
    margin-bottom: 12px;

    background-color: #ffffff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }

  .label {
    display: block;
    margin-bottom: 12px;

    color: #000000;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .description {
    display: block;

    color: #868e96;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }

  select:disabled {
    cursor: not-allowed;

    background-color: #e9ecef;
    color: #868e96;
  }

  .hidden {
    display: none;

    color: #868e96;
  }
`;

export default Select;
