import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdHome, MdLock } from 'react-icons/md';
import { useParams } from 'react-router-dom';

// Admin Imports
import MainDashboard from 'views/admin/default';
import CreateStrategyModal from 'views/admin/default/components/createstrategy';
import EditStrategyForm from 'views/admin/default/components/editstrategy';
import Logger from 'views/admin/default/components/logger';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const EditStrategyWrapper = () => {
  const { strategyid, selectedPairs } = useParams();
  return <EditStrategyForm strategyid={strategyid} selectedPairs={selectedPairs} />;
};

const routes = [
  {
    name: 'Bot Admin interface',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    element: <MainDashboard />,
  },
  {
    name: 'Edit Strategy',
    layout: '/admin',
    path: '/edit/:strategyid/:selectedPairs',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    element: <EditStrategyWrapper />
  },
  {
    name: 'Create Strategy',
    layout: '/admin',
    path: '/create',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    element: <CreateStrategyModal />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    element: <SignInCentered />,
  },
  {
    name: 'Logger',
    layout: '/admin',
    path: '/logger',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    element: <Logger />,
  },
];

export default routes;
