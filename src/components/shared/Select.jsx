import styled from "styled-components";

function Select({ selectInfo }) {
  return (
    selectInfo && (
      <SelectWrapper>
        {selectInfo.label && (
          <label htmlFor={selectInfo.id}>{selectInfo.label}</label>
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
    width: 400px;
    height: 64px;
    margin-bottom: 12px;
    padding: 0px 24px;
    display: flex;
    border-radius: 8px;
    border: 2px solid #000000;

    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    background-color: #ffffff;
  }

  .label {
    display: block;
    margin-bottom: 12px;

    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .description {
    display: block;

    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: #868e96;
  }

  select:disabled {
    background-color: #e9ecef;
    color: #868e96;
    cursor: not-allowed;
  }

  .hidden {
    display: none;
  }
`;

export default Select;
