import React from 'react'; 

export interface DropdownItem {
    title: string;
    description: string;
    linkText: string;
    imageSrc: string;
    altText: string;
    path: string;
  }
  
  export interface PlatformItem {
    title: string;
    description: string;
    linkText: string;
    imageSrc: string;
    altText: string;
    link: string;
  }
  
  export interface TeacherItem {
    name: string;
    icon: React.JSX.Element;
  }