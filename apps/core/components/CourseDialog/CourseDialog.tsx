import useContactForm from 'apps/core/hooks/useContactForm';
import React from 'react';
import ContactFormDialog from '../contact-form-dialog/ContactFormDialog';
import { courseDialogStore } from './store';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props {}

const CourseDialog = (props: Props) => {
  const courseDialogOpen = courseDialogStore((state) => state.open);
  const toggleCourseDialog = courseDialogStore(
    (state) => state.toggleVisibility
  );
  const courseDialogInfo = courseDialogStore((state) => state.courseInfo);

  const router = useRouter();

  const form = useContactForm((values, actions) => {
    if (process && process.env.NODE_ENV === 'production') {
      axios
        .post(
          'https://us-central1-atlascodedev-landing.cloudfunctions.net/api/sendMail/gnosis-curso',
          {
            name: values.name,
            email: values.email,
            message: values.message,
            phone: values.phone,
            course: `${courseDialogInfo.name} - ${courseDialogInfo.area} - ${courseDialogInfo.level}`,
          }
        )
        .then((result) => {
          router.push('/contato-efetuado');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      router.push('/contato-efetuado');
    }
  });

  return (
    <ContactFormDialog
      cancelLabel="Cancelar"
      submitLabel="Enviar"
      subtitle="Preencha o formulário e em breve um de nossos representantes entrará em contato para atendê-lo!"
      DialogProps={{ disablePortal: true, open: courseDialogOpen }}
      open={courseDialogOpen}
      title={`Manifestação de interesse - Curso de ${courseDialogInfo.level} - ${courseDialogInfo.area} - ${courseDialogInfo.name} `}
      handleClose={() => toggleCourseDialog(false)}
      nameInputProps={{
        name: 'name',
        value: form.values.name,
        error: Boolean(form.errors.name),
        helperText: form.errors.name,
        onChange: form.handleChange,
        label: 'Nome',
        placeholder: 'Ex. João Alves',
      }}
      emailInputProps={{
        name: 'email',
        value: form.values.email,
        error: Boolean(form.errors.email),
        helperText: form.errors.email,
        onChange: form.handleChange,
        placeholder: 'Ex. john.alves@gmail.com',
      }}
      messageInputProps={{
        name: 'message',
        value: form.values.message,
        error: Boolean(form.errors.message),
        onChange: form.handleChange,
        helperText: form.errors.message,
        label: 'Mensagem',
        placeholder: 'Ex. Gostaria de mais informações sobre como funciona...',
      }}
      phoneInputProps={{
        name: 'phone',
        value: form.values.phone,
        error: Boolean(form.errors.phone),
        helperText: form.errors.phone,
        onChange: form.handleChange,
        label: 'Telefone',
        placeholder: 'Ex. (99) 9-9988-7766',
      }}
      isSubmiting={form.isSubmitting || !form.isValid}
      onSubmit={form.submitForm}
    />
  );
};

export default CourseDialog;