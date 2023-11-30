import { DeleteIcon, PhoneIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ModalComp } from './components/ModalComp'
import { api } from './lib/axios'

export interface Data {
  firstName: string
  lastName: string
  phone: string
  index?: number
}

export function App() {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [data, setData] = useState<Data[]>([])
  const [editedData, setEditedData] = useState<Data>({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [searchValue, setSearchValue] = useState('')

  const filteredData = data.filter(({ lastName }) =>
    lastName.toLowerCase().includes(searchValue.toLowerCase()),
  )

  function handleRemove(phone: string) {
    const newArray = data.filter((item) => item.phone !== phone)

    setData(newArray)
  }

  async function fetchUsers() {
    const response = await api.get('/users')
    setData(response.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Flex h="100vh" align="center" justify="center" bg="#f6f6f6">
      <Box maxW={800} w="100%" h="100vh" py={10} px={2}>
        <Flex w="100%" align="center" justify="center" gap="20px">
          <PhoneIcon boxSize={6} />
          <Heading as="h1">Phone Book App</Heading>
        </Flex>

        <Flex
          w="100%"
          align="center"
          justify="space-between"
          pt="20px"
          pb="20px"
        >
          <Heading as="h2" size="lg">
            Contacts
          </Heading>
          <Button
            backgroundColor="#347bf6"
            color="white"
            onClick={() => [
              setEditedData({ firstName: '', lastName: '', phone: '' }),
              onOpen(),
            ]}
          >
            + Add Contact
          </Button>
        </Flex>

        <Box pt="20px" pb="20px">
          <InputGroup>
            <InputLeftElement>
              <SearchIcon color="gray" />
            </InputLeftElement>

            <Input
              bg="white"
              color="gray"
              placeholder="Search for contact by last name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Box>

        <Box overflow="auto" height="100%">
          <List spacing={3}>
            {filteredData.map(({ firstName, lastName, phone }, index) => (
              <ListItem
                key={index}
                cursor="pointer"
                p="16px"
                m="2px"
                backgroundColor="white"
              >
                <Flex w="100%" align="center" justify="space-between">
                  <Box w="100%">
                    <Heading as="h3" size="md">
                      {firstName} {lastName}
                    </Heading>
                    <Flex align="center">
                      <Text
                        as="span"
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray"
                      >
                        <PhoneIcon boxSize={3} /> {phone}
                      </Text>
                    </Flex>
                  </Box>

                  <Button backgroundColor="#cb444a" color="white">
                    <DeleteIcon
                      fontSize={20}
                      onClick={() => handleRemove(phone)}
                    />
                  </Button>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {isOpen && (
        <ModalComp
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          setData={setData}
          editedData={editedData}
          setEditedData={setEditedData}
        />
      )}
    </Flex>
  )
}
