import React from "react";

import { MiruLogoSVG } from "miruIcons";

interface Props {
  email: string;
}
const PasswordResetLinkSentMsg = ({ email }: Props) => (
  <div className="w-full px-8 pt-16 pb-4 md:px-0 md:pt-36">
    <div className="mx-auto min-h-full md:w-5/12 lg:w-352">
      <div>
        <img
          alt="miru-logo"
          className="d-block mx-auto mb-20"
          height="64"
          src={MiruLogoSVG}
          width="64"
        />
      </div>
      <h1 className="text-center font-manrope text-4xl font-extrabold text-miru-han-purple-1000">
        Password reset link sent
      </h1>
      <div className="pt-20">
        <p className="text-center font-manrope text-sm text-miru-dark-purple-1000 ">
          A password reset link has been sent to your email ID:
          <span className="font-manrope font-bold">{email}</span>
        </p>
      </div>
    </div>
  </div>
);

export default PasswordResetLinkSentMsg;
