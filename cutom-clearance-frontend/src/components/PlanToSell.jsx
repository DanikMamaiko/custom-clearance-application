import styled from 'styled-components';

export default function PlanToSell({ planToSell, handlePlanToSell }) {
  return (
    <Container>
      <Title>Планируется продажа авто в течении 3-ёх лет:</Title>

      <Label>
        <Checkbox
          type='checkbox'
          name='planToSell'
          checked={planToSell}
          onChange={handlePlanToSell}
        />
        <span>(Да / Нет)</span>
      </Label>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h3`
  font-size: 26px;
  margin-bottom: 20px;
  color: #1a1a1a;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  color: #333;
  letter-spacing: 0.5px;
  margin-bottom: 12px;

  span {
    margin-left: 12px;
    color: ${(props) => (props.checked ? '#007bff' : '#333')};
  }
`;

const Checkbox = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #000; /* Четкий черный цвет чекбокса */
`;
