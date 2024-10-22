import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Logger from './logger';

const LoggerDropdown = () => {

    const [showLogger, setShowLogger] = useState(false);

    const handleToggleLogger = () => {
      setShowLogger(!showLogger);
    };

  return (
    <div>
        <Button
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            onClick={handleToggleLogger}
        >
            Logger Menu
        </Button>
        {showLogger && (
            <div style={{ marginTop: '10px' }}>
            <Logger />
            </div>
        )}
    </div>
  );
};

export default LoggerDropdown;