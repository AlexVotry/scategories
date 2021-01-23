import React from 'react';
import { ScoreUpdate } from '../types';

export default React.createContext<ScoreUpdate | undefined> (undefined);