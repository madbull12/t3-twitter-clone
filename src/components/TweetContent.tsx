import { useRouter } from 'next/router';
import React from 'react'
import { v4 } from 'uuid';

const TweetContent = ({ text }:{ text:string }) => {
    const router = useRouter()
  return (
    <p className="max-w-lg break-words text-xs  xs:text-sm md:text-base  ">
    {text?.split(" ").map((word: string) =>
      word.startsWith("#") ? (
        <span
          key={v4()}
          onClick={(e) => {
            e.stopPropagation();
            router.replace(
              {
                pathname: "/search",
                query: {
                  ...router.query, // list all the queries here
                  f: router.query.q ? router.query.f : "top",
                  q: word,
                },
              },
              undefined,
              {
                shallow: true,
              }
            );
          }}
          className="truncate cursor-pointer text-primary hover:underline"
        >
          {word + " "}
        </span>
      ) : (
        <span key={v4()} className="">{word + " "}</span>
      )
    )}
  </p>
  )
}

export default TweetContent