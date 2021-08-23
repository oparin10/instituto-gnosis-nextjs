import { EMAIL_API_ROUTES, FORM_API_ROUTES } from 'apps/core/constants';
import axios, { AxiosResponse } from 'axios';

export const submitCourseFormDialog = async (
  name: string,
  email: string,
  message: string,
  phone: string,
  course: string,
  rejectionTest?: boolean
) => {
  try {
    // const emailRequest = await axios.post(EMAIL_API_ROUTES.course, {
    //   name: name,
    //   email: email,
    //   message: message,
    //   phone: phone,
    //   course: course,
    // });

    const saveToDbRequest = await axios.post(FORM_API_ROUTES.courseInterest, {
      name: name,
      email: email,
      message: message,
      phone: phone,
      course: course,
    });
  } catch (error) {
    console.log(error);
  }
};