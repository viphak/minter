import React from 'react';
import { useLocation } from 'wouter';
import { Flex, Text, Heading, Image, Link } from '@chakra-ui/react';
import { MinterButton, MinterLink } from '../common';
import logo from './logo.svg';

export default function SplashPage() {
  const [, setLocation] = useLocation();
  return (
    <Flex bg="brand.background" pos="absolute" w="100%" h="100%">
      <Flex
        align="center"
        justifyContent="space-between"
        width="100%"
        flexDir="column"
      >
        <Flex flexDir="column" align="center" maxW="600px" pt={20}>
          <Image src={logo} maxW="200px" pb={40} />
          <Heading color="white" size="xl" pb={8}>
            Create NFTs on Tezos
          </Heading>
          <Heading
            color="white"
            size="md"
            textAlign="center"
            pb={12}
            opacity=".8"
          >
            Create and mint a new non-fungible token by using our simple
            interface. Just connect your Tezos account.
          </Heading>
          <Flex minW="400px" alignItems="stretch" pb={20}>
            <MinterButton variant="secondaryAction">
              Connect your wallet
            </MinterButton>
            <MinterLink
              variant="primaryAction"
              marginLeft={4}
              flex="1"
              href="/create-non-fungible"
              onClick={e => {
                e.preventDefault();
                setLocation('/create-non-fungible');
              }}
            >
              Create
            </MinterLink>
          </Flex>
          <Text fontFamily="mono" fontSize="xs" color="brand.lightGray">
            Learn more about <Link textDecor="underline">TZIP-12</Link>
          </Text>
        </Flex>
        <Flex
          width="100%"
          bg="brand.darkGray"
          color="brand.lightGray"
          fontFamily="mono"
          paddingX={10}
          paddingY={4}
          justifyContent="space-between"
        >
          <Text fontSize="xs">
            &copy; OpenMinter, Inc. All rights reserved. Currently v1.0.0-beta1.
          </Text>
          <Flex>
            <Link fontSize="xs" textDecor="underline">
              Terms
            </Link>
            <Link fontSize="xs" textDecor="underline" ml={4}>
              Privacy Policy
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}