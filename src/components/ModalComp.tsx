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
  setData: (data: Data[]) => void
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

  function phoneAlreadyExists() {
    if (editedData.phone !== phone && data?.length) {
      return data.find((item) => item.phone === phone)
    }

    return false
  }

  async function handleSave() {
    if (!firstName || !lastName || !phone) {
      return
    }

    try {
      const response = await api.post('/users', { firstName, lastName, phone })

      if (phoneAlreadyExists()) {
        return alert('The phone number already exists.')
      }

      if (Object.keys(editedData).length) {
        data[editedData.index!] = { firstName, lastName, phone }
      }

      const newDataArray = !Object.keys(editedData).length
        ? [...(data || []), response.data]
        : [...(data || [])]

      setData(newDataArray)

      onClose()
    } catch (error) {
      console.error('Cannot register this contact.', error)
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
