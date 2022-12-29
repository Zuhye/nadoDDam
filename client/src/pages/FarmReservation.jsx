import React from 'react';
import styled from 'styled-components';
import FarmFormat from '../components/FarmFormat';
import FarmReservationTable from '../components/FarmReservationTable';

const Tittle = styled.h2`
	text-align: center;
	margin-top: 7%;
	margin-bottom: 3%;
`;

const FarmReservation = () => {
	return (
		<>
			<FarmFormat>
				<Tittle>예약관리</Tittle>
				<FarmReservationTable />
			</FarmFormat>
		</>
	);
};

export default FarmReservation;
