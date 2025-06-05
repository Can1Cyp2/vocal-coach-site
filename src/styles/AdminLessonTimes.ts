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
