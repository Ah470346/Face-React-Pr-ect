import React from 'react';
import Header from './headerComponents/header';
import Body from './bodyComponents/body';

function Main(props) {
    return (
        <div className='main'>
            <Header></Header>
            <Body></Body>
        </div>
    )
}

export default Main;

