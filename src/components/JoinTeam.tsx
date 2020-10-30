import React, {useState} from 'react';
import Select from 'react-select';

const JoinTeam = () => {
  const [team, setTeam] = useState('select...');
  const [name, setName] = useState('');
  const options = [
    { value: 'blue', label: 'Blue'},
    { value: 'red', label: 'Red'},
    { value: 'green', label: 'Green'},
    { value: 'purple', label: 'Purple'},
    { value: 'gold', label: 'Gold'}
  ]

  const handleChange = (e) => {
    setTeam(e.value);
    console.log('e', e);
  }

  const handleSubmit = (event) => {
    
    alert('Your favorite team is: '+ team + name);
    event.preventDefault();
  }

  return (
    <div className="row">
      <form className="col s12" onSubmit={handleSubmit}>
        <div className="row">
          <div className="input-field col s6">
            <label>Team Color  </label>
              <Select 
                label="Single select"
                options={options}
               value={team}
               onChange={value => {
                 handleChange(value);
                }}
                placeholder={team}
              />
          
          </div>

          <div className="input-field col s6">
            <input id="first_name" 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}/>
            <label htmlFor="first_name">First Name</label>
          </div>

        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )

}

export default JoinTeam;