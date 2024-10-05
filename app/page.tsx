import Image from "next/image";
import Link from "next/link";
import React from "react";

interface memeData {
  id: string;
  name: string;
  url: string;
  box_count: number;
}

async function MemeGenerator() {
  const data = await fetch("https://api.imgflip.com/get_memes");
  const res = await data.json();
  const meme = await res.data.memes;
  return (
    <>
      <h1 className="text-[#2f3542] text-[33px] text-center font-semibold py-3">
        MEME GENERATOR
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        {meme.map((item: memeData) => {
          return (
            <div
              key={item.id}
              className="shadow-md p-5 m-2 flex justify-start items-center flex-col gap-3 bg-[#fdfffe] text-[#16a085]"
            >
              <img
                src={item.url}
                alt={item.name}
                style={{
                  width: "350px",
                  height: "350px",
                  objectFit: "cover", // Adjusts how the image fits into the container
                }}
              />

              <Link
                className="w-full"
                href={{
                  pathname: "generatememe/",
                  query: {
                    url: item.url,
                    boxCount: item.box_count,
                    id: item.id,
                    name: item.name,
                  },
                }}
              >
                <button className="btn btn-outline btn-primary w-full">
                  Create Meme
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MemeGenerator;
