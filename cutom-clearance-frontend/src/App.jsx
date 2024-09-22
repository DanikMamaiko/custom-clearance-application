import styled from 'styled-components';
import { useState } from 'react';
import CarAge from './components/CarAge';
import CarCost from './components/CarCost';
import EngineType from './components/EngineType';
import EngineVolume from './components/EngineVolume';
import Entity from './components/Entity';
import Privileges from './components/Privileges';
import PlanToSell from './components/PlanToSell';

import axios from 'axios';

export default function App() {
  const [data, setData] = useState(null);

  const [engineType, setEngineType] = useState('Бензин');
  const [checkedPrivileges, setCheckedPrivileges] = useState(false);
  const [age, setAge] = useState('Введите возвраст авто');
  const [cost, setCost] = useState('');
  const [volume, setVolume] = useState('');
  const [entity, setEntity] = useState('Физ.лицо');
  const [fuel, setFuel] = useState('');
  const [planToSell, setPlanToSell] = useState(false);

  function handlePlanToSell() {
    setPlanToSell(!planToSell);
  }

  function handleFuel(event) {
    setFuel(event.target.value);
  }

  function handleEntity(event) {
    setEntity(event.target.value);
  }

  function handleVolume(event) {
    setVolume(event.target.value);
  }

  function handleCost(event) {
    setCost(event.target.value);
  }

  function handleEngineType(event) {
    setEngineType(event.target.value);
  }

  function handleAge(event) {
    setAge(event.target.value);
  }

  function handleCheckedPrivileges() {
    setCheckedPrivileges(!checkedPrivileges);
  }

  // Submit form function
  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      engineType: engineType,
      withPrivileges: checkedPrivileges,
      age: age,
      cost: cost,
      volume: volume,
      entity: entity,
      fuel: fuel,
      planToSell: planToSell,
    };

    const params = new URLSearchParams(payload);

    axios
      .post('http://localhost:8080/rest/api/calculate', params)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        console.log('Error fetching data: ', error);
      });
  }

  return (
    <Background>
      <Container>
        <Title>Калькулятор растаможки</Title>

        <Form onSubmit={handleSubmit}>
          <EngineType
            engineType={engineType}
            handleEngineType={handleEngineType}
          />

          {engineType === 'Электро' && (
            <div>
              <PlanToSell
                planToSell={planToSell}
                handlePlanToSell={handlePlanToSell}
              />
              {planToSell === true && (
                <CarCost cost={cost} handleCost={handleCost} />
              )}
            </div>
          )}

          {engineType === 'Дизель' && (
            <div>
              <CarCost cost={cost} handleCost={handleCost} />
              <CarAge age={age} handleAge={handleAge} />
              <EngineVolume volume={volume} handleVolume={handleVolume} />
              <Entity entity={entity} handleEntity={handleEntity} />
              {entity === 'Физ.лицо' && (
                <Privileges
                  checkedPrivileges={checkedPrivileges}
                  handleCheckedPrivileges={handleCheckedPrivileges}
                />
              )}
            </div>
          )}

          {engineType === 'Бензин' && (
            <div>
              <CarCost cost={cost} handleCost={handleCost} />
              <CarAge age={age} handleAge={handleAge} />
              <EngineVolume volume={volume} handleVolume={handleVolume} />
              <Entity entity={entity} handleEntity={handleEntity} />
              {entity === 'Физ.лицо' && (
                <Privileges
                  checkedPrivileges={checkedPrivileges}
                  handleCheckedPrivileges={handleCheckedPrivileges}
                />
              )}
            </div>
          )}

          <SubmitButton type='submit'>Рассчитать</SubmitButton>
        </Form>

        <ResultContainer>
          <Title>Результат расчета:</Title>
          <Result>
            {data ? (
              <>
                {data} <EuroSign>EUR</EuroSign>
              </>
            ) : (
              '—'
            )}
          </Result>
        </ResultContainer>
      </Container>
    </Background>
  );
}

// Styled components

const Background = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: center;
  font-weight: 700;
  margin-bottom: 40px;
  font-family: 'Roboto', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SubmitButton = styled.button`
  font-size: 18px;
  color: #fff;
  background-color: #007bff;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const ResultContainer = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const Result = styled.p`
  font-size: 28px;
  color: #007bff; /* Более синий цвет */
  font-weight: 700;
  margin-top: 10px;
  font-family: 'Roboto', sans-serif;
`;

const EuroSign = styled.span`
  font-size: 20px; /* Размер меньше для EUR */
  color: #000; /* Черный цвет */
  font-weight: normal; /* Обычный вес шрифта */
`;
