import React from 'react';
import { mount } from 'cypress/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './commands';

Cypress.Commands.add('mount', mount);
