import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

const ListTrain = ({filter}) => {;
    return (
        <div className='list-train'>
            <div className='scroll-list'>
                {
                    filter.map((i,index)=>{
                        return(
                            <div key={index} className='list-item'>
                                <div className="wrap-person">
                                    <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                                    <p>{i.label}</p>
                                </div>
                                <div className="wrap-channel-name">
                                    <p>{i.ChannelName}</p>
                                </div>
                            </div>
                        )
                    })   
                }
            </div>
        </div>
    );
};



export default ListTrain;
