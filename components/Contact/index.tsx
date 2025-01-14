import {
  generateCSSFilter,
  MinimalContactFormProps,
  polkaPattern,
} from "@atlascode/core";
import { Box, useTheme, useMediaQuery, Container } from "@material-ui/core";
import React from "react";
import MinimalContactForm from "../minimal-contact-form/MinimalContactForm";
import { useRouter } from "next/router";
import submitContactDialog from "../GlobalContactDialog/helpers";
import { alertStore } from "../Alerts/store";
import useContactForm from "../../hooks/useContactForm";
import { GTMDataLayerEvent } from "../GoogleTagManager/lib";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContactProps extends MinimalFormPicOverBlobProps {}

const Contact = (props: ContactProps) => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          px: { xs: "0rem", lg: "4rem" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
            ...(polkaPattern("#fff", 0.1, 40, "#6d6d6d") as Record<
              string,
              unknown
            >),
          }}
        />

        <MinimalFormPicOverBlob picture={<PicComponent />} {...props} />
      </Box>
    </Container>
  );
};

export default Contact;

const PicComponent = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bottom: 0,
        left: 0,
        position: "absolute",
        display: { xs: "none", lg: "block" },

        img: {
          pt: { xs: "75px !important" },
        },
      }}
    >
      <Box
        component="img"
        src="/images/young-doc-female-2.png"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

/* eslint-disable-next-line */
export interface MinimalFormPicOverBlobProps {
  formProps?: MinimalContactFormProps;
  blobColor?: "primary" | "secondary";
  desktopPicture?: JSX.Element;
  picture?: JSX.Element;
}

export function MinimalFormPicOverBlob({
  formProps,
  blobColor = "primary",
  desktopPicture,
  picture,
}: MinimalFormPicOverBlobProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [blobFilter, setBlobFilter] = React.useState<string>("none");

  React.useEffect(() => {
    const filterResult = generateCSSFilter(theme.palette[blobColor].main);

    setBlobFilter(filterResult);
  }, [blobColor, theme.palette]);

  const router = useRouter();

  const dispatchAlert = alertStore((state) => state.dispatch);

  const contactForm = useContactForm(
    async ({ email, message, name, phone }, actions) => {
      actions.setSubmitting(true);
      dispatchAlert({ message: "Enviando sua mensagem", severity: "info" });
      try {
        const response = await submitContactDialog(name, email, message, phone);
        dispatchAlert({
          message: "Mensagem enviada com sucesso!",
          severity: "success",
        });
        actions.resetForm();

        GTMDataLayerEvent({
          event: "contato",
          nome: name,
          email: email,
          telefone: phone,
          mensagem: message,
          timestamp: `${new Date(Date.now()).toLocaleString("pt-br")}`,
        });

        router.push("/contato-efetuado");
      } catch (error) {
        dispatchAlert({
          message:
            "Houve um erro ao tentar enviar a sua mensagem, pedimos desculpas pela inconveniência.",
          severity: "error",
        });
        console.log("error");
      }

      actions.setSubmitting(false);
    }
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "auto", lg: "80vh" },
        overflow: "hidden",
        py: { xs: 5, lg: "initial" },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "40% 60%" },
          gridTemplateRows: { xs: "auto", lg: "none" },
          gridAutoFlow: "row",
          height: "100%",
        }}
      >
        <Box sx={{ alignSelf: "center", px: { xs: "3rem", lg: "0rem" } }}>
          <MinimalContactForm
            buttonProps={{
              label: "Enviar",
              onClick: contactForm.submitForm,
              disabled: !contactForm.isValid || contactForm.isSubmitting,
            }}
            emailInputProps={{
              value: contactForm.values.email,
              error: Boolean(contactForm.errors.email),
              helperText: contactForm.errors.email,
              name: "email",
              onChange: contactForm.handleChange,
              label: "E-mail",
              placeholder: "Ex. joao.alves@gmail.com",
            }}
            messageInputProps={{
              value: contactForm.values.message,
              error: Boolean(contactForm.errors.message),
              helperText: contactForm.errors.message,
              name: "message",
              onChange: contactForm.handleChange,
              label: "Mensagem",
              placeholder: "Ex. Quero saber mais sobre as opções de...",
            }}
            nameInputProps={{
              value: contactForm.values.name,
              error: Boolean(contactForm.errors.name),
              helperText: contactForm.errors.name,
              name: "name",
              onChange: contactForm.handleChange,
              label: "Nome",
              placeholder: "Ex. John Alves",
            }}
            phoneInputProps={{
              value: contactForm.values.phone,
              error: Boolean(contactForm.errors.phone),
              helperText: contactForm.errors.phone,
              name: "phone",
              onChange: contactForm.handleChange,
              label: "Telefone",
              placeholder: "Ex. (99) 9-9988-7766",
            }}
            {...formProps}
          />
        </Box>
        <Box
          component="figure"
          sx={{
            display: { xs: "none", lg: "flex" },
            position: "relative",
            justifyContent: "center",
            transform: "translate3D(0px, 0px, 0px)",
            m: "0px",
            p: { xs: "0px", md: "10px 0px 0px 10px" },
          }}
        >
          <Box
            component="img"
            src={"/images/blob2.svg"}
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              filter: blobFilter,
              zIndex: -1,
              objectFit: { xs: "cover", lg: "contain" },
              left: 0,
            }}
          />

          <Box sx={{ width: "100%", height: "100%" }}>
            {isDesktop && desktopPicture ? desktopPicture : picture}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
