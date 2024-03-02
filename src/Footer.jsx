import React from "react";
import packageJson from '../package.json';
import { APP_INFO } from '../config';

export const Footer = () => {
  return (
    <footer id="footer">
      <div className="container-fluid">
        <p className="text-muted">{APP_INFO}</p>
        <p className="text-muted">Version: {packageJson.version}</p>
      </div>
    </footer>
  );
};

export default Footer;
