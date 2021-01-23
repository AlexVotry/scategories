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
  flexPlayers: <CSSProperties> {
    display: 'flex',
    flexDirection: 'row',
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
  }
}