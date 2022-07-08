import React from 'react'


interface ParagraphsProps {
  text: string;
  className?: string;
  color?: string;
  font?: string;
  fontSize?: string;
}


const Paragraphs = (
  {
    text,
    fontSize,
    color,
    className
  }: ParagraphsProps
) => {
  return <p
    className={`${color} ${fontSize} ${className}`}
  >
    {text}
  </p>
}

export default Paragraphs