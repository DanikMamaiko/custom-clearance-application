import styled from 'styled-components';

export default function EngineType({ engineType, handleEngineType }) {
  return (
    <Container>
      <Title>Тип двигателя:</Title>
      <Label>
        <input
          name='engineType'
          type='radio'
          value='Бензин'
          checked={'Бензин' === engineType}
          onChange={handleEngineType}
        />
        <span>Бензин</span>
      </Label>

      <Label>
        <input
          name='engineType'
          type='radio'
          value='Дизель'
          checked={'Дизель' === engineType}
          onChange={handleEngineType}
        />
        <span>Дизель</span>
      </Label>

      <Label>
        <input
          name='engineType'
          type='radio'
          value='Электро'
          checked={'Электро' === engineType}
          onChange={handleEngineType}
        />
        <span>Электро</span>
      </Label>

      <EngineDisplay>Выбранный тип: {engineType}</EngineDisplay>
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
  font-family: 'Roboto', sans-serif; /* Строгий и современный шрифт */
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  color: #333;
  letter-spacing: 0.5px; /* Дополнительное пространство между буквами для строгого вида */

  input {
    margin-right: 12px;
    width: 22px;
    height: 22px;
    accent-color: #000; /* Четкий черный цвет радио-кнопок */
    cursor: pointer;
  }

  span {
    transition: color 0.2s ease;
  }

  &:hover span {
    color: #007bff; /* Небольшой акцент на тексте при наведении */
  }
`;

const EngineDisplay = styled.pre`
  font-size: 18px;
  font-family: 'Roboto Mono', monospace; /* Шрифт с моноширинной основой для техничного вида */
  color: #1a1a1a;
  background: none;
  padding: 10px 0;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  margin-top: 24px;
`;
