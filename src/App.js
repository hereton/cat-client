import React, { useState, useEffect } from "react";
import {
  Box,
  Main,
  Heading,
  Form,
  FormField,
  TextInput,
  Button,
  Image,
  Text,
} from "grommet";
import axios from "axios";

function App() {
  const [catList, setCatList] = useState(getInitCatList());
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCat, setSelectedCat] = useState();

  function handleSelectedCat(selectedCat) {
    setSelectedCat(selectedCat);
    setIsEditMode(true);
    console.log(selectedCat);
  }
  async function handleSubmit(value) {
    if (
      value.name !== undefined &&
      value.price !== undefined &&
      value.imgUrl !== undefined
    ) {
      console.log("post data", { ...value });
      setIsLoading(true);
      const result = await axios.post("http://52.23.233.214:3000/item/", {
        ...value,
      });
      setIsLoading(false);
      console.log(result);

      console.log("complete upload to server.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("sadsa");
      const result = await axios.get("http://52.23.233.214:3000/item");
      console.log(result.data.data);
      if (result.data.data) {
        setCatList(result.data.data);
      }
    };
    fetchData();
  }, []);

  return (
    <Main pad="large">
      <Heading>CAT STORE</Heading>

      <Box>
        <Heading>CAT LIST</Heading>
      </Box>
      {!isLoading ? (
        <Box direction="row-responsive" align="center" wrap>
          {catList.map((cat, index) => {
            return (
              <Box
                margin="small"
                onClick={() => {
                  handleSelectedCat(cat);
                }}
              >
                <Image
                  style={{ width: "300px", height: "150px" }}
                  src={cat.imgUrl}
                />
                <Box align="center">
                  <Text>ID : {cat.id}</Text>
                </Box>
                <Box align="center">
                  <Text>Name : {cat.name}</Text>
                </Box>
                <Box align="center">
                  <Text>Price : {cat.price}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box> loading </Box>
      )}
      {isEditMode ? (
        <Box align="center">
          <Form onSubmit={({ value }) => handleEditSubmit(value)}>
            <FormField name="id" htmlfor="textinput-id" label="ID">
              <TextInput
                id="textinput-id"
                name="id"
                value={selectedCat.id}
                disabled={true}
              />
            </FormField>
            <FormField name="id" htmlfor="textinput-id" label="Name">
              <TextInput id="textinput-id" name="id" />
            </FormField>
            <FormField name="price" htmlfor="textinput-id" label="Price">
              <TextInput id="textinput-id" name="price" />
            </FormField>
            <FormField name="imgUrl" htmlfor="textinput-id" label="Link">
              <TextInput id="textinput-id" name="imgUrl" />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
              <Button type="reset" label="Reset" />
              <Button label="Delete" />
              <Button label="Cancel" onClick={() => setIsEditMode(false)} />
            </Box>
          </Form>
        </Box>
      ) : (
        <Box align="center">
          <Form onSubmit={({ value }) => handleSubmit(value)}>
            <FormField name="name" htmlfor="textinput-id" label="Name">
              <TextInput id="textinput-id" name="name" />
            </FormField>
            <FormField name="price" htmlfor="textinput-id" label="Price">
              <TextInput id="textinput-id" name="price" />
            </FormField>
            <FormField name="imgUrl" htmlfor="textinput-id" label="Link">
              <TextInput id="textinput-id" name="imgUrl" />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        </Box>
      )}
    </Main>
  );
}

export default App;

async function handleEditSubmit(value) {
  console.log(value);
}

function getInitCatList() {
  return [
    {
      name: "varit",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
    {
      name: "Totsapon",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
    {
      name: "Prayus",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
    {
      name: "varit",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
    {
      name: "Totsapon",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
    {
      name: "Prayus",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
  ];
}
