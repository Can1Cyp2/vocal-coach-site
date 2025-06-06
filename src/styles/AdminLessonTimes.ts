import styled from 'styled-components'

export const TimeGroupWrapper = styled.div`
  margin-top: 1.5rem;
`

export const TimeGroupTitle = styled.h5`
  margin-bottom: 0.5rem;
  color: #444;
  font-size: 1rem;
`

export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export const TimeButton = styled.button<{ $selected: boolean }>`
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px solid #007bff' : '1px solid #ccc')};
  background-color: ${({ $selected }) => ($selected ? '#e9f2ff' : '#fff')};
  cursor: pointer;
  font-weight: ${({ $selected }) => ($selected ? 'bold' : 'normal')};
  font-size: 0.85rem;

  &:hover {
    background-color: #f3f3f3;
  }
`

export const DateSectionWrapper = styled.div`
  margin-top: 1rem;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
  max-height: 240px;
  overflow-y: auto;
`

export const MonthGroup = styled.div`
  margin-bottom: 1rem;
`

export const MonthLabel = styled.h5`
  margin: 0.5rem 0;
  font-weight: bold;
  font-size: 0.95rem;
  color: #333;
`

export const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.4rem;

  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
`

export const DateLabel = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  cursor: pointer;
  background-color: ${({ $selected }) => ($selected ? '#e7f7ee' : 'transparent')};
  border-radius: 4px;
  font-size: 0.9rem;

  input {
    margin: 0;
  }
`
