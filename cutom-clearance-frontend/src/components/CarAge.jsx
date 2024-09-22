import styled from 'styled-components';

export default function CarAge({ age, handleAge }) {
  return (
    <Container>
      <Title>Возвраст авто:</Title>

      <Select name='age' value={age} onChange={handleAge}>
        <option value=''>Введите возвраст авто</option>
        <option value='До 3-ёх лет'>До 3-ёх лет</option>
        <option value='От 3-ёх до 5-ти лет'>От 3-ёх до 5-ти лет</option>
        <option value='Более 5-ти лет'>Более 5-ти лет</option>
      </Select>

      <AgeDisplay>Введённый возраст: {age}</AgeDisplay>
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

const Select = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  border: 2px solid #ccc;
  border-radius: 4px;
  color: #333;
  background-color: #fff;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Подсветка при фокусе */
  }

  option {
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    color: #333;
  }
`;

const AgeDisplay = styled.pre`
  font-size: 18px;
  font-family: 'Roboto Mono', monospace;
  color: #1a1a1a;
  background: none;
  padding: 10px 0;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  margin-top: 20px;
`;
