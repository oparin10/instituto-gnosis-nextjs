import React from "react";
import Script, { ScriptProps } from "next/script";

// GTM-PKZC7DV

export interface GTMScriptInjectProps extends ScriptProps {
  GTM_ID: string;
}

const GTMScriptInject = ({
  GTM_ID = "",
  strategy = "afterInteractive",
  dangerouslySetInnerHTML = {
    __html: ``,
  },
  ...ScriptProps
}: GTMScriptInjectProps) => {
  return (
    <Script
      strategy={strategy}
      dangerouslySetInnerHTML={{ __html: GTM_INIT_HEAD_SCRIPT(GTM_ID) }}
      {...ScriptProps}
    />
  );
};

export default GTMScriptInject;

const GTM_INIT_HEAD_SCRIPT = (gtm_id: string) => `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm_id}');
`;
