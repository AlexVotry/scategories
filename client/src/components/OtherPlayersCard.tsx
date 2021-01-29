// shows the scategory list (PlayerList component), letter, timer, and control buttons for each team. 

import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import OthersGameSheet from './OthersGameSheet';
import Timer from './Timer';
import Letter from './Letter/Letter';
import ControlButtons from './ControlButtons';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import { styles, colors } from '../cssObjects';
import { findOthers } from '../service/parseTeams';
import socket from '../service/socketConnection';

const OtherPlayersCard = () => {
  const [teammates, setTeammates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cardHeight, setCardHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const { user } = useContext(UserContext);
  const teams = useContext(TeamsContext);
  const team = teams[user.team];
  const others = findOthers(team, user);
  console.log('win:', windowHeight, 'header:', headerHeight, 'card:', cardHeight);
  const otherCard = {
    ...styles.flexColumn,
    width: '55vw'
  }
  const cardStyle = {
    ...styles.flexRow,
    backgroundColor: colors[user.team],
    color: colors.White,
    padding: '10px'
  }
  const listStyle = {
    alignItems: 'flex-start',
    padding: '20px',
    width: '100%',
    border: '4px ridge white'
  }
  
  const userStyle = {
    ...styles.speechBox,
    borderColor: '#39CCCC',
    color: '#39CCCC',
  }
  
  const otherStyle = {
    ...styles.speechBox,
    borderColor: '#85144b',
    color: '#85144b',
    alignSelf: 'flex-end'
  }
  
  const scrollBarStyle = {
    width: 500,
    height: windowHeight - headerHeight - cardHeight - 200
  }
  console.log(scrollBarStyle);
  
  const renderOthers = () => {
    return others.map(({name}) => {
      return (
        <div className="eachlistOther" key={name} style={listStyle}>
          <div className="ListName" style={{textAlign: 'center', marginBottom: '10px'}}>{name}</div>
          <OthersGameSheet name={name}/>
        </div>
      )
    })
  }


  const showMessages = () => {
    if (!messages.length) return;
    return messages.map(({message, name}, index) => {
      const teamStyle = name === user.name ? userStyle : otherStyle;
      const eachMessage = name === user.name ? 'userMessage' : 'otherMessage';
      return (
        <div className={eachMessage} key={`${name}_${index}`} style={teamStyle}>
          <div className="messageFrom" style={styles.italicsBold}>{name}</div>
          <div className="messageText">{message}</div>
        </div>
      );
    });
  }

  useEffect (() => {
    let mounted = true;
    if (mounted) {
      setCardHeight(document.getElementById('otherPlayers').clientHeight);
      setHeaderHeight(document.getElementById('leaderboard').clientHeight);
      setWindowHeight(window.innerHeight);
      socket.on('updateMessage', newMessages => {
        setMessages(arr => [...arr, newMessages]);
      });
    }
    return () => mounted = false;
  }, []);

  return (
    <div className="otherCard" style={otherCard}>
      <div id="otherPlayers" className="otherPlayers" style={cardStyle} >
        {renderOthers()}
      </div>
      <Scrollbars style={scrollBarStyle} >
        <div className="messages" style={styles.messages}>
          {showMessages()}
        </div>
      </Scrollbars>
    </div>
  )
}

export default OtherPlayersCard;