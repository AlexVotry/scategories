import {find} from 'lodash';

export const assignTeam = (teams, user) => {
 for (const [team, users] of Object.entries(teams)) {
   const currentUser = find(users, { 'name': user.name }) 
   if (currentUser) return team; 
 }
 return null;
}

export const findOthers = (team, user) => {
  // const currentUser = find(team, {'name': user.name });
  return team.filter(others => others.name !== user.name);
}
