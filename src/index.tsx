import React from 'react'
import ReactDOM from 'react-dom'

export default function Index(): JSX.Element {
  return (
    <div>
      <h1>Typescript React App</h1>
    </div>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'));