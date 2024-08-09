import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdPersonAdd,
  MdPerson,
  MdPeople,
  MdMedicalServices,
  MdLogout,
} from "react-icons/md";

export const Sidebar = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleToggle = () => setIsAccountOpen(!isAccountOpen);

  const handleLogout = () => {
    onOpen();
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/log-in");
    onClose(); // Close the modal
  };

  const handleCancelLogout = () => {
    onClose(); // Close the modal
  };

  return (
    <>
      <Box
        width="230px"
        bg="teal.600"
        position="fixed"
        top="0"
        bottom="0"
        left="0"
        borderRight="1px"
        borderRightColor="gray.500"
        height="100vh"
        overflowY="auto"
        boxShadow="md"
        zIndex="sticky" // Ensures it's below the header
      >
        <Box
          p="4"
          borderBottom="1px"
          borderBottomColor="teal.500"
          textAlign="center"
        >
          <HStack>
            <Image
              borderRadius="7px"
              src="/logo.jpg" // Adjust the path as needed
              alt="Logo"
              boxSize="50px" // Adjust the size as needed
              objectFit="cover"
            />
            <Text fontSize="lg" fontWeight="bold" color="white" mt={2}>
              Chain Care
            </Text>
          </HStack>
        </Box>
        <VStack width="100%" alignItems="stretch" spacing={2} color="gray.50">
          <Link to="/admin?tab=summary">
            <Text
              fontSize="18px"
              fontWeight="bold"
              borderBottom="1px"
              borderBottomColor="teal.500"
              p="10px"
              _hover={{ bg: "teal.500" }}
              display="flex"
              alignItems="center"
            >
              <Box as="span" mr={2}>
                <MdMedicalServices />
              </Box>
              Patient Summary
            </Text>
          </Link>
          {/* Separate "Create Account" Section */}
          <Box borderBottomColor="teal.500">
            <Text
              fontSize="18px"
              fontWeight="bold"
              _hover={{ bg: "teal.500" }}
              borderBottom="1px"
              borderBottomColor="teal.500"
              p="10px"
              onClick={handleToggle}
              cursor="pointer"
              display="flex"
              alignItems="center"
            >
              <Box as="span" mr={2}>
                <MdPersonAdd />
              </Box>
              Create Account
              {isAccountOpen ? (
                <Box as="span" ml="auto">
                  <MdArrowDropUp />
                </Box>
              ) : (
                <Box as="span" ml="auto">
                  <MdArrowDropDown />
                </Box>
              )}
            </Text>
            <Collapse in={isAccountOpen}>
              <VStack alignItems="stretch" spacing={1}>
                <Link to="/admin?tab=create-receptionist">
                  <Text
                    pl="15px"
                    py="5px"
                    fontSize="16px"
                    borderBottom="1px"
                    _hover={{ bg: "teal.500" }}
                    borderBottomColor="teal.500"
                    display="flex"
                    alignItems="center"
                  >
                    <Box as="span" mr={2}>
                      <MdPerson />
                    </Box>
                    Create Receptionist
                  </Text>
                </Link>
                <Link to="/admin?tab=create-doctor">
                  <Text
                    _hover={{ bg: "teal.500" }}
                    fontSize="16px"
                    borderBottom="1px"
                    borderBottomColor="teal.500"
                    pl="15px"
                    py="5px"
                    display="flex"
                    alignItems="center"
                  >
                    <Box as="span" mr={2}>
                      <MdPerson />
                    </Box>
                    Create Doctor
                  </Text>
                </Link>
              </VStack>
            </Collapse>
          </Box>
          <Link to="/admin?tab=employees">
            <Text
              fontSize="18px"
              fontWeight="bold"
              borderBottom="1px"
              borderBottomColor="teal.500"
              _hover={{ bg: "teal.500" }}
              p="10px"
              display="flex"
              alignItems="center"
            >
              <Box as="span" mr={2}>
                <MdPeople />
              </Box>
              Employees
            </Text>
          </Link>
        </VStack>

        {/* Logout Button */}
        <Box px="4px" position="absolute" bottom="10px" width="100%">
          <Button
            leftIcon={<MdLogout />}
            colorScheme="green"
            width="100%"
            borderRadius="7px"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
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
