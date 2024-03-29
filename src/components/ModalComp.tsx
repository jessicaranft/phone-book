import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Data } from '../App'
import { api } from '../lib/axios'

interface ModalCompProps {
  data: Data[]
  editedData: Data
  isOpen: boolean
  setData: React.Dispatch<React.SetStateAction<Data[]>>
  onClose: () => void
  setEditedData: (data: Data) => void
}

export function ModalComp({
  data,
  setData,
  editedData,
  isOpen,
  onClose,
}: ModalCompProps) {
  const [firstName, setFirstName] = useState(editedData.firstName || '')
  const [lastName, setLastName] = useState(editedData.lastName || '')
  const [phone, setPhone] = useState(editedData.phone || '')

  async function handleSave() {
    if (!firstName || !lastName || !phone) {
      return
    }

    try {
      const newContact = { firstName, lastName, phone }

      if (editedData.id !== undefined && editedData.id !== null) {
        await api.put(`/users/${editedData.id}`, newContact)

        const newDataArray = [...data]
        newDataArray[editedData.index!] = { ...editedData, ...newContact }

        setData(newDataArray)
      } else {
        const response = await api.post('/users', newContact)
        setData((prevData) => [...prevData, response.data])
      }

      onClose()
    } catch (error) {
      console.error('Error during API request:', error)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Contact</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl display="flex" flexDir="column" gap={4}>
              <Box>
                <FormLabel>First name</FormLabel>
                <Input
                  type="text"
                  value={firstName}
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Box>

              <Box>
                <FormLabel>Last name</FormLabel>
                <Input
                  type="text"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Box>

              <Box>
                <FormLabel>Phone number</FormLabel>
                <Input
                  type="tel"
                  value={phone}
                  placeholder="XXX-XXX-XXXX"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>
            </FormControl>

            <ModalFooter justifyContent="start">
              <Button colorScheme="green" mr={3} onClick={handleSave}>
                Save Contact
              </Button>

              <Button colorScheme="red" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
