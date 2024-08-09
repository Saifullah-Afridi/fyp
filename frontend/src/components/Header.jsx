import React, { useState } from "react";
import {
  Button,
  Heading,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("user");

  const handleLogout = () => {
    onOpen();
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/log-in");
    onClose(); // Close the modal
  };

  const handleCancelLogout = () => {
    setLogoutConfirmed(false);
    onClose(); // Close the modal
  };

  return (
    <>
      <HStack
        maxW="95%"
        mx="auto"
        justify="space-between"
        borderBottom="2px solid"
        borderColor="gray.200"
        py="5px"
        shadow="sm"
      >
        <HStack spacing={1}>
          <Image src="/logo.jpg" alt="MHS Logo" boxSize="50px" />
          <Heading as="h1" size="lg">
            PDMS
          </Heading>
        </HStack>
        <HStack gap="15px">
          {isAuthenticated && (
            <Button colorScheme="blue" onClick={handleLogout}>
              Log out
            </Button>
          )}
          {!isAuthenticated && <Text>Welcome! Please log in.</Text>}
        </HStack>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to log out?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleConfirmLogout} mr={3}>
              Yes
            </Button>
            <Button colorScheme="gray" onClick={handleCancelLogout}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
