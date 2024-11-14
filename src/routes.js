import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdHome, MdLock, MdList } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import CreateStrategyModal from 'views/admin/default/components/createstrategy';
import EditStrategyForm from 'views/admin/default/components/editstrategy';
import StrategiesList from 'views/admin/default/components/strategylist';
import Logger from 'views/admin/default/components/logger';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Home',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Edit Strategy',
    layout: '/admin',
    path: '/edit',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <EditStrategyForm />
  },
  {
    name: 'Strategy',
    layout: '/admin',
    path: '/strategylist',
    icon: <Icon as={MdList} width="20px" height="20px" color="inherit" />,
    component: <StrategiesList />
  },
  {
    name: 'Create Strategy',
    layout: '/admin',
    path: '/create',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <CreateStrategyModal />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Logs',
    layout: '/admin',
    path: '/logger',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Logger />,
  },
];

export default routes;
