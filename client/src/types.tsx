import React from 'react';

export interface FunctionProp {
  [column: string]: Function;
}

export interface UserType {
  name?: string,
  team?: string,
  admin?: string,
  email?: string,
  group?: string
}

export interface UpdateContext {
  user: UserType;
  update: (data: object) => void;
}

