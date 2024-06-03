import { Box, Text, Image } from "@chakra-ui/react";
import React from "react";

const Print = React.forwardRef((props, ref) => {
  return (
    <Box ref={ref} display="none" p={4} bg="white" color="black" fontSize="md">
      <Image
        src={props.imageSrc}
        alt="Profile Picture"
        boxSize="100px"
        borderRadius="full"
        mb={4}
      />
      <Text fontSize="lg" fontWeight="bold" color="teal.500" mb={2}>
        Patient Name: {props.patientName}
      </Text>
      <Text fontSize="lg" fontWeight="bold" color="teal.500" mb={2}>
        Guardian Name: {props.guardianName}
      </Text>
      <Text fontSize="lg" fontWeight="bold" color="teal.500" mb={2}>
        Phone Number: {props.phoneNumber}
      </Text>
      <Text fontSize="lg" fontWeight="bold" color="teal.500">
        NIC: {props.NIC}
      </Text>
    </Box>
  );
});

export default Print;
