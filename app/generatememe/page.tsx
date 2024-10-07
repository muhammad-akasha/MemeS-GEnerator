"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../loading";

interface GeneratorProps {
  searchParams: {
    url: string;
    boxCount: string;
    id: string;
    name: string;
  };
}

const MemeGeneratorPage = ({ searchParams }: GeneratorProps) => {
  const { url, id, boxCount, name } = searchParams;
  const [loading, setLoading] = useState<boolean>(false);
  const [inputTexts, setInputTexts] = useState<string[]>([]); // Array to hold the text values for each input
  const [memeUrl, setMemeUrl] = useState<string | null>(null); // State to hold the generated meme URL
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // State to hold the blob URL

  useEffect(() => {
    if (boxCount) {
      const count = parseInt(boxCount);
      setInputTexts(Array(count).fill(" ")); // Initialize inputTexts with spaces
    }
  }, [boxCount]);

  const handleInput = (index: number, value: string) => {
    const updatedInp = [...inputTexts];
    updatedInp[index] = value;
    setInputTexts(updatedInp);
  };

  // Function to generate the meme
  const generateMeme = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < inputTexts.length; i++) {
        if (inputTexts[i]) {
          inputTexts[i] = inputTexts[i].trim(); // Assign the trimmed string back to the array
        }
      }
      const params = new URLSearchParams();
      params.append("template_id", id!);
      params.append("username", "akasha_");
      params.append("password", "aaa!1234");

      // Add all text values from inputTexts to the query parameters
      inputTexts.forEach((text, index) => {
        params.append(`boxes[${index}][text]`, text);
        params.append(`boxes[${index}][max_font_size]`, "25"); // Adjust font size to 30px or smaller
      });

      const response = await fetch(
        `https://api.imgflip.com/caption_image?${params.toString()}`,
        {
          method: "POST", // POST method for creating a meme
        }
      );

      const result = await response.json();
      if (result.success) {
        setMemeUrl(result.data.url); // Set the generated meme URL if successful
        // Fetch the image as a blob for downloading
        const imageResponse = await fetch(result.data.url);
        const blob = await imageResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        setDownloadUrl(blobUrl); // Set the blob URL for downloading
        setLoading(false);
      } else {
        console.error("Error generating meme:", result.error_message); // Log any API errors
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log fetch errors
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while generating the meme. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <h2 className="text-center text-[22px] sm:text-[33px] py-3 text-[#000] font-semibold">
        Selected Meme Template: {name}
      </h2>

      {/* Show the template image */}
      {url && !memeUrl ? (
        <Image
          className="m-auto shadow-lg p-1"
          src={url}
          width={450}
          height={450}
          alt="memeimg"
        />
      ) : null}

      {/* Show the generated meme */}
      {memeUrl && (
        <div className="m-auto w-[100%] sm:w-[500px] border-2 p-3 rounded-md mt-10">
          <Image
            width={500}
            height={500}
            src={memeUrl}
            quality={75}
            alt={name}
          />
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={name}
              className="btn btn-primary mt-4"
            >
              Download Meme
            </a>
          )}
        </div>
      )}

      {/* Meme text input fields */}
      <div>
        <div className="flex flex-col gap-4 w-[100%] sm:w-[450px] m-auto mt-[70px] shadow-lg p-4 rounded-md">
          <h1 className="text-center text-2xl font-semibold">
            ENTER MEME TEXT
          </h1>
          {inputTexts.length > 0 &&
            inputTexts.map((_, index) => (
              <input
                type="text"
                key={index}
                onChange={(e) => handleInput(index, e.target.value)}
                placeholder={`Text for box ${index + 1}`}
                className="input input-bordered input-success w-full mb-2"
              />
            ))}
          <button
            onClick={generateMeme}
            className="btn btn-outline btn-primary mb-4"
            disabled={loading}
          >
            {loading ? "Creating Meme..." : "Generate Meme"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MemeGeneratorPage;
