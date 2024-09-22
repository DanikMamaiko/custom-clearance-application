import styled from 'styled-components';

export default function Entity({ entity, handleEntity }) {
  return (
    <Container>
      <Title>Кто растамаживает:</Title>

      <Label>
        <Radio
          type='radio'
          name='entity'
          value='Физ.лицо'
          checked={'Физ.лицо' === entity}
          onChange={handleEntity}
        />
        Физическое лицо
      </Label>

      <Label>
        <Radio
          type='radio'
          name='entity'
          value='Юр.лицо'
          checked={'Юр.лицо' === entity}
          onChange={handleEntity}
        />
        Юридическое лицо
      </Label>

      <EntityDisplay>Растамаживает лицо: {entity}</EntityDisplay>
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
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #007bff; /* Цвет текста при наведении */
  }
`;

const Radio = styled.input`
  margin-right: 12px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #007bff; /* Синий цвет радиокнопки */
`;

const EntityDisplay = styled.pre`
  font-size: 18px;
  font-family: 'Roboto Mono', monospace;
  color: #1a1a1a;
  background: none;
  padding: 10px 0;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  margin-top: 20px;
`;
