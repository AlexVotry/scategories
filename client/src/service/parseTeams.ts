import _ from 'lodash';

export const assignTeam = (teams, user) => {
 for (const [team, users] of Object.entries(teams)) {
   const currentUser = _.find(users, { 'name': user.name }) 
   if (currentUser) return team; 
 }
 return null;
}
