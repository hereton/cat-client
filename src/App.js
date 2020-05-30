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
  const [selectedCatData, setSelectedCatData] = useState();
  const [currentSelectedCatData, setCurrentSelectedCatData] = useState();
  const [errorText, setErrorText] = useState("");
  const [image, setImage] = useState();

  function handleSelectedCat(selectedCat) {
    setSelectedCatData(selectedCat);
    setCurrentSelectedCatData(selectedCat);
    setIsEditMode(true);
    console.log(selectedCat);
  }
  async function handleDeleteSelectedCat(id) {
    console.log(id);
    setIsLoading(true);

    const result = await axios.delete("http://52.23.233.214:3000/item/" + id);
    setIsLoading(false);
    if (result.status === 200) {
      const result = await axios.get("http://52.23.233.214:3000/item");
      console.log(result.data.data);
      if (result.data.data) {
        setCatList(result.data.data);
        setIsLoading(false);
      }
    }
  }

  async function handleInputFile(e) {
    console.log("sent to server");
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
      // const result = await axios.post("http://52.23.233.214:3000/upload", {
      //   file: imageFile,
      // });
      // console.log(result);
    }
  }

  async function handleEditSubmit(value, image) {
    console.log(value);
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);

    const responed = await axios.post(
      "http://52.23.233.214:3000/upload",
      formData
    );

    console.log("responed from upload ", responed.data);
    setIsLoading(true);
    if (value.name !== undefined && value.price !== undefined) {
      console.log("post data", { ...value });
      const params = {
        name: value.name,
        price: value.price,
        imgUrl: responed.data.imgUrl,
      };
      setIsLoading(true);
      const result = await axios.put(
        "http://52.23.233.214:3000/item/" + value.id,
        params
      );
      setErrorText("");
      console.log(result.status === 200);
      if (result.status === 200) {
        const result = await axios.get("http://52.23.233.214:3000/item");
        console.log(result.data.data);
        if (result.data.data) {
          setIsLoading(false);
          setCatList(result.data.data);
          setImage(null);
        }
      }

      console.log("complete upload to server.");
    } else {
      setErrorText("Please complete input");
    }
  }
  async function handleSubmit(value, image) {
    const formData = new FormData();
    formData.append("image", image);
    setIsLoading(true);

    const responed = await axios.post(
      "http://52.23.233.214:3000/upload",
      formData
    );
    console.log("responed from upload ", responed.data);

    if (value.name !== undefined && value.price !== undefined) {
      const params = {
        name: value.name,
        price: value.price,
        imgUrl: responed.data.imgUrl,
      };
      console.log(params);
      const result = await axios.post(
        "http://52.23.233.214:3000/item/",
        params
      );
      setErrorText("");
      console.log(result);
      console.log(result.status === 200);
      if (result.status === 200) {
        const result = await axios.get("http://52.23.233.214:3000/item");
        console.log(result.data.data);
        if (result.data.data) {
          setIsLoading(false);
          setCatList(result.data.data);
          setImage(null);
        }
      }

      console.log("complete upload to server.");
    } else {
      setErrorText("Please complete input");
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
                key={cat.id + index.toString()}
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
        <Box>
          <Box align="center"> Loading </Box>{" "}
        </Box>
      )}
      <Box>{errorText.length > 0 ? <Box>{errorText}</Box> : <></>}</Box>
      {isEditMode ? (
        <Box align="center">
          <Text weight="bold" margin={{ top: "medium" }}>
            Edit selected cat !!
          </Text>

          <Form
            value={currentSelectedCatData}
            onChange={(nextValue) => setCurrentSelectedCatData(nextValue)}
            onReset={() => setCurrentSelectedCatData(selectedCatData)}
            onSubmit={({ value }) => handleEditSubmit(value, image)}
          >
            <FormField name="id" htmlfor="textinput-id" label="ID">
              <TextInput id="textinput-id" name="id" disabled={true} />
            </FormField>
            <FormField name="name" htmlfor="textinput-id" label="Name" required>
              <TextInput id="textinput-id" name="name" />
            </FormField>
            <FormField
              name="price"
              htmlfor="textinput-id"
              label="Price"
              required
            >
              <TextInput id="textinput-id" name="price" required />
            </FormField>
            <FormField
              name="imgUrl"
              htmlfor="textinput-id"
              label="Upload new image"
            >
              <input
                type="file"
                id="textinput-id"
                name="imgUrl"
                accept="image/*"
                onChange={(e) => handleInputFile(e)}
                required
              />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Edit Cat" />
              <Button type="reset" label="Reset" />
              <Button
                label="Delete"
                onClick={() => handleDeleteSelectedCat(selectedCatData.id)}
              />
              <Button label="Cancel" onClick={() => setIsEditMode(false)} />
            </Box>
          </Form>
        </Box>
      ) : (
        <Box align="center">
          <Text weight="bold" margin={{ top: "medium" }}>
            Add more cats !!
          </Text>

          <Form onSubmit={({ value }) => handleSubmit(value, image)}>
            <FormField name="name" htmlfor="textinput-id" label="Name" required>
              <TextInput id="textinput-id" name="name" />
            </FormField>
            <FormField
              name="price"
              htmlfor="textinput-id"
              label="Price"
              required
            >
              <TextInput id="textinput-id" name="price" />
            </FormField>
            <FormField name="imgUrl" htmlfor="textinput-id" label="Image">
              <input
                type="file"
                id="textinput-id"
                name="imgUrl"
                accept="image/*"
                onChange={(e) => handleInputFile(e)}
                required
              />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
              <Button
                type="reset"
                label="Reset"
                onClick={() => {
                  setErrorText("");
                }}
              />
            </Box>
          </Form>
        </Box>
      )}
    </Main>
  );
}

export default App;

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
      name: "Totsapon",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
    {
      name: "Totsapon",
      price: 200,
      imgUrl: "https://thestandard.co/wp-content/uploads/2020/02/25-1.jpg",
    },
  ];
}
