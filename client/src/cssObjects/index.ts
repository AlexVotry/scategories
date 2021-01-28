import { CSSProperties } from "react"

export const colors = {
  White: '#fff',
  Blue: '#2574a9',
  Red: '#96281b',
  Green: '#049372',
  Purple: '#674172',
  Gold: '#f2d984'

}

export const styles = {
  flexRow: <CSSProperties> {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flexColumn: <CSSProperties> {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  flexPlayers: <CSSProperties> {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  flexHeader: <CSSProperties> {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  hover: <CSSProperties> {
    display: 'block'
  },
  none: <CSSProperties> {
    display: 'none'
  },
  bottomRight: <CSSProperties> {
    position: 'absolute',
    right: '20px',
    bottom: '20px'
  },
  messages: <CSSProperties> {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '10px'
  },
  speechBox: <CSSProperties> {
    borderStyle: 'solid',
    borderWidth: '2px',
    padding: '5px',
    borderRadius: '10px',
    position: 'relative',
  },
  italicsBold: <CSSProperties> {
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  messageLabel: <CSSProperties> {
    fontWeight: 'bold',
    fontColor: 'black'
  }
}