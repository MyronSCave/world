import React, { useState } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import UpperNav from '../miscellenious/upperNav';

const CourseDetails = ({ courses }) => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);
  const course = courses.find((course) => course.id === courseId);
  console.log(course, courseId);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const goToNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentLesson = course.lessons[currentLessonIndex];

  return (
    <Box background={"Background"} width={"100%"}>
        <UpperNav/>
            <Text fontSize="24px" fontWeight="bold" mb={4}>
        {course.title}
      </Text>
    <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} background={"Background"} >
      <Box mb={4}>
        <Text fontSize="20px" fontWeight="medium">
          {currentLesson.title}
        </Text>
       <iframe
  title={`Lesson ${currentLesson.id}`}
  width="100%" // Set initial width, adjust as needed
  height="315"
  src={currentLesson.video}
  allowFullScreen
  style={{ maxWidth: '800px', margin: '0 auto' }}
></iframe>
        <Text mt={2}>{currentLesson.notes}</Text>
      </Box>
      <Box display="flex" alignItems={"center"} justifyContent="space-evenly" width={"100%"}>
        <Button onClick={goToPreviousLesson} disabled={currentLessonIndex === 0}>
          Previous Lesson
        </Button>
        <Button onClick={goToNextLesson} disabled={currentLessonIndex === course.lessons.length - 1}>
          Next Lesson
        </Button>
      </Box>
        </Box>
      
    </Box>
  );
};

export default CourseDetails;