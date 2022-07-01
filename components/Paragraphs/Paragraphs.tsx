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
    }: ParagraphsProps
) => {
  return <p  
     className={`${color} ${ fontSize}`}
  >
    {text}
  </p>
}

export default Paragraphs