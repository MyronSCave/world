import React, { useCallback, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Image, Select, Text } from '@chakra-ui/react';
import { ChatState } from '../components/Context/ChatProvider';
import { getStatesOfCountry, getCountryFlag } from '../assets/state';
import UpperNav from '../miscellenious/upperNav';
import axios from 'axios';
import { ClubRegistration } from '../Authentication/club';

export const Clubs = () => {
  const { user } = ChatState();
  const [subdivisions, setSubdivisions] = useState([]);
  const [clubs, setClubs] =useState([]);
  const [provience, setProvience] = useState(user?.provinces);
  const [fillForm, setFillForm] = useState(false);
  const navigate = useNavigate();
  const flag = getCountryFlag(user?.country);

  const fetchClubs = useCallback(async () => {
      if(!user){
        navigate('/dashboard');
        return
      }; 
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/clubs/${user.country}/${provience}`, config);
      setClubs(data);
      console.log(clubs);
    } catch (error) {
      console.error('Error fetching or creating clubs:', error);
    }
  }, [user.token, user._id, setClubs, provience]);

  useEffect(() => {
      if(!user) {
        navigate('/dashboard');
        return;
      }
    fetchClubs();
  }, [fetchClubs, navigate, user]);

  useEffect(() => {
    if(!user) navigate('/dashboard');

    const fetchSubdivisions = async () => {
      const states = getStatesOfCountry(user.country);
      setSubdivisions(states);
    };

    fetchSubdivisions();
  }, [user]);

  return (
    <Box display="flex" flexDir="column" backgroundColor="Background" width="100%" height={"100%"} position={"relative"}>
       <Box position={"fixed"} background={"Background"} zIndex={10} width="100%"><UpperNav/></Box>
      <Text textAlign="center" fontSize={"large"} fontWeight={"bold"} p={3 }mt={10}>
        Country: {user.country} {flag}
      </Text>
    <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} width={"100%"} backgroundColor="Background" >
    <FormControl id="provinces" isRequired textAlign={"center"} width={{ base: '100%', md: '80%' }}p={3}>
    <FormLabel textAlign={"center"}>Select State</FormLabel>
    <Select
      placeholder="Select your province"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      cursor={"auto"}
      value={provience}
      onChange={(e) => {
        setProvience(e.target.value);
        fetchClubs(e.target.value);
      }}
    >
      {subdivisions && subdivisions.map((subdivision) => (
        <option key={subdivision.value} value={subdivision.value} style={{ color: "black" }}>
          {subdivision.name}
        </option>
      ))}
    </Select>
  </FormControl>
  <Text fontSize={"larger"} fontWeight={"bold"} textColor={"darkgreen"} >
    Available Clubs in {provience}
  </Text>
  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"10rem"} m={3} borderRadius={3} width={{ base: '97%', md: '80%' }} >
     {clubs.length > 0 ?  clubs.map((club) => (
        <option key={club.code} style={{ color: "black" }}>
          <Button>{club.name}</Button>
        </option>
      )) :
      <Text display={"flex"} flexDir={"column"}><Image src='https://res.cloudinary.com/dvc7i8g1a/image/upload/v1708443842/icons8-here-80_oa8vme.png'/>
      <Text>No Clubs in this region</Text></Text>
      }
  </Box>

  {user.couch ? <Box m={2}>Your Club</Box>
   :  <Button display={"flex"} backgroundColor={"#c255ed"} borderRadius={20} onClick={ () => {setFillForm(true);}} m={2}>Make Your Club</Button>}
  </Box> 
  {fillForm && <ClubRegistration  onClose={() => setFillForm(false)}/>}
    </Box>
  );
};
