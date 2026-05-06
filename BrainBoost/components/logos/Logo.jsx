import React from 'react';
import { SvgXml } from 'react-native-svg'; 
import { googleLogoSVG, facebookLogoSVG } from './logoPath'; 

const Logos = ({ logoType, size = 36 }) => {
  const logoSVG = logoType === 'google' ? googleLogoSVG : facebookLogoSVG;

  return (
    <SvgXml 
      xml={logoSVG} 
      width={size} 
      height={size} 
    />
  );
};

export default Logos;
