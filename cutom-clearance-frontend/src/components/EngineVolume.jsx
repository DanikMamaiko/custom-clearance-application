import styled from 'styled-components';

export default function EngineVolume({ volume, handleVolume }) {
  return (
    <Container>
      <Title>
        Объём двигателя (см<sup>3</sup>):
      </Title>

      <Input
        type='text'
        name='volume'
        value={volume}
        onChange={handleVolume}
        placeholder='Введите объём двигателя...'
      />

      <VolumeDisplay>Введённый объём: {volume}</VolumeDisplay>
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

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  border: 2px solid #ccc;
  border-radius: 4px;
  color: #333;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff; /* Синий цвет границы при фокусе */
  }

  &::placeholder {
    color: #999; /* Цвет placeholder */
    font-style: italic;
  }
`;

const VolumeDisplay = styled.pre`
  font-size: 18px;
  font-family: 'Roboto Mono', monospace;
  color: #1a1a1a;
  background: none;
  padding: 10px 0;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  margin-top: 20px;
`;
