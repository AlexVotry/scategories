import { CSSProperties } from "react"

export const colors = {
  white: '#fff',
  blue: '#bababa'
}

export const styles = {
  flexRow: <CSSProperties> {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
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