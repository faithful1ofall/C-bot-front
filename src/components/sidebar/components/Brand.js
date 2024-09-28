import React from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let mainText = useColorModeValue("navy.700", "white");	

  return (
    <Flex align='center' direction='column'>
    {/*   <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
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
