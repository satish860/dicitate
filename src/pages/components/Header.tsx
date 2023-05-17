import { Flex, Text, Button, Stack, Link } from "@chakra-ui/react";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <>
      <Flex
        bg="white"
        w="100%"
        p={2}
        verticalAlign="center"
        as="header"
        position="fixed"
      >
        <Text fontSize="4xl" color="green.400" ml="5">Speak</Text>
        <Text fontSize="4xl" color="black">Wise</Text>
        
        <Stack direction="row" ml="auto" alignItems="center">
          {/* <SignedIn>        */}
            {/* <UserButton afterSignOutUrl="/"/> */}
          {/* </SignedIn>
          <SignedOut> */}
            <Link href="/sign-in">
              <Button
                colorScheme={"green"}
                bg={"green.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Sign In
              </Button>
            </Link>
          {/* </SignedOut> */}
        </Stack>
      </Flex>
    </>
  );
}