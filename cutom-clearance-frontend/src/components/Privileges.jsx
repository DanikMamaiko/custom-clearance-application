import styled from 'styled-components';

export default function Privileges({
  checkedPrivileges,
  handleCheckedPrivileges,
}) {
  return (
    <Container>
      <Title>Таможенная льгота 50% (Указ №140):</Title>

      <Label>
        <Checkbox
          type='checkbox'
          name='withPrivileges'
          checked={checkedPrivileges}
          onChange={handleCheckedPrivileges}
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
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;

  span {
    margin-left: 12px;
    color: ${(props) => (props.checked ? '#007bff' : '#333')};
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #007bff; /* Синий цвет для checkbox */
`;
