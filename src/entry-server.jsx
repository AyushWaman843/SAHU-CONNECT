import React from 'react';
import {renderToString} from 'react-dom/server';
import App,{routes} from './App';
export const paths=Object.keys(routes);
export const render=path=>renderToString(<App path={path}/>);
