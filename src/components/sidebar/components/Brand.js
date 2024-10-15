import React from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let mainText = useColorModeValue("navy.700", "white");	

  return (
    <Flex align='center' direction='column'>
    <Text
						color={mainText}
						bg='inherit'
						borderRadius='inherit'
						fontWeight='bold'
						fontSize='34px'
						_hover={{ color: { mainText } }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}>
						Bot interface Sections
					</Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
